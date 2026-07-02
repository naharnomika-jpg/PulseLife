// Hash-based client-side router for PulseLife SPA
import { store } from './store.js';

// Import views
import LandingView from './views/LandingView.js';
import LoginView from './views/LoginView.js';
import DashboardView from './views/DashboardView.js';
import LogsView from './views/LogsView.js';
import AnalyticsView from './views/AnalyticsView.js';
import ChatView from './views/ChatView.js';
import PlannerView from './views/PlannerView.js';
import GamificationView from './views/GamificationView.js';
import ReportsView from './views/ReportsView.js';
import AdminView from './views/AdminView.js';
import SettingsView from './views/SettingsView.js';

// Import components
import Navbar from './components/Navbar.js';
import Sidebar from './components/Sidebar.js';
import { Toast } from './components/Toast.js';

const routes = {
  '': { view: LandingView, auth: false },
  'landing': { view: LandingView, auth: false },
  'login': { view: LoginView, auth: false },
  'dashboard': { view: DashboardView, auth: true },
  'logs': { view: LogsView, auth: true },
  'analytics': { view: AnalyticsView, auth: true },
  'chat': { view: ChatView, auth: true },
  'planners': { view: PlannerView, auth: true },
  'gamification': { view: GamificationView, auth: true },
  'reports': { view: ReportsView, auth: true },
  'settings': { view: SettingsView, auth: true },
  'admin': { view: AdminView, auth: true, adminOnly: true }
};

class Router {
  constructor() {
    this.appElement = document.getElementById('app');
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  getCurrentRoute() {
    let hash = window.location.hash.slice(1) || '';
    if (hash.startsWith('/')) {
      hash = hash.slice(1);
    }
    const parts = hash.split('/');
    return {
      path: parts[0],
      params: parts.slice(1)
    };
  }

  navigateTo(hash) {
    window.location.hash = hash;
  }

  handleRoute() {
    let { path, params } = this.getCurrentRoute();
    
    const userEmail = store.state.currentUser;
    const userObj = userEmail ? store.state.users[userEmail] : null;

    // Handle empty route mapping
    if (path === '') {
      path = userEmail ? 'dashboard' : 'landing';
    }

    const route = routes[path] || { view: DashboardView, auth: true };

    // 1. Auth Route Guards
    if (route.auth && !userEmail) {
      this.navigateTo('login');
      return;
    }

    // 2. Prevent logged in users from visiting login or landing pages
    if ((path === 'login' || path === 'landing') && userEmail) {
      this.navigateTo('dashboard');
      return;
    }

    // 3. Admin Route Guards
    if (route.adminOnly && (!userObj || userObj.role !== 'admin')) {
      Toast.danger('Access Denied: Admin privileges required.');
      this.navigateTo('dashboard');
      return;
    }

    // 4. Render layouts
    this.render(route.view, path, params, userObj);
  }

  render(ViewComponent, path, params, userObj) {
    const viewHTML = ViewComponent.render(params);

    // If user is authenticated and not on landing/login page, wrap in App Dashboard shell (Navbar + Sidebar + Main)
    if (store.state.currentUser && path !== 'login' && path !== 'landing' && path !== '') {
      this.appElement.innerHTML = `
        ${Navbar.render(userObj)}
        <div class="app-container">
          ${Sidebar.render(path, userObj.role === 'admin')}
          <main class="main-content">
            ${viewHTML}
          </main>
        </div>
        <div id="toast-container" class="toast-container"></div>
      `;
    } else {
      // Full-screen layouts (Auth, Landing)
      this.appElement.innerHTML = `
        ${viewHTML}
        <div id="toast-container" class="toast-container"></div>
      `;
    }

    // Execute view initialization events (bind buttons, canvas loaders, speech APIs)
    if (ViewComponent.init) {
      try {
        ViewComponent.init(params);
      } catch (err) {
        console.error('Error initializing view:', err);
      }
    }

    // Rebind general global layout events (like Theme selectors or Profile overlays)
    this.bindLayoutEvents();
  }

  bindLayoutEvents() {
    // Theme Toggle Handler in Navbar
    const themeBtn = document.getElementById('navbar-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.classList.remove('dark-mode', 'light-mode');
        document.body.classList.add(`${nextTheme}-mode`);
        
        store.setTheme(nextTheme);
        themeBtn.innerHTML = nextTheme === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
        Toast.success(`Switched to ${nextTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
      });
    }

    // Initialize HTML body theme classes matching store state
    const savedTheme = store.state.settings.theme;
    if (savedTheme && !document.body.classList.contains(`${savedTheme}-mode`)) {
      document.body.classList.remove('dark-mode', 'light-mode');
      document.body.classList.add(`${savedTheme}-mode`);
    }

    // Sync navbar theme button icon
    if (themeBtn) {
      const activeTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      themeBtn.innerHTML = activeTheme === 'dark' ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
    }
  }
}

export const router = new Router();
export default router;
