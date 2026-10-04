import React, { useState, useEffect, useRef, useContext } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import SkeletonLoader from '../SkeletonLoader';
import SurveyProviderCard from '../SurveyProviderCard';
import OfferWallCard from '../OfferWallCard';
import type { SurveyProvider, OfferWall } from '../../types';
import { API_URL } from '../../constants';
import { AppContext } from '../../App';
import { dataService } from '../../services/dataService';

const featuredTasks = [
  { image: 'https://res.cloudinary.com/dsezfqke7/image/upload/v1765514128/Highroller_Vegas_qdgfic.jpg', title: 'Highroller Vegas', description: 'Complete all steps list', payout: 2.50 },
  { image: 'https://shorturl.at/WFqAo', title: 'Wild Fish - Android...', description: 'Be the best fisherman...', payout: 1.75 },
  { image: 'https://shorturl.at/SFXpL', title: 'CortalyCash', description: 'Complete all steps list...', payout: 5.00 },
  { image: 'https://res.cloudinary.com/dsezfqke7/image/upload/v1765514010/Water_Color_Sorting_xnw4dp.jpg', title: 'Water Color Sorting', description: 'Complete all steps list', payout: 0.80 },
  { image: 'https://res.cloudinary.com/dsezfqke7/image/upload/v1765514208/Bingo_Vacation_astyjb.jpg', title: 'Bingo Vacation', description: 'Complete all steps list', payout: 3.20 },
  { image: 'https://res.cloudinary.com/dsezfqke7/image/upload/v1765514277/The_Grand_Mafia_r9ngj1.jpg', title: 'The Grand Mafia', description: 'Complete all steps list', payout: 1.10 },
];

const featuredSurveys = [
  { title: 'Qualification', duration: '1 minute', payout: 0.25 },
  { title: 'Daily Poll', duration: '30 seconds', payout: 0.10 },
  { title: 'Shopping Habits', duration: '5 minutes', payout: 1.50 },
  { title: 'Tech Gadgets Opinion', duration: '10 minutes', payout: 2.00 },
  { title: 'Travel Preferences', duration: '8 minutes', payout: 1.75 },
  { title: 'YourNext TV Show', duration: '3 minutes', payout: 0.75 },
];

interface AIRecommendation {
    title: string;
    description: string;
    payout: number;
    icon: string;
}

const SectionHeader: React.FC<{ title: string, description: string }> = ({ title, description }) => (
    <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-300 bg-gradient-to-r from-blue-100/80 via-indigo-100/80 to-purple-100/70 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/30 border border-white/60 dark:border-white/5 backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Featured picks
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
                <p className="text-slate-500 dark:text-slate-400">{description}</p>
            </div>
        </div>
        <a href="#" className="text-blue-500 dark:text-blue-400 font-semibold hover:underline flex-shrink-0">View All</a>
    </div>
);

