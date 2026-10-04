import React, { useState, useEffect, useContext } from 'react';
import OfferWallCard from '../OfferWallCard';
import type { OfferWall } from '../../types';
import { API_URL } from '../../constants';
import { dataService } from '../../services/dataService';
import SkeletonLoader from '../SkeletonLoader';
import { AppContext } from '../../App';

const SectionHeader: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="flex justify-between items-center mb-6">
        <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
            <p className="text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    </div>
);

const OfferPage: React.FC = () => {
    const [offerWalls, setOfferWalls] = useState<OfferWall[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOfferWalls = async () => {
            try {
                const data = await dataService.getOfferWalls();
                setOfferWalls(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOfferWalls();
    }, []);

    const displayOfferWalls = React.useMemo(() => {
        const seen = new Set<string>();
        return offerWalls.filter((w) => {
            const key = (w.name || '').trim().toLowerCase();
            if (!key || seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [offerWalls]);

    return (
        <div className="space-y-8">
            <section>
                <SectionHeader title="Offer Walls" description="Each offer wall contains hundreds of offers to complete" />
                {isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {[...Array(12)].map((_, i) => <SkeletonLoader key={i} className="h-48 rounded-2xl" />)}
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                         {displayOfferWalls.map((wall) => (
                            <OfferWallCard key={wall.id || wall.name} wall={wall} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default OfferPage;
