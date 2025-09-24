import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Post } from './Post';
import { Post as PostType, MediaType, PostMedia } from '../../types';
import { ImageIcon, VideoIcon, XCircleIcon } from '../icons';

const MediaPreview: React.FC<{ files: File[], onRemove: (fileName: string) => void }> = ({ files, onRemove }) => {
    if (files.length === 0) return null;

    return (
        <div className="mt-3 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {files.map(file => {
                const url = URL.createObjectURL(file);
                return (
                    <div key={file.name} className="relative group aspect-square">
                        {file.type.startsWith('image/') ? (
                            <img src={url} alt={file.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <video src={url} className="w-full h-full object-cover rounded-lg" />
                        )}
                        <button 
                            onClick={() => onRemove(file.name)} 
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove media"
                        >
                            <XCircleIcon className="w-6 h-6" />
                        </button>
                    </div>
                );
            })}
        </div>
    )
}

const CreatePost: React.FC = () => {
    const { currentUser, setPosts } = useApp();
    const [content, setContent] = useState('');
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
      // Clean up object URLs on unmount
      return () => {
        mediaFiles.forEach(file => URL.revokeObjectURL(URL.createObjectURL(file)));
      };
    }, [mediaFiles]);

    if (!currentUser) return null;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            setMediaFiles(prev => {
                // FIX: Explicitly type `f` as `File` to fix type inference issue.
                const existingNames = new Set(prev.map((f: File) => f.name));
                // FIX: Explicitly type `f` as `File` to fix type inference issue where it was being inferred as `unknown`.
                const uniqueNewFiles = newFiles.filter((f: File) => !existingNames.has(f.name));
                return [...prev, ...uniqueNewFiles].slice(0, 8); // Limit to 8 files
            });
             // Reset the input value to allow selecting the same file again
            event.target.value = '';
        }
    };

    const removeMediaFile = (fileName: string) => {
        setMediaFiles(prev => prev.filter(f => f.name !== fileName));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && mediaFiles.length === 0) return;

        const media: PostMedia[] = mediaFiles.map(file => ({
            url: URL.createObjectURL(file), // Using object URL for simplicity
            type: file.type.startsWith('image/') ? MediaType.IMAGE : MediaType.VIDEO,
        }));

        const newPost: PostType = {
            id: `post-${Date.now()}`,
            authorId: currentUser.id,
            content: content.trim(),
            media,
            timestamp: new Date().toISOString(),
            likes: [],
            dislikes: [],
            comments: [],
        };

        setPosts(prevPosts => [newPost, ...prevPosts]);
        setContent('');
        setMediaFiles([]);
    };
    
    const canPost = content.trim() || mediaFiles.length > 0;

    return (
        <div className="bg-bits-light-dark rounded-lg shadow p-5 mb-6">
            <div className="flex items-start">
                <img src={currentUser.profile.avatar} alt={currentUser.profile.name} className="w-12 h-12 rounded-full mr-4" />
                <form onSubmit={handleSubmit} className="w-full">
                    <textarea 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-bits-medium-dark rounded-lg p-3 text-bits-text placeholder-bits-text-muted focus:outline-none focus:ring-2 focus:ring-bits-red resize-none"
                        rows={3}
                        placeholder={`What's on your mind, ${currentUser.profile.name.split(' ')[0]}?`}
                    />
                     <MediaPreview files={mediaFiles} onRemove={removeMediaFile} />
                    <div className="flex justify-between items-center mt-3">
                        <div className="flex space-x-2">
                             <input type="file" ref={imageInputRef} onChange={handleFileChange} accept="image/*" multiple hidden />
                             <input type="file" ref={videoInputRef} onChange={handleFileChange} accept="video/*" multiple hidden />
                            <button type="button" onClick={() => imageInputRef.current?.click()} className="text-bits-text-muted hover:text-blue-500 p-2 rounded-full transition-colors">
                                <ImageIcon />
                            </button>
                             <button type="button" onClick={() => videoInputRef.current?.click()} className="text-bits-text-muted hover:text-green-500 p-2 rounded-full transition-colors">
                                <VideoIcon />
                            </button>
                        </div>
                        <button type="submit" className="bg-bits-red text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition-colors duration-200 disabled:opacity-50" disabled={!canPost}>
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const HomePage: React.FC = () => {
  const { posts, featuredPostId } = useApp();
  
  const sortedPosts = useMemo(() => {
    let postsToRender = [...posts];
    let featuredPost: PostType | undefined;

    if (featuredPostId) {
        featuredPost = postsToRender.find(p => p.id === featuredPostId);
        if (featuredPost) {
            postsToRender = postsToRender.filter(p => p.id !== featuredPostId);
        }
    }

    const normallySortedPosts = postsToRender.sort((a, b) => {
        const scoreA = a.likes.length - a.dislikes.length;
        const scoreB = b.likes.length - b.dislikes.length;
        if (scoreA !== scoreB) {
            return scoreB - scoreA;
        }
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return featuredPost ? [featuredPost, ...normallySortedPosts] : normallySortedPosts;
  }, [posts, featuredPostId]);

  return (
    <div className="w-full max-w-2xl mx-auto py-6">
        <CreatePost />
        {sortedPosts.length > 0 ? (
            sortedPosts.map((post) => (
                <Post key={post.id} post={post} isFeatured={post.id === featuredPostId}/>
            ))
        ) : (
             <div className="bg-bits-light-dark rounded-lg p-8 text-center text-bits-text-muted">
                <h3 className="text-xl font-semibold text-bits-text">Welcome to BITS Connect!</h3>
                <p className="mt-2">It looks a little quiet in here. Be the first to share something!</p>
            </div>
        )}
    </div>
  );
};