const LoggedInHomePage: React.FC = () => {
    const { user } = useContext(AppContext);
    const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
    const [isLoadingRecs, setIsLoadingRecs] = useState(true);
    const [errorRecs, setErrorRecs] = useState<string | null>(null);
    const aiRef = useRef<GoogleGenAI | null>(null);

    const [offerWalls, setOfferWalls] = useState<OfferWall[]>([]);
    const [surveyProviders, setSurveyProviders] = useState<SurveyProvider[]>([]);
    const [isLoadingContent, setIsLoadingContent] = useState(true);
    const [errorContent, setErrorContent] = useState<string | null>(null);

    useEffect(() => {
        const fetchPageContent = async () => {
            try {
                const token = localStorage.getItem("token");
                const [offersData, surveysData] = await Promise.all([
                    dataService.getOfferWalls(),
                    dataService.getSurveyProviders(token),
                ]);

                setOfferWalls(offersData);
                setSurveyProviders(surveysData);

            } catch (err: any) {
                setErrorContent(err.message);
            } finally {
                setIsLoadingContent(false);
            }
        };

        fetchPageContent();
    }, []);

    useEffect(() => {
        if (process.env.API_KEY) {
            aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
            fetchRecommendations();
        } else {
            setIsLoadingRecs(false);
            setErrorRecs("API key not found.");
        }
    }, []);

    const fetchRecommendations = async () => {
        if (!aiRef.current) return;
        setIsLoadingRecs(true);
        setErrorRecs(null);
        try {
            const prompt = "Based on a user who enjoys mobile games and quick surveys, generate 3 fictional but realistic and engaging task recommendations for an earning website. Include a title, short description, a plausible payout as a number, and a relevant Font Awesome icon class name (e.g., 'fas fa-gamepad').";
            
            const response = await aiRef.current.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            recommendations: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        title: { type: Type.STRING },
                                        description: { type: Type.STRING },
                                        payout: { type: Type.NUMBER },
                                        icon: { type: Type.STRING }
                                    },
                                    required: ["title", "description", "payout", "icon"],
                                }
                            }
                        }
                    }
                }
            });

            const jsonResponse = JSON.parse(response.text);
            if (jsonResponse.recommendations) {
                setRecommendations(jsonResponse.recommendations);
            } else {
                throw new Error("Invalid response format from AI.");
            }
        } catch (err) {
            console.error("Error fetching AI recommendations:", err);
            setErrorRecs("Could not load recommendations.");
        } finally {
            setIsLoadingRecs(false);
        }
    };

    return (
        <div className="space-y-12">
            {/* Recommended for you */}
           {/* <section>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recommended for You</h2>
                    <p className="text-slate-500 dark:text-slate-400">AI-powered suggestions based on your activity</p>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {isLoadingRecs ? (
                        [...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#1e293b] p-6 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-4">
                                <SkeletonLoader className="w-12 h-12 rounded-lg flex-shrink-0" />
                                <div className="flex-1">
                                    <SkeletonLoader className="h-5 w-3/4 mb-2" />
                                    <SkeletonLoader className="h-4 w-full mb-3" />
                                    <SkeletonLoader className="h-6 w-1/2" />
                                </div>
                            </div>
                        ))
                    ) : errorRecs ? (
                         <div className="col-span-full text-center py-8 bg-white dark:bg-[#1e293b] rounded-lg border border-slate-200 dark:border-slate-800">
                             <p className="text-red-500">{errorRecs}</p>
                         </div>
                    ) : (
                        recommendations.map((rec, index) => (
                            <div key={index} className="bg-white dark:bg-[#1e293b] p-6 rounded-lg border border-slate-200 dark:border-slate-800 flex gap-4 items-start hover:-translate-y-1 transition-transform cursor-pointer">
                                <div className="bg-blue-500/10 text-blue-500 dark:text-blue-400 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <i className={`${rec.icon} text-2xl`}></i>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white">{rec.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-3">{rec.description}</p>
                                    <p className="font-bold text-green-500 dark:text-green-400 text-lg">${rec.payout.toFixed(2)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section> */}

            {/* Featured Tasks */}
<section className="relative overflow-hidden rounded-3xl border border-white/70 dark:border-white/5 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-[#0f172a] dark:via-[#0a1222] dark:to-[#0b1020] p-6 shadow-sm">
    <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-12 -right-6 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />
    </div>
    <SectionHeader title="Featured Tasks" description="Featured tasks are the best tasks to complete, with the highest rewards" />
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative">
        {featuredTasks.map((task, index) => (
            <div
                key={index}
                className="rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-200 border border-white/70 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 shadow-sm backdrop-blur"
            >
                <div className="relative">
                    {task.image && task.image.trim() !== '' ? (
                        <img src={task.image} alt={task.title} className="w-full aspect-[4/3] object-cover" />
                    ) : (
                        <div className="w-full aspect-[4/3] bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                            {task.title.charAt(0)}
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-3 flex-grow flex flex-col">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-500 dark:group-hover:text-blue-400">{task.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate flex-grow">{task.description}</p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200/70 dark:border-white/10">
                        <p className="font-bold text-green-500 dark:text-green-400">${(Number(task?.payout) || 0).toFixed(2)}</p>
                        <button
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold py-1 px-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-sm"
                        >
                            Complete
                        </button>
                    </div>
                </div>
            </div>
        ))}
    </div>
</section>


{/* Featured Surveys */}
{/* <section className="relative overflow-hidden rounded-3xl border border-white/70 dark:border-white/5 bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 dark:from-[#0c1324] dark:via-[#0a142a] dark:to-[#0d1a33] p-6 shadow-sm">
    <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-8 right-4 h-28 w-28 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-indigo-500/10 blur-3xl" />
    </div>
    <SectionHeader title="Featured Surveys" description="Explore our handpicked selection of surveys just for you" />
     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4 relative">
        {featuredSurveys.map((survey, index) => (
             <div
                key={index}
                className="rounded-2xl p-4 flex flex-col group cursor-pointer hover:-translate-y-1 transition-transform border border-white/70 dark:border-white/10 bg-white/85 dark:bg-slate-900/60 shadow-sm backdrop-blur"
            >
                 <div className="w-full aspect-square bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-[#12233e] dark:via-[#0f1d34] dark:to-[#0e1a30] rounded-xl flex items-center justify-center mb-3 border border-white/70 dark:border-white/10">
                     <i className="fas fa-clipboard-list text-4xl text-blue-500 dark:text-blue-400"></i>
                 </div>
                <div className="flex-grow">
                     <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400">{survey.title}</h3>
                     <p className="text-sm text-slate-500 dark:text-slate-400">{survey.duration}</p>
                </div>
                 <div className="flex justify-between items-center mt-3 pt-3 w-full border-t border-slate-200/70 dark:border-white/10">
                    <p className="font-bold text-green-500 dark:text-green-400">${survey.payout.toFixed(2)}</p>
                    <button
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold py-1 px-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-sm"
                    >
                        Complete
                    </button>
                </div>
             </div>
        ))}
    </div>
</section> */}
        
            
            {/* Offer Walls */}
<section className="relative overflow-hidden rounded-3xl border border-white/70 dark:border-white/5 bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 dark:from-[#0b1222] dark:via-[#0b182c] dark:to-[#0c1f36] p-6 shadow-sm">
    <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-8 h-24 w-24 rounded-full bg-indigo-400/15 blur-3xl" />
        <div className="absolute -bottom-10 right-4 h-28 w-28 rounded-full bg-blue-500/12 blur-3xl" />
    </div>
    <SectionHeader title="Offer Walls" description="Each offer wall contains hundreds of offers to complete" />
     {isLoadingContent ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 relative">
            {[...Array(6)].map((_, i) => <SkeletonLoader key={i} className="h-48 rounded-2xl" />)}
        </div>
    ) : errorContent ? (
        <div className="text-center py-12 text-red-500">{errorContent}</div>
    ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 relative">
             {offerWalls.map((wall) => (
                <OfferWallCard key={wall.id} wall={wall} />
            ))}
        </div>
    )}
</section>

 {/* Survey Walls */}
<section className="relative overflow-hidden rounded-3xl border border-white/70 dark:border-white/5 bg-gradient-to-r from-sky-50 via-indigo-50 to-blue-50 dark:from-[#0a1527] dark:via-[#0a1a30] dark:to-[#0b2038] p-6 shadow-sm">
    <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-12 right-0 h-32 w-32 rounded-full bg-sky-400/15 blur-3xl" />
        <div className="absolute bottom-4 left-12 h-24 w-24 rounded-full bg-indigo-500/12 blur-3xl" />
    </div>
    <SectionHeader title="Survey Walls" description="Each survey wall contains hundreds of surveys to complete" />
     {isLoadingContent ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 relative">
            {[...Array(5)].map((_, i) => <SkeletonLoader key={i} className="h-48 rounded-2xl" />)}
        </div>
    ) : errorContent ? (
        <div className="text-center py-12 text-red-500">{errorContent}</div>
    ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 relative">
             {surveyProviders.map((wall) => (
                 <SurveyProviderCard key={wall.id} provider={wall} />
             ))}
        </div>
    )}
</section>

        </div>
    );
};

export default LoggedInHomePage;
