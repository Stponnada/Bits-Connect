
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, Campus, RelationshipStatus } from '../../types';
import { BRANCHES, ADMISSION_YEARS, CLUBS } from '../../constants';

export const ProfileSetup: React.FC = () => {
    const { currentUser, setCurrentUser } = useApp();
    const [profile, setProfile] = useState<Partial<UserProfile>>({
        name: currentUser?.profile.name || '',
        campus: currentUser?.profile.campus,
        branch: currentUser?.profile.branch,
        dormBuilding: currentUser?.profile.dormBuilding,
        dormRoom: currentUser?.profile.dormRoom,
        admissionYear: currentUser?.profile.admissionYear || undefined,
        diningHall: currentUser?.profile.diningHall,
        clubs: currentUser?.profile.clubs || [],
        relationshipStatus: currentUser?.profile.relationshipStatus,
        bio: currentUser?.profile.bio || '',
    });
    const [availableClubs, setAvailableClubs] = useState<string[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (profile.campus) {
            setAvailableClubs(CLUBS[profile.campus]);
            setProfile(p => ({ ...p, clubs: [] })); // Reset clubs on campus change
        } else {
            setAvailableClubs([]);
        }
    }, [profile.campus]);
    
    if (!currentUser) return null;
    
    const inputStyle = "mt-1 block w-full bg-bits-medium-dark border-transparent rounded-md shadow-sm py-2 px-3 text-bits-text focus:outline-none focus:ring-2 focus:ring-bits-red focus:border-bits-red sm:text-sm";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };
    
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setProfile(prev => ({ ...prev, admissionYear: parseInt(e.target.value, 10) }));
    };

    const handleClubToggle = (club: string) => {
        setProfile(p => {
            const currentClubs = p.clubs || [];
            const newClubs = currentClubs.includes(club)
                ? currentClubs.filter(c => c !== club)
                : [...currentClubs, club];
            return { ...p, clubs: newClubs };
        });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!profile.name?.trim() || !profile.admissionYear || !profile.campus) {
            setError('Please fill in all required fields: Full Name, Campus, and Admission Year.');
            return;
        }

        const updatedUser = {
            ...currentUser,
            profile: {
                ...currentUser.profile,
                ...profile,
                admissionYear: profile.admissionYear!,
                name: profile.name!.trim(),
            },
        };
        setCurrentUser(updatedUser);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bits-dark p-4 text-bits-text">
            <div className="w-full max-w-2xl bg-bits-light-dark rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center text-bits-red mb-2">Almost there!</h1>
                <p className="text-center text-bits-text-muted mb-8">Let's set up your profile so others can find you.</p>

                {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-md mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div>
                            <label className="block text-sm font-medium text-bits-text-muted">Full Name <span className="text-bits-red">*</span></label>
                            <input type="text" name="name" value={profile.name} onChange={handleChange} required className={inputStyle} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-bits-text-muted">Campus <span className="text-bits-red">*</span></label>
                            <select name="campus" value={profile.campus || ''} onChange={handleChange} required className={inputStyle}>
                                <option value="" disabled>Select Campus</option>
                                {Object.values(Campus).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-bits-text-muted">Admission Year <span className="text-bits-red">*</span></label>
                            <select name="admissionYear" value={profile.admissionYear || ''} onChange={handleYearChange} required className={inputStyle}>
                                <option value="" disabled>Select Year</option>
                                {ADMISSION_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-bits-text-muted">Branch</label>
                            <select name="branch" value={profile.branch || ''} onChange={handleChange} className={inputStyle}>
                                <option value="">Select Branch</option>
                                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-bits-text-muted">Relationship Status</label>
                            <select name="relationshipStatus" value={profile.relationshipStatus || ''} onChange={handleChange} className={inputStyle}>
                                <option value="">Select Status</option>
                                {Object.values(RelationshipStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-bits-text-muted">Dorm Building</label>
                            <input type="text" name="dormBuilding" value={profile.dormBuilding || ''} onChange={handleChange} className={inputStyle} placeholder="e.g. Ram Bhawan" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-bits-text-muted">Dorm Room</label>
                            <input type="text" name="dormRoom" value={profile.dormRoom || ''} onChange={handleChange} className={inputStyle} placeholder="e.g. 101" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-bits-text-muted">Dining Hall</label>
                            <input type="text" name="diningHall" value={profile.diningHall || ''} onChange={handleChange} className={inputStyle} placeholder="e.g. Mess 1" />
                        </div>
                     </div>
                     
                    {profile.campus && availableClubs.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-bits-text-muted mb-2">Clubs</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto bg-bits-medium-dark p-3 rounded-md">
                                {availableClubs.map(club => (
                                    <label key={club} className="flex items-center space-x-2 text-sm cursor-pointer select-none">
                                        <input type="checkbox" checked={(profile.clubs || []).includes(club)} onChange={() => handleClubToggle(club)} className="rounded text-bits-red bg-bits-dark border-bits-text-muted focus:ring-bits-red" />
                                        <span>{club}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium text-bits-text-muted">Bio</label>
                        <textarea name="bio" value={profile.bio || ''} onChange={handleChange} rows={3} className={inputStyle} placeholder="Tell us a little about yourself..."></textarea>
                    </div>

                    <div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-bits-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bits-light-dark focus:ring-bits-red transition-colors duration-200">
                            Save Profile & Continue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
