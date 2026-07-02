// Main Application Entry Point
import { store } from './store.js';
import { router } from './router.js';
import { Toast } from './components/Toast.js';
import { app, analytics } from './utils/firebase.js';

// Expose router globally to avoid circular dependencies in ES Modules
window.router = router;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize user theme matching state settings
  const savedTheme = store.state.settings.theme || 'dark';
  document.body.classList.remove('dark-mode', 'light-mode');
  document.body.classList.add(`${savedTheme}-mode`);

  // 2. Set up notification interval tasks (water and meditation reminders)
  setupReminders();

  // 3. Boot client-side router
  // The router automatically resolves page loads and hash changes
  console.log('PulseLife application successfully initialized.');
});

// Periodically triggers reminder banners for drinking water, sleeping, etc.
function setupReminders() {
  // Trigger water reminder every 4 minutes (for demonstration, instead of hours)
  setInterval(() => {
    if (store.state.currentUser) {
      const lang = store.state.settings.lang || 'en';
      const messages = {
        en: "💧 Hydration Reminder: Time to drink a glass of water to keep your metabolism active!",
        es: "💧 Recordatorio de Hidratación: ¡Es hora de tomar un vaso de agua para activar tu metabolismo!",
        fr: "💧 Rappel d'hydratation : C'est le moment de boire un verre d'eau pour rester en forme !"
      };
      Toast.info(messages[lang]);
    }
  }, 240000); // 4 minutes

  // Trigger exercise/movement reminder every 9 minutes
  setInterval(() => {
    if (store.state.currentUser) {
      const lang = store.state.settings.lang || 'en';
      const messages = {
        en: "🏃 Activity Alert: You've been sitting for a while. Stand up and do a quick 2-minute stretch!",
        es: "🏃 Alerta de Actividad: Has estado sentado un rato. ¡Levántate y estira por 2 minutos!",
        fr: "🏃 Rappel d'activité : Vous êtes assis depuis un moment. Levez-vous pour vous étirer !"
      };
      Toast.success(messages[lang]);
    }
  }, 540000); // 9 minutes
}
