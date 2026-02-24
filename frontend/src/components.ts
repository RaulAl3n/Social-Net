import type { User, Post } from './types.ts';

export function createLoginForm(): HTMLElement {
  const form = document.createElement('div');
  form.className = 'login-container';
  form.innerHTML = `
    <div class="login-box">
      <div class="login-header">
        <h1>SocialNet</h1>
        <p>Connect with your friends</p>
      </div>
      <form id="loginForm">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required placeholder="your@email.com">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required placeholder="your password">
        </div>
        <button type="submit" class="btn btn-primary">Enter</button>
        <p class="login-footer">
          Don't have an account? <button type="button" id="toggleRegister" class="link-btn">Create account</button>
        </p>
      </form>
    </div>
  `;
  return form;
}

export function createRegisterForm(): HTMLElement {
  const form = document.createElement('div');
  form.className = 'login-container';
  form.innerHTML = `
    <div class="login-box">
      <div class="login-header">
        <h1>SocialNet</h1>
        <p>Crie sua conta</p>
      </div>
      <form id="registerForm">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" required placeholder="Your name">
        </div>
        <div class="form-group">
          <label for="regEmail">Email</label>
          <input type="email" id="regEmail" name="email" required placeholder="your@email.com">
        </div>
        <div class="form-group">
          <label for="regPassword">Password</label>
          <input type="password" id="regPassword" name="password" required placeholder="Create a password">
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm your password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Confirm your password">
        </div>
        <button type="submit" class="btn btn-primary">Create account</button>
        <p class="login-footer">
          Já tem conta? <button type="button" id="toggleLogin" class="link-btn">Log in</button>
        </p>
      </form>
    </div>
  `;
  return form;
}

export function createProfilePage(user: User): HTMLElement {
  const profilePage = document.createElement('div');
  profilePage.className = 'profile-page';
  profilePage.id = 'profilePage';
  profilePage.innerHTML = `
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-cover"></div>
        <div class="profile-info">
          <img src="${user.avatar}" alt="${user.name}" class="profile-avatar">
          <div class="profile-details">
            <h1>${user.name}</h1>
            <p class="profile-email">@${user.email}</p>
            <p class="profile-bio">${user.bio || 'Adicione uma bio ao seu perfil'}</p>
            <div class="profile-stats">
              <div class="stat">
                <strong>${user.followers || 0}</strong>
                <span>Seguidores</span>
              </div>
              <div class="stat">
                <strong>${user.following || 0}</strong>
                <span>Seguindo</span>
              </div>
            </div>
            <button id="editProfileBtn" class="btn btn-primary">Editar Perfil</button>
          </div>
        </div>
      </div>
      <div class="profile-content">
        <div class="profile-tabs">
          <button class="tab-button active" data-tab="posts">Posts</button>
          <button class="tab-button" data-tab="likes">Curtidas</button>
          <button class="tab-button" data-tab="follows">Seguidores</button>
        </div>
        <div class="tab-content">
          <div id="postsTab" class="tab-pane active"></div>
          <div id="likesTab" class="tab-pane"></div>
          <div id="followsTab" class="tab-pane"></div>
        </div>
      </div>
    </div>
  `;
  return profilePage;
}

export function createEditProfileForm(user: User): HTMLElement {
  const editForm = document.createElement('div');
  editForm.className = 'modal-overlay';
  editForm.id = 'editProfileModal';
  editForm.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Editar Perfil</h2>
        <button class="close-btn" id="closeEditModal">✕</button>
      </div>
      <form id="editProfileForm">
        <div class="form-group">
          <label for="editName">Nome</label>
          <input type="text" id="editName" value="${user.name}" required>
        </div>
        <div class="form-group">
          <label for="editBio">Bio</label>
          <textarea id="editBio" rows="3" placeholder="Fale um pouco sobre você">${user.bio || ''}</textarea>
        </div>
        <div class="form-group">
          <label for="editAvatar">URL do Avatar</label>
          <input type="url" id="editAvatar" value="${user.avatar}" placeholder="https://exemplo.com/avatar.jpg">
        </div>
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" id="cancelEditBtn">Cancelar</button>
          <button type="submit" class="btn btn-primary">Salvar Alterações</button>
        </div>
      </form>
    </div>
  `;
  return editForm;
}

export function createNav(user: User): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.innerHTML = `
    <div class="nav-container">
      <div class="nav-logo">
        <h2>SocialNet</h2>
      </div>
      <div class="nav-menu">
        <button class="nav-item active" data-page="feed">
          <span class="icon">🏠</span>
          <span>Página Inicial</span>
        </button>
        <button class="nav-item" data-page="explore">
          <span class="icon">🔍</span>
          <span>Explorar</span>
        </button>
        <button class="nav-item" data-page="notifications">
          <span class="icon">🔔</span>
          <span>Notificações</span>
        </button>
        <button class="nav-item" data-page="messages">
          <span class="icon">💬</span>
          <span>Mensagens</span>
        </button>
      </div>
      <div class="nav-user">
        <button class="nav-item" data-page="profile">
          <img src="${user.avatar}" alt="Perfil" class="avatar-small">
          <span>${user.name}</span>
        </button>
        <button id="logoutBtn" class="btn btn-secondary">Sair</button>
      </div>
    </div>
  `;
  return nav;
}

export function createPostCard(post: Post): HTMLElement {
  const card = document.createElement('div');
  card.className = 'post-card';
  const authorAvatar = post.authorAvatar || `https://i.pravatar.cc/150?img=${post.authorId || 1}`;
  
  card.innerHTML = `
    <div class="post-header">
      <div class="post-author">
        <img src="${authorAvatar}" alt="${post.authorName}" class="avatar">
        <div class="author-info">
          <h4>${post.authorName}</h4>
          <span class="post-time">${formatTime(post.createdAt)}</span>
        </div>
      </div>
      <button class="post-options">⋯</button>
    </div>
    <div class="post-content">
      <p>${post.content || 'Post sem conteúdo'}</p>
      ${post.image ? `<img src="${post.image}" alt="Post" class="post-image">` : ''}
    </div>
    <div class="post-stats">
      <span>${post.likes} curtidas</span>
      <span>${post.comments || 0} comentários</span>
    </div>
    <div class="post-actions">
      <button class="post-action ${post.liked ? 'liked' : ''}" data-action="like" data-post-id="${post.id}">
        <span class="icon">${post.liked ? '❤️' : '🤍'}</span>
        <span>Curtir</span>
      </button>
      <button class="post-action" data-action="comment" data-post-id="${post.id}">
        <span class="icon">💬</span>
        <span>Comentar</span>
      </button>
      <button class="post-action" data-action="share">
        <span class="icon">📤</span>
        <span>Compartilhar</span>
      </button>
    </div>
  `;
  return card;
}

