import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, Campus, RelationshipStatus } from '../../types';
import { BRANCHES, ADMISSION_YEARS, CLUBS } from '../../constants';
import { supabase } from '../../supabaseClient';

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
        avatarFile: undefined, // optional: file object for new avatar
    });
    const [availableClubs, setAvailableClubs] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
        const { name, value, files } = e.target as any;
        if (name === 'avatar' && files?.[0]) {
            setProfile(prev => ({ ...prev, avatarFile: files[0] }));
        } else {
            setProfile(prev => ({ ...prev, [name]: value }));
        }
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!profile.name?.trim() || !profile.admissionYear || !profile.campus) {
            setError('Please fill in all required fields: Full Name, Campus, and Admission Year.');
            return;
        }

        try {
            let avatarUrl = currentUser.profile.avatar;

            // --- Upload avatar if a new file was selected ---
            if (profile.avatarFile) {
                const { data: uploadData, error: uploadError } = await supabase
                    .storage
                    .from('avatars')
                    .upload(`avatars/${currentUser.id}_${Date.now()}`, profile.avatarFile);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase
                    .storage
                    .from('avatars')
                    .getPublicUrl(uploadData.path);

                avatarUrl = publicUrlData.publicUrl;
            }

            // --- Update user profile in Supabase database ---
            const { data: dbData, error: dbError } = await supabase
                .from('profiles')
                .update({
                    name: profile.name.trim(),
                    campus: profile.campus,
                    branch: profile.branch,
                    dormBuilding: profile.dormBuilding,
                    dormRoom: profile.dormRoom,
                    admissionYear: profile.admissionYear,
                    diningHall: profile.diningHall,
                    clubs: profile.clubs,
                    relationshipStatus: profile.relationshipStatus,
                    bio: profile.bio,
                    avatar: avatarUrl,
                })
                .eq('id', currentUser.id)
                .select()
                .single();

            if (dbError) throw dbError;

            // --- Update local context ---
            setCurrentUser({
                ...currentUser,
                profile: dbData,
            });

            setSuccess('Profile updated successfully!');

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to update profile.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bits-dark p-4 text-bits-text">
            <div className="w-full max-w-2xl bg-bits-light-dark rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center text-bits-red mb-2">Almost there!</h1>
                <p className="text-center text-bits-text-muted mb-8">Let's set up your profile so others can find you.</p>

                {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-md mb-4">{error}</p>}
                {success && <p className="bg-green-500/20 text-green-400 text-sm p-3 rounded-md mb-4">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Existing input fields ... */}
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

                    {/* Avatar Upload */}
                    <div>
                        <label className="block text-sm font-medium text-bits-text-muted">Profile Picture</label>
                        <input type="file" name="avatar" accept="image/*" onChange={handleChange} className={inputStyle} />
                    </div>

                    {/* Keep the rest of your existing inputs (branch, dorm, clubs, bio...) */}
                    {/* ... */}
                    
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
