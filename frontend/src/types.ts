export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  followers?: number;
  following?: number;
}

export interface Post {
  id: number;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  createdAt: string;
  liked?: boolean;
}

export interface Comment {
  id: number;
  postId: number;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}
