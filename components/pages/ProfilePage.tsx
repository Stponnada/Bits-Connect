
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Post as PostComponent } from './Post';
import { ChatIcon } from '../icons';
import { Post, User, UserProfile, Campus, RelationshipStatus } from '../../types';
import { BRANCHES, ADMISSION_YEARS, CLUBS } from '../../constants';

const ProfileDetail: React.FC<{ label: string; value?: string | number | string[] }> = ({ label, value }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
        return null;
    }
    const displayValue = Array.isArray(value) ? value.join(', ') : value;
    return (
        <div className="text-bits-text-muted">
            <span className="font-semibold text-bits-text">{label}: </span>
            {displayValue}
        </div>
    );
};

interface EditProfileModalProps {
    user: User;
    onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose }) => {
    const { setCurrentUser, setUsers } = useApp();
    const [profile, setProfile] = useState<UserProfile>(user.profile);
    const [availableClubs, setAvailableClubs] = useState<string[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (profile.campus) {
            const campusClubs = CLUBS[profile.campus as Campus] || [];
            setAvailableClubs(campusClubs);
            // Filter out clubs that don't belong to the selected campus
            setProfile(p => ({ ...p, clubs: p.clubs?.filter(club => campusClubs.includes(club)) || [] }));
        } else {
            setAvailableClubs([]);
        }
    }, [profile.campus]);

    const inputStyle = "mt-1 block w-full bg-bits-medium-dark border-transparent rounded-md shadow-sm py-2 px-3 text-bits-text focus:outline-none focus:ring-2 focus:ring-bits-red focus:border-bits-red sm:text-sm";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleClubToggle = (club: string) => {
        setProfile(p => {
            const currentClubs = p.clubs || [];
            const newClubs = currentClubs.includes(club)
                ? currentClubs.filter(c => c !== club)
                : [...currentClubs, club];
            return { ...p, clubs: newClubs };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!profile.name?.trim()) {
            setError('Full Name is a required field.');
            return;
        }

        const updatedUser = { ...user, profile };
        setCurrentUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => (u.id === user.id ? updatedUser : u)));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-bits-light-dark rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-bits-red">Edit Profile</h2>
                        <button type="button" onClick={onClose} className="text-bits-text-muted hover:text-bits-text">&times;</button>
                    </div>

                    {error && <p className="bg-red-500/20 text-red-400 text-sm p-3 rounded-md mb-4">{error}</p>}

                    <div className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-bits-text-muted">Profile Picture URL</label>
                                <input type="text" name="avatar" value={profile.avatar} onChange={handleChange} className={inputStyle} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-bits-text-muted">Banner URL</label>
                                <input type="text" name="banner" value={profile.banner || ''} onChange={handleChange} className={inputStyle} />
                            </div>
                        </div>

                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div>
                                <label className="block text-sm font-medium text-bits-text-muted">Full Name <span className="text-bits-red">*</span></label>
                                <input type="text" name="name" value={profile.name} onChange={handleChange} required className={inputStyle} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-bits-text-muted">Campus <span className="text-bits-red">*</span></label>
                                <select name="campus" value={profile.campus || ''} onChange={handleChange} required className={inputStyle}>
                                    {Object.values(Campus).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-bits-text-muted">Admission Year <span className="text-bits-red">*</span></label>
                                <select name="admissionYear" value={profile.admissionYear || ''} onChange={e => setProfile(p => ({...p, admissionYear: parseInt(e.target.value)}))} required className={inputStyle}>
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
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto bg-bits-medium-dark p-3 rounded-md">
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

                        <div className="flex justify-end space-x-4 pt-4">
                            <button type="button" onClick={onClose} className="py-2 px-6 border border-bits-medium-dark rounded-full text-sm font-medium text-bits-text hover:bg-bits-medium-dark">
                                Cancel
                            </button>
                            <button type="submit" className="py-2 px-6 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-bits-red hover:bg-red-700">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const ProfilePage: React.FC = () => {
    const { currentUser, viewedProfileId, findUserById, posts, setCurrentPage, setActiveChatUserId } = useApp();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const userToDisplay = viewedProfileId ? findUserById(viewedProfileId) : currentUser;

    if (!userToDisplay) {
        return (
            <div className="text-center py-10 text-bits-text">
                <h2 className="text-2xl font-bold">User not found</h2>
                <p className="text-bits-text-muted mt-2">The user you are looking for does not exist.</p>
            </div>
        );
    }

    const isOwnProfile = userToDisplay.id === currentUser?.id;

    const userPosts = posts
        .filter((post: Post) => post.authorId === userToDisplay.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const handleStartChat = () => {
        if (userToDisplay) {
            setActiveChatUserId(userToDisplay.id);
            setCurrentPage('chat');
        }
    };
    
    return (
        <>
        {isEditModalOpen && currentUser && <EditProfileModal user={currentUser} onClose={() => setIsEditModalOpen(false)} />}
        <div className="w-full max-w-4xl mx-auto pb-10">
            <div className="h-48 sm:h-64 bg-bits-medium-dark relative">
                {userToDisplay.profile.banner ? (
                    <img src={userToDisplay.profile.banner} alt={`${userToDisplay.profile.name}'s banner`} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-700 via-gray-900 to-black"></div>
                )}
            </div>
            
            <div className="px-4 sm:px-6 relative">
                <div className="flex items-end -mt-16 sm:-mt-20">
                    <img src={userToDisplay.profile.avatar} alt={userToDisplay.profile.name} className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-bits-dark bg-bits-dark relative z-10" />
                    <div className="ml-auto pb-4 flex space-x-4">
                        {isOwnProfile && (
                             <button onClick={() => setIsEditModalOpen(true)} className="bg-bits-medium-dark text-white font-bold py-2 px-4 rounded-full hover:bg-bits-light-dark border border-bits-medium-dark transition-colors duration-200">
                                Edit Profile
                            </button>
                        )}
                        {!isOwnProfile && (
                             <button onClick={handleStartChat} className="flex items-center bg-bits-red text-white font-bold py-2 px-4 rounded-full hover:bg-red-700 transition-colors duration-200">
                                <ChatIcon className="w-5 h-5 mr-2" />
                                Message
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-4">
                    <h1 className="text-3xl font-bold">{userToDisplay.profile.name}</h1>
                    <p className="text-bits-text-muted">@{userToDisplay.username}</p>
                    {userToDisplay.profile.campus && userToDisplay.profile.admissionYear && (
                        <div className="mt-2 flex items-center space-x-2 text-sm text-bits-text-muted">
                            <span>{userToDisplay.profile.campus} Campus</span>
                            <span className="text-gray-500">&middot;</span>
                            <span>Class of {userToDisplay.profile.admissionYear + (userToDisplay.profile.branch?.startsWith('M.Sc.') ? 5 : 4)}</span>
                        </div>
                    )}
                </div>

                {userToDisplay.profile.bio && (
                    <p className="mt-4 text-bits-text whitespace-pre-wrap">{userToDisplay.profile.bio}</p>
                )}

                <div className="mt-6 border-t border-bits-medium-dark pt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <ProfileDetail label="Branch" value={userToDisplay.profile.branch} />
                    <ProfileDetail label="Relationship Status" value={userToDisplay.profile.relationshipStatus} />
                    <ProfileDetail label="Dorm" value={userToDisplay.profile.dormBuilding && `${userToDisplay.profile.dormBuilding}${userToDisplay.profile.dormRoom ? `, Room ${userToDisplay.profile.dormRoom}` : ''}`} />
                    <ProfileDetail label="Dining Hall" value={userToDisplay.profile.diningHall} />
                     <div className="sm:col-span-2">
                        <ProfileDetail label="Clubs" value={userToDisplay.profile.clubs} />
                    </div>
                </div>
            </div>

            <div className="mt-8 border-t border-bits-medium-dark">
                <h2 className="text-xl font-bold px-4 sm:px-6 pt-6">Posts</h2>
                <div className="px-0 sm:px-6 pb-6 mt-4">
                    {userPosts.length > 0 ? (
                        <div className="space-y-4">
                            {userPosts.map(post => <PostComponent key={post.id} post={post} />)}
                        </div>
                    ) : (
                        <div className="bg-bits-light-dark rounded-lg p-8 text-center text-bits-text-muted mx-4 sm:mx-0">
                            <p>
                                {isOwnProfile ? "You haven't posted anything yet." : `${userToDisplay.profile.name} hasn't posted anything yet.`}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};
