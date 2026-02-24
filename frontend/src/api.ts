import type { User, Post } from './types.ts';

const API_BASE = 'http://localhost:9090/api';

// Variável para armazenar o usuário atual
let currentUser: User | null = null;

export function getCurrentUser(): User | null {
  return currentUser;
}

export function setCurrentUser(user: User | null): void {
  currentUser = user;
}

/**
 * Fazer login - POST /api/auth/login
 */
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

/**
 * Registrar novo usuário - POST /api/auth/register
 */
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

/**
 * Buscar todos os posts - GET /api/posts
 */
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

/**
 * Criar novo post - POST /api/posts
 */
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

/**
 * Curtir um post - POST /api/posts/{id}/like
 */
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

/**
 * Remover curtida de um post - DELETE /api/posts/{id}/unlike (ou POST com descurtir)
 * OBS: Se o seu backend não tem esse endpoint, você pode criar um ou usar likePost com toggle
 */
export async function unlikePost(postId: number): Promise<void> {
  try {
    // Se você implementar um endpoint de unlike no backend, use:
    // const response = await fetch(`${API_BASE}/posts/${postId}/unlike`, { method: 'POST' });
    
    // Por enquanto, recarregue os posts
    console.log('Unlike não implementado no backend ainda');
  } catch (error) {
    console.error('Erro ao remover curtida:', error);
    throw error;
  }
}

/**
 * Deletar um post - DELETE /api/posts/{id}
 */
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

/**
 * Buscar usuário por ID - GET /api/users/{id}
 */
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
