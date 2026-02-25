import type { User, Post } from './types.ts';

const API_BASE = 'http://localhost:9090/api';

let currentUser: User | null = null;

export function getCurrentUser(): User | null {
  return currentUser;
}

export function setCurrentUser(user: User | null): void {
  currentUser = user;
}


export async function login(email: string, password: string): Promise<User> {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.ok && data.success && data.user) {
      currentUser = data.user;
      return data.user;
    } else {
      throw new Error(data.message || 'Falha ao fazer login');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
}


export async function register(username: string, email: string, password: string): Promise<User> {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, passwordHash: password })
    });

    const data = await response.json();
    
    if (response.ok && data.success && data.user) {
      return data.user;
    } else {
      throw new Error(data.message || 'Falha ao registrar');
    }
  } catch (error) {
    console.error('Erro ao registrar:', error);
    throw error;
  }
}


export async function getPosts(): Promise<Post[]> {
  try {
    const response = await fetch(`${API_BASE}/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const posts: Post[] = await response.json();
    return posts;
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    throw error;
  }
}


export async function createPost(content: string, image?: string): Promise<Post> {
  if (!currentUser) {
    throw new Error('Usuário não autenticado');
  }

  try {
    const response = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        image: image || null,
        authorId: currentUser.id,
        authorName: currentUser.name
      })
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.post) {
      return data.post;
    } else {
      throw new Error(data.message || 'Falha ao criar post');
    }
  } catch (error) {
    console.error('Erro ao criar post:', error);
    throw error;
  }
}


export async function likePost(postId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Falha ao curtir post');
    }
  } catch (error) {
    console.error('Erro ao curtir post:', error);
    throw error;
  }
}


export async function unlikePost(postId: number): Promise<void> {
  try {
    console.log('Unlike não implementado no backend ainda');
  } catch (error) {
    console.error('Erro ao remover curtida:', error);
    throw error;
  }
}


export async function deletePost(postId: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Falha ao deletar post');
    }
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    throw error;
  }
}


export async function getUserById(userId: number): Promise<User> {
  try {
    const response = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || 'Usuário não encontrado');
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
}
