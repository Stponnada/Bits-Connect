import React, { useState } from 'react';
import { Post as PostType, Comment as CommentType } from '../../types';
import { useApp } from '../../context/AppContext';
import { ThumbsUpIcon, ThumbsDownIcon, CommentIcon } from '../icons';
import { formatDistanceToNow } from 'date-fns';

const MediaGrid: React.FC<{ media: PostType['media'] }> = ({ media }) => {
  if (!media || media.length === 0) return null;

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-2 grid-rows-2',
    4: 'grid-cols-2 grid-rows-2',
  };
  
  const getItemClass = (index: number, total: number) => {
    if (total === 3 && index === 0) {
      return 'row-span-2';
    }
    return '';
  }

  return (
    <div className={`mt-3 grid gap-1.5 rounded-xl overflow-hidden ${gridClasses[media.length as keyof typeof gridClasses] || 'grid-cols-2'}`}>
      {media.slice(0, 4).map((item, index) => (
         <div key={item.url} className={`relative bg-bits-medium-dark ${getItemClass(index, media.length)}`}>
            {item.type === 'image' ? (
                <img src={item.url} alt={`Post media ${index + 1}`} className="w-full h-full object-cover" />
            ) : (
                <video src={item.url} controls className="w-full h-full object-cover" />
            )}
            {media.length > 4 && index === 3 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-3xl font-bold">+{media.length - 4}</span>
                </div>
            )}
         </div>
      ))}
    </div>
  );
};

// FIX: Define PostProps interface for the Post component.
interface PostProps {
  post: PostType;
  isFeatured?: boolean;
}

export const Post: React.FC<PostProps> = ({ post, isFeatured = false }) => {
  const { currentUser, findUserById, setPosts, setCurrentPage, setViewedProfileId } = useApp();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const author = findUserById(post.authorId);

  if (!author) return null;

  const handleLike = () => {
    if (!currentUser) return;
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === post.id) {
        const newLikes = p.likes.includes(currentUser.id)
          ? p.likes.filter(id => id !== currentUser.id)
          : [...p.likes, currentUser.id];
        const newDislikes = p.dislikes.filter(id => id !== currentUser.id);
        return { ...p, likes: newLikes, dislikes: newDislikes };
      }
      return p;
    }));
  };

  const handleDislike = () => {
    if (!currentUser) return;
    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === post.id) {
        const newDislikes = p.dislikes.includes(currentUser.id)
          ? p.dislikes.filter(id => id !== currentUser.id)
          : [...p.dislikes, currentUser.id];
        const newLikes = p.likes.filter(id => id !== currentUser.id);
        return { ...p, dislikes: newDislikes, likes: newLikes };
      }
      return p;
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !commentText.trim()) return;
    const newComment: CommentType = {
      id: `comment-${Date.now()}`,
      authorId: currentUser.id,
      text: commentText.trim(),
      timestamp: new Date().toISOString(),
    };
    setPosts(prevPosts => prevPosts.map(p =>
      p.id === post.id ? { ...p, comments: [...p.comments, newComment] } : p
    ));
    setCommentText('');
  };

  const handleAuthorClick = () => {
      if (author.id === currentUser?.id) {
          setCurrentPage('profile');
      } else {
          setViewedProfileId(author.id);
          setCurrentPage('userProfile');
      }
  };

  const isLiked = currentUser && post.likes.includes(currentUser.id);
  const isDisliked = currentUser && post.dislikes.includes(currentUser.id);

  return (
    <div className={`bg-bits-light-dark rounded-lg shadow p-5 mb-4 transition-all duration-300 ${isFeatured ? 'ring-2 ring-bits-red' : ''}`}>
      <div className="flex items-start">
        <img src={author.profile.avatar} alt={author.profile.name} className="w-12 h-12 rounded-full mr-4 cursor-pointer" onClick={handleAuthorClick} />
        <div className="w-full">
          <div className="flex items-baseline flex-wrap">
            <p className="font-bold text-bits-text cursor-pointer hover:underline" onClick={handleAuthorClick}>{author.profile.name}</p>
            <p className="text-sm text-bits-text-muted ml-2 cursor-pointer hover:underline" onClick={handleAuthorClick}>@{author.username}</p>
            <span className="text-xs text-bits-text-muted mx-2">·</span>
            <p className="text-xs text-bits-text-muted">{formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}</p>
          </div>
          {post.content && <p className="text-bits-text mt-2 whitespace-pre-wrap">{post.content}</p>}
          <MediaGrid media={post.media} />
          <div className="flex items-center text-bits-text-muted mt-4 space-x-6">
            <button onClick={handleLike} className={`flex items-center space-x-1 hover:text-green-500 ${isLiked ? 'text-green-500' : ''}`}>
              <ThumbsUpIcon />
              <span>{post.likes.length}</span>
            </button>
            <button onClick={handleDislike} className={`flex items-center space-x-1 hover:text-red-500 ${isDisliked ? 'text-red-500' : ''}`}>
              <ThumbsDownIcon />
              <span>{post.dislikes.length}</span>
            </button>
            <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-1 hover:text-blue-500">
              <CommentIcon />
              <span>{post.comments.length}</span>
            </button>
          </div>
          {showComments && (
            <div className="mt-4">
              {currentUser && (
                <form onSubmit={handleAddComment} className="flex items-center space-x-2 mb-4">
                  <img src={currentUser.profile.avatar} alt="Your avatar" className="w-8 h-8 rounded-full" />
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full bg-bits-medium-dark rounded-full py-2 px-4 text-bits-text placeholder-bits-text-muted focus:outline-none focus:ring-2 focus:ring-bits-red"
                  />
                  <button type="submit" disabled={!commentText.trim()} className="text-bits-red font-semibold disabled:opacity-50 hover:text-red-400">Post</button>
                </form>
              )}
              <div className="space-y-3">
                {post.comments.slice().sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map(comment => {
                  const commentAuthor = findUserById(comment.authorId);
                  return (
                    <div key={comment.id} className="flex items-start">
                       <img src={commentAuthor?.profile.avatar} alt={commentAuthor?.profile.name} className="w-8 h-8 rounded-full mr-3" />
                       <div className="bg-bits-medium-dark rounded-lg p-2 flex-1">
                         <div className="flex items-baseline">
                            <p className="font-semibold text-sm text-bits-text">{commentAuthor?.profile.name}</p>
                            <p className="text-xs text-bits-text-muted ml-2">{formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}</p>
                         </div>
                         <p className="text-sm text-bits-text mt-1">{comment.text}</p>
                       </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};