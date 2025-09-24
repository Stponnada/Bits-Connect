// src/supa/supabaseHelpers.ts
import { supabase } from '../supabaseClient';
import { PostMedia } from '../types';

// ---------- STORAGE ----------
export const uploadFile = (file: File, bucket: 'avatars' | 'post-images') =>
    supabase.storage.from(bucket).upload(`uploads/${Date.now()}-${file.name}`, file);

export const getFileUrl = (path: string, bucket: 'avatars' | 'post-images') =>
    supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;

// ---------- DATABASE ----------
export const fetchPosts = () =>
    supabase.from('posts').select('*').order('timestamp', { ascending: false });

// `media` is an array of PostMedia objects
export const addPost = async (authorId: string, content: string, media: PostMedia[]) => {
    return supabase.from('posts').insert([{ author_id: authorId, content, media }]);
};

// ---------- AUTHENTICATION ----------
export const loginUser = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

export const signupUser = (email: string, password: string) =>
    supabase.auth.signUp({ email, password });

export const logoutUser = () =>
    supabase.auth.signOut();