export function createEmptyState(): HTMLElement {
  const empty = document.createElement('div');
  empty.className = 'empty-state';
  empty.innerHTML = `
    <div class="empty-state-content">
      <div class="empty-state-icon">📝</div>
      <h3>Nenhum post ainda</h3>
      <p>Seja o primeiro a publicar algo!</p>
    </div>
  `;
  return empty;
}

export function createPostComposer(user: User): HTMLElement {
  const composer = document.createElement('div');
  composer.className = 'post-composer';
  composer.innerHTML = `
    <div class="composer-header">
      <img src="${user.avatar}" alt="${user.name}" class="avatar">
      <div class="composer-input">
        <textarea id="postText" placeholder="No que você está pensando?" class="composer-textarea"></textarea>
      </div>
    </div>
    <div class="composer-actions">
      <div class="composer-icons">
        <button class="icon-btn" title="Adicionar foto">
          <span>🖼️</span>
        </button>
        <button class="icon-btn" title="Adicionar emoji">
          <span>😊</span>
        </button>
        <button class="icon-btn" title="Marcar localização">
          <span>📍</span>
        </button>
      </div>
      <button id="postBtn" class="btn btn-primary" disabled>Publicar</button>
    </div>
  `;
  return composer;
}

export function createFeed(): HTMLElement {
  const feed = document.createElement('div');
  feed.className = 'feed';
  feed.id = 'feed';
  return feed;
}

export function createSidebar(user: User): HTMLElement {
  const sidebar = document.createElement('div');
  sidebar.className = 'sidebar';
  sidebar.innerHTML = `
    <div class="sidebar-card">
      <div class="profile-preview">
        <img src="${user.avatar}" alt="${user.name}" class="avatar-large">
        <h3>${user.name}</h3>
        <p class="bio">${user.bio || 'Sem bio'}</p>
        <div class="stats">
          <div class="stat">
            <strong>${user.followers || 0}</strong>
            <span>Seguidores</span>
          </div>
          <div class="stat">
            <strong>${user.following || 0}</strong>
            <span>Seguindo</span>
          </div>
        </div>
        <button class="btn btn-primary w-100">Ver Perfil</button>
      </div>
    </div>
    <div class="sidebar-card">
      <h4>Tendências</h4>
      <div class="trends">
        <div class="trend-item">
          <span class="trend-number">1</span>
          <div class="trend-info">
            <strong>#tecnologia</strong>
            <p>1.2M posts</p>
          </div>
        </div>
        <div class="trend-item">
          <span class="trend-number">2</span>
          <div class="trend-info">
            <strong>#javascript</strong>
            <p>890K posts</p>
          </div>
        </div>
        <div class="trend-item">
          <span class="trend-number">3</span>
          <div class="trend-info">
            <strong>#frontend</strong>
            <p>650K posts</p>
          </div>
        </div>
      </div>
    </div>
  `;
  return sidebar;
}

export function createMainLayout(): HTMLElement {
  const main = document.createElement('main');
  main.className = 'main-content';
  main.innerHTML = `
    <div class="container">
      <div class="sidebar-left"></div>
      <div class="feed-container"></div>
      <div class="sidebar-right"></div>
    </div>
  `;
  return main;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return date.toLocaleDateString('pt-BR');
}
