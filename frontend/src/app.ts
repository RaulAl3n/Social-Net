import type { User, Post } from './types.ts';
import * as API from './api.ts';
import * as Components from './components.ts';

export class SocialApp {
  private currentUser: User | null = null;
  private posts: Post[] = [];

  async init(): Promise<void> {
    const app = document.querySelector<HTMLDivElement>('#app');
    if (!app) return;

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
      API.setCurrentUser(this.currentUser);
      await this.showMainApp(app);
    } else {
      this.showLogin(app);
    }
  }

  private showLogin(app: HTMLDivElement): void {
    app.innerHTML = '';
    const loginForm = Components.createLoginForm();
    app.appendChild(loginForm);

    const form = document.getElementById('loginForm') as HTMLFormElement;
    const toggleRegisterBtn = document.getElementById('toggleRegister') as HTMLButtonElement;

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = (document.getElementById('email') as HTMLInputElement).value;
      const password = (document.getElementById('password') as HTMLInputElement).value;

      try {
        this.currentUser = await API.login(email, password);
        API.setCurrentUser(this.currentUser);
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.showMainApp(app);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
        alert('Erro ao fazer login: ' + errorMsg);
        console.error('Erro ao fazer login:', error);
      }
    });

    toggleRegisterBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showRegister(app);
    });
  }

  private showToast(message: string, type: 'success' | 'error' = 'success') {
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = message;

      document.body.appendChild(toast);

      setTimeout(() => {
        toast.remove();
      }, 2500);
    }

  private showRegister(app: HTMLDivElement): void {
    app.innerHTML = '';
    const registerForm = Components.createRegisterForm();
    app.appendChild(registerForm);

    const form = document.getElementById('registerForm') as HTMLFormElement;
    const toggleLoginBtn = document.getElementById('toggleLogin') as HTMLButtonElement;

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = (document.getElementById('username') as HTMLInputElement).value;
      const email = (document.getElementById('regEmail') as HTMLInputElement).value;
      const password = (document.getElementById('regPassword') as HTMLInputElement).value;
      const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

      if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
      }

      try {
        await API.register(username, email, password);
        this.showToast('🎉 Welcome to SocialNet! Your account was created succesfully 🚀');
        this.showLogin(app);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
        alert('Erro ao criar conta: ' + errorMsg);
        console.error('Erro ao criar conta:', error);
      }
    });

    toggleLoginBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showLogin(app);
    });
  }

  private async showMainApp(app: HTMLDivElement): Promise<void> {
    if (!this.currentUser) return;

    app.innerHTML = '';
    app.className = 'app-container';

    const nav = Components.createNav(this.currentUser);
    const main = Components.createMainLayout();
    const sidebar = Components.createSidebar(this.currentUser);

    app.appendChild(nav);
    app.appendChild(main);

    const sidebarRight = main.querySelector('.sidebar-right') as HTMLElement;
    sidebarRight.appendChild(sidebar);

    const feedContainer = main.querySelector('.feed-container') as HTMLElement;
    const composer = Components.createPostComposer(this.currentUser);
    const feed = Components.createFeed();
    feedContainer.appendChild(composer);
    feedContainer.appendChild(feed);

    await this.loadPosts();
    this.setupEventListeners(app);
  }

  private async loadPosts(): Promise<void> {
    try {
      this.posts = await API.getPosts();
      this.renderPosts();
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    }
  }

  private renderPosts(): void {
    const feed = document.querySelector('#feed') as HTMLElement;
    if (!feed) return;

    feed.innerHTML = '';
    
    if (this.posts.length === 0) {
      const emptyState = Components.createEmptyState();
      feed.appendChild(emptyState);
      return;
    }

    this.posts.forEach(post => {
      const mappedPost: Post = {
        id: (post as any).postId || (post as any).id || 0,
        authorId: (post as any).authorId || 1,
        authorName: (post as any).postOwner || (post as any).authorName || 'Anônimo',
        authorAvatar: (post as any).authorAvatar || `https://i.pravatar.cc/150?img=${(post as any).authorId || 1}`,
        content: (post as any).description || (post as any).content || '',
        image: (post as any).image || undefined,
        likes: (post as any).likes || 0,
        comments: (post as any).comments || 0,
        createdAt: (post as any).createdAt || new Date().toISOString(),
        liked: (post as any).liked || false
      };

      const postCard = Components.createPostCard(mappedPost);
      feed.appendChild(postCard);
    });
  }

  private setupEventListeners(app: HTMLDivElement): void {
    const postBtn = document.getElementById('postBtn') as HTMLButtonElement;
    const postText = document.getElementById('postText') as HTMLTextAreaElement;

    postText?.addEventListener('input', () => {
      postBtn!.disabled = postText.value.trim() === '';
    });

    postBtn?.addEventListener('click', async () => {
      const content = postText.value.trim();
      if (content) {
        try {
          await API.createPost(content);
          postText.value = '';
          (postBtn as HTMLButtonElement).disabled = true;
          await this.loadPosts();
        } catch (error) {
          alert('Erro ao publicar post');
        }
      }
    });

    app.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-action="like"]')) {
        const btn = target.closest('[data-action="like"]') as HTMLElement;
        const postId = parseInt(btn.getAttribute('data-post-id') || '0');
        const post = this.posts.find(p => p.id === postId);

        if (post) {
          try {
            if (post.liked) {
              await API.unlikePost(postId);
            } else {
              await API.likePost(postId);
            }
            await this.loadPosts();
          } catch (error) {
            console.error('Erro ao alternar curtida:', error);
          }
        }
      }
    });

    app.addEventListener('click', (e) => {
      const navItem = (e.target as HTMLElement).closest('.nav-item');
      if (navItem) {
        const page = navItem.getAttribute('data-page');
        if (page) {
          document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
          navItem.classList.add('active');
          this.navigateToPage(page, app);
        }
      }
    });

    const viewProfileBtn = document.querySelector('.sidebar-card .btn.btn-primary');
    viewProfileBtn?.addEventListener('click', () => {
      const profileNavItem = document.querySelector('[data-page="profile"]') as HTMLElement;
      if (profileNavItem) {
        profileNavItem.click();
      }
    });

    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn?.addEventListener('click', () => {
      API.setCurrentUser(null);
      localStorage.removeItem('currentUser');
      this.currentUser = null;
      this.init();
    });
  }

  private navigateToPage(page: string, app: HTMLDivElement): void {
    const feedContainer = app.querySelector('.feed-container') as HTMLElement;
    if (!feedContainer) return;

    switch (page) {
      case 'profile':
        this.showProfilePage(app);
        break;
      case 'feed':
        this.showFeedPage(app);
        break;
      case 'explore':
        feedContainer.innerHTML = '<p style="padding: 20px;">Explorar em breve...</p>';
        break;
      case 'notifications':
        feedContainer.innerHTML = '<p style="padding: 20px;">Notificações em breve...</p>';
        break;
      case 'messages':
        feedContainer.innerHTML = '<p style="padding: 20px;">Mensagens em breve...</p>';
        break;
    }
  }

  private showFeedPage(app: HTMLDivElement): void {
    const feedContainer = app.querySelector('.feed-container') as HTMLElement;
    if (!feedContainer) return;

    feedContainer.innerHTML = '';
    const composer = Components.createPostComposer(this.currentUser!);
    const feed = Components.createFeed();
    feedContainer.appendChild(composer);
    feedContainer.appendChild(feed);

    this.renderPosts();
    this.setupPostListeners();
  }

  private showProfilePage(app: HTMLDivElement): void {
    if (!this.currentUser) return;

    const feedContainer = app.querySelector('.feed-container') as HTMLElement;
    if (!feedContainer) return;

    feedContainer.innerHTML = '';
    const profilePage = Components.createProfilePage(this.currentUser);
    feedContainer.appendChild(profilePage);

    const editProfileBtn = document.getElementById('editProfileBtn');
    editProfileBtn?.addEventListener('click', () => {
      this.showEditProfileModal(app);
    });

    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = (btn as HTMLElement).getAttribute('data-tab');
        if (tabName) {
          document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
          document.getElementById(`${tabName}Tab`)?.classList.add('active');
        }
      });
    });
  }

  private showEditProfileModal(app: HTMLDivElement): void {
    if (!this.currentUser) return;

    const modal = Components.createEditProfileForm(this.currentUser);
    app.appendChild(modal);

    const closeBtn = document.getElementById('closeEditModal');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const form = document.getElementById('editProfileForm') as HTMLFormElement;

    const closeModal = () => {
      modal.remove();
    };

    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = (document.getElementById('editName') as HTMLInputElement).value;
      const bio = (document.getElementById('editBio') as HTMLTextAreaElement).value;
      const avatar = (document.getElementById('editAvatar') as HTMLInputElement).value;

      this.currentUser!.name = name;
      this.currentUser!.bio = bio;
      this.currentUser!.avatar = avatar;

      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      API.setCurrentUser(this.currentUser);

      alert('Perfil atualizado com sucesso!');
      closeModal();
      this.showProfilePage(app);
    });
  }

  private setupPostListeners(): void {
    const postBtn = document.getElementById('postBtn') as HTMLButtonElement;
    const postText = document.getElementById('postText') as HTMLTextAreaElement;

    postText?.addEventListener('input', () => {
      postBtn!.disabled = postText.value.trim() === '';
    });

    postBtn?.addEventListener('click', async () => {
      const content = postText.value.trim();
      if (content) {
        try {
          await API.createPost(content);
          postText.value = '';
          (postBtn as HTMLButtonElement).disabled = true;
          await this.loadPosts();
          this.renderPosts();
        } catch (error) {
          alert('Erro ao publicar post');
        }
      }
    });
  }
}

export default SocialApp;
