import React, { useState, useEffect } from 'react';
import { API_URL } from '../../constants';
import type { OfferWall } from '../../types';
import { dataService } from '../../services/dataService';

const ToggleSwitch: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
    <button
        onClick={onToggle}
        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-green-500' : 'bg-slate-300'}`}
    >
        <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
        />
    </button>
);

const OfferControlPage: React.FC = () => {
    const [offerWalls, setOfferWalls] = useState<OfferWall[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOfferWalls = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Authentication failed.");
                setIsLoading(false);
                return;
            }
            try {
                const response = await fetch(`${API_URL}/api/admin/offer-walls`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const contentType = response.headers.get('content-type') || '';
                if (!response.ok || !contentType.includes('application/json')) {
                    const data = await dataService.getOfferWalls();
                    setOfferWalls(data);
                    return;
                }
                const data: OfferWall[] = await response.json();
                setOfferWalls(data);
            } catch (err: any) {
                const data = await dataService.getOfferWalls();
                setOfferWalls(data);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOfferWalls();
    }, []);

    const handleToggle = async (id: number, currentStatus: boolean) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Authentication failed.');
            return;
        }

        const originalWalls = [...offerWalls];
        const updatedWalls = offerWalls.map(wall => wall.id === id ? { ...wall, isEnabled: !currentStatus } : wall);
        setOfferWalls(updatedWalls);

        try {
            const response = await fetch(`${API_URL}/api/admin/offer-walls/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isEnabled: !currentStatus })
            });
            if (!response.ok) {
                throw new Error('Failed to update status.');
            }
        } catch (err) {
            alert('Error updating status. Reverting changes.');
            setOfferWalls(originalWalls);
        }
    };

    if (isLoading) return <div>Loading offer walls...</div>;
    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Offer Wall Control</h2>
                <p className="text-slate-500 mt-1">Enable or disable offer walls for all users.</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                        <tr className="text-left text-slate-500">
                            <th className="p-3 font-semibold">Offer Wall</th>
                            <th className="p-3 font-semibold text-center">Status</th>
                            <th className="p-3 font-semibold text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700">
                        {offerWalls.map(wall => (
                            <tr key={wall.id} className="border-b border-slate-200">
                                <td className="p-3 flex items-center gap-3">
                                    {wall.logo && wall.logo.trim() !== '' ? (
                                        <img src={wall.logo} alt={wall.name} className="h-8 w-auto bg-slate-100 p-1 rounded-md" />
                                    ) : (
                                        <span className="h-8 w-8 flex items-center justify-center bg-slate-100 rounded-md font-bold text-xs">{wall.name.charAt(0)}</span>
                                    )}
                                    <span className="font-medium text-slate-800">{wall.name}</span>
                                </td>
                                <td className="p-3 text-center">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${wall.isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {wall.isEnabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="p-3 text-center">
                                    <ToggleSwitch enabled={wall.isEnabled} onToggle={() => handleToggle(wall.id, wall.isEnabled)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OfferControlPage;
