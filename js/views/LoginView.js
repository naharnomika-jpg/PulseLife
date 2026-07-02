// Auth views: Clean Google Sign-In Only Interface
import { store } from '../store.js';
import { Toast } from '../components/Toast.js';

export const LoginView = {
  render() {
    return `
      <div class="auth-page">
        <div class="glass-card auth-card glow-card-blue" style="text-align: center; max-width: 400px; padding: 2.5rem; border-radius: var(--border-radius-lg);">
          
          <div class="auth-header" style="margin-bottom: 2rem;">
            <a href="#/landing" class="logo" style="justify-content: center; font-size: 2.5rem; margin-bottom: 0.5rem;">
              <i class="fa-solid fa-heart-pulse"></i> PulseLife
            </a>
            <p style="color: var(--text-muted); font-size: 0.95rem;">Empowered Lifestyle & Health Tracking</p>
          </div>

          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 2.2rem;">
            Welcome to PulseLife! Please sign in with your Google account to secure your profile biomarkers, streaks, and health logs.
          </p>

          <button type="button" id="google-signin-btn" class="btn btn-primary" style="width: 100%; display: flex; gap: 0.8rem; align-items: center; justify-content: center; padding: 0.8rem; font-size: 1rem; box-shadow: var(--shadow-glow);">
            <i class="fa-brands fa-google"></i> Sign in with Google
          </button>

        </div>
      </div>
    `;
  },

  init() {
    // Google Sign in (Integrated with Firebase Google Auth)
    const googleBtn = document.getElementById('google-signin-btn');
    if (googleBtn) {
      googleBtn.addEventListener('click', async () => {
        try {
          Toast.info('Connecting to Google Account authentication...');
          
          const { auth } = await import('../utils/firebase.js');
          const { GoogleAuthProvider, signInWithPopup } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
          
          const provider = new GoogleAuthProvider();
          await signInWithPopup(auth, provider);
          
          Toast.success('Authenticated via Google successfully!');
        } catch (err) {
          console.error(err);
          Toast.danger(`Google Sign-In failed: ${err.message}`);
        }
      });
    }
  }
};

export default LoginView;
