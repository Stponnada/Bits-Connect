
export enum Campus {
  PILANI = 'Pilani',
  GOA = 'Goa',
  HYDERABAD = 'Hyderabad',
}

export enum RelationshipStatus {
  SINGLE = 'Single',
  IN_A_RELATIONSHIP = 'In a relationship',
  COMPLICATED = "It's complicated",
  PREFER_NOT_TO_SAY = 'Prefer not to say',
}

export interface UserProfile {
  name: string;
  campus?: Campus;
  branch?: string;
  dormBuilding?: string;
  dormRoom?: string;
  admissionYear: number;
  diningHall?: string;
  clubs?: string[];
  relationshipStatus?: RelationshipStatus;
  bio?: string;
  avatar: string;
  banner?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  profile: UserProfile;
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  timestamp: string;
}

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export interface PostMedia {
  url: string;
  type: MediaType;
}

export interface Post {
  id: string;
  authorId: string;
  content?: string;
  media?: PostMedia[];
  timestamp: string;
  likes: string[]; // Array of user IDs
  dislikes: string[]; // Array of user IDs
  comments: Comment[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  userId: string;
  messages: ChatMessage[];
}

export type Page = 'home' | 'chat' | 'profile' | 'search' | 'userProfile';