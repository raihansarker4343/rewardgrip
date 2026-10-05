// backend/routes/offers/skylup.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

const { USER_PAYOUT_RATIO, toMoney } = require('../../config/earnings');

// Cache offers in memory for 10 minutes to minimize latency and avoid rate limits
let offersCache = {
  timestamp: 0,
  data: []
};
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

router.get('/skylup', async (req, res) => {
  try {
    const now = Date.now();
    const apiKey = process.env.SKYLUP_API_KEY || 'd8015b3f-68d9-45ca-8627-778af989f957';
    const userCountry = req.headers['cf-ipcountry'] || req.query.country || '';

    if (offersCache.data.length > 0 && (now - offersCache.timestamp < CACHE_DURATION_MS)) {
      return res.json({
        success: true,
        source: 'cache',
        count: offersCache.data.length,
        offers: offersCache.data
      });
    }

    const apiUrl = `https://feed.skylup.swaarm-clients.com/feed/v1.3/ads?api_key=${apiKey}`;
    const response = await axios.get(apiUrl, { timeout: 15000 });

    if (!response.data || !Array.isArray(response.data.ads)) {
      throw new Error('Invalid response structure from Skylup Feed API');
    }

    const rawAds = response.data.ads;
    const ratio = USER_PAYOUT_RATIO || 0.7;

    const formattedOffers = rawAds
      .filter(ad => ad.status === 'active' && Number(ad.payout) > 0)
      .map(ad => {
        const rawPayout = Number(ad.payout) || 0;
        const userUsd = toMoney(rawPayout * ratio);
        const coins = Math.round(userUsd * 100);

        // Best available icon/creative
        let icon = ad.creatives_url || null;
        if (!icon && ad.creative_packs && ad.creative_packs[0]?.creatives?.[0]?.url) {
          icon = ad.creative_packs[0].creatives[0].url;
        }

        // Clean HTML tags from description if present
        let cleanDesc = (ad.description || ad.kpi || ad.additional_information || '').replace(/<[^>]+>/g, '').trim();

        // Detect if this is a survey or opinion research task
        const textToScan = `${ad.name} ${cleanDesc} ${(ad.tags || []).join(' ')} ${ad.kpi || ''}`.toLowerCase();
        const isSurvey = textToScan.includes('survey') || textToScan.includes('ipsos') || textToScan.includes('opinion') || textToScan.includes('poll') || textToScan.includes('panel');
        const tags = Array.isArray(ad.tags) ? [...ad.tags] : [];
        if (isSurvey && !tags.includes('SURVEY')) {
          tags.push('SURVEY');
        }

        return {
          id: ad.id,
          name: ad.name,
          description: cleanDesc,
          raw_payout: rawPayout,
          user_payout: userUsd,
          coins: coins,
          icon: icon,
          click_url: ad.click_url,
          preview_url: ad.preview_url,
          tags: tags,
          is_survey: isSurvey,
          leadflow: ad.leadflow || 'CPA',
          os: ad.targeting?.allowedDeviceTargeting?.os || 'ALL',
          countries: ad.targeting?.allowedGeoTargeting?.countries || []
        };
      });

    // Update in-memory cache
    offersCache = {
      timestamp: now,
      data: formattedOffers
    };

    console.log(`[Skylup Feed] Fetched and cached ${formattedOffers.length} active offers.`);

    res.json({
      success: true,
      source: 'live',
      count: formattedOffers.length,
      offers: formattedOffers
    });

  } catch (error) {
    console.error('[Skylup Feed Error]:', error.message);
    if (offersCache.data.length > 0) {
      return res.json({
        success: true,
        source: 'stale_cache',
        count: offersCache.data.length,
        offers: offersCache.data
      });
    }
    res.status(500).json({ success: false, message: 'Failed to load Skylup offers.' });
  }
});

module.exports = router;
