// State Management & LocalStorage Persistence for PulseLife

const STATE_KEY = 'pulselife_app_state';

// Initial state template
const defaultState = {
  users: {
    'admin@pulselife.com': {
      email: 'admin@pulselife.com',
      password: 'admin123',
      name: 'Dr. Jane Admin',
      role: 'admin',
      details: { age: 34, gender: 'Female', height: 168, weight: 60, occupation: 'Health Researcher' }
    },
    'user@pulselife.com': {
      email: 'user@pulselife.com',
      password: 'user123',
      name: 'Alex Johnson',
      role: 'user',
      details: { age: 28, gender: 'Male', height: 180, weight: 75, occupation: 'Software Engineer' }
    }
  },
  currentUser: null, // Stores email of logged-in user
  jwtToken: null, // Simulated JWT Token
  logs: {
    // Structure: { [userEmail]: { [dateStr]: logDetails } }
    'user@pulselife.com': {
      '2026-06-28': {
        sleep: { sleepTime: '23:00', wakeTime: '07:00', quality: 8 },
        water: { amount: 6, goal: 8 },
        diet: { breakfast: 'Oatmeal', lunch: 'Salad', dinner: 'Salmon', snacks: 'Fruit', junk: 1, protein: 70, sugar: 25, fruits: 2, vegetables: 3 },
        exercise: { duration: 45, type: 'Running', steps: 8500, calories: 400 },
        mental: { mood: 'Good', stress: 4, anxiety: 2, meditation: 10, gratitude: 'Grateful for coding tools!' },
        screen: { mobile: 2, social: 1, gaming: 0, work: 6 },
        productivity: { hours: 8, tasks: 5, focus: 8, breaks: 45 },
        habits: { smoking: false, alcohol: false, caffeine: 2, reading: true, learning: true, outdoor: true }
      },
      '2026-06-29': {
        sleep: { sleepTime: '22:30', wakeTime: '06:30', quality: 9 },
        water: { amount: 8, goal: 8 },
        diet: { breakfast: 'Eggs & Avocado', lunch: 'Quinoa Bowl', dinner: 'Chicken Rice', snacks: 'Nuts', junk: 0, protein: 85, sugar: 15, fruits: 3, vegetables: 4 },
        exercise: { duration: 60, type: 'Weightlifting', steps: 10000, calories: 550 },
        mental: { mood: 'Excellent', stress: 2, anxiety: 1, meditation: 15, gratitude: 'Met up with active friends.' },
        screen: { mobile: 1.5, social: 0.5, gaming: 0, work: 7 },
        productivity: { hours: 9, tasks: 8, focus: 9, breaks: 60 },
        habits: { smoking: false, alcohol: false, caffeine: 1, reading: true, learning: true, outdoor: true }
      }
    }
  },
  gamification: {
    // Structure: { [userEmail]: { points: 0, streak: 0, lastActiveDate: '', badges: [], level: 1 } }
    'user@pulselife.com': {
      points: 240,
      streak: 2,
      lastActiveDate: '2026-06-29',
      badges: ['hydro_king', 'early_bird', 'streak_beginner'],
      level: 2
    }
  },
  feedback: [
    { email: 'user@pulselife.com', date: '2026-06-29', message: 'I love the AI insights! Helps me schedule exercises.' }
  ],
  settings: {
    theme: 'dark',
    lang: 'en',
    groqKey: ''
  }
};

class Store {
  constructor() {
    this.state = this.loadState();
    this.listeners = [];
    this.initFirebaseAuthListener();
  }

  loadState() {
    const saved = localStorage.getItem(STATE_KEY);
    let stateObj = defaultState;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        stateObj = {
          ...defaultState,
          ...parsed,
          users: { ...defaultState.users, ...parsed.users },
          logs: { ...defaultState.logs, ...parsed.logs },
          gamification: { ...defaultState.gamification, ...parsed.gamification },
          settings: { ...defaultState.settings, ...parsed.settings }
        };
      } catch (e) {
        console.error('Failed to parse localStorage state. Resetting.', e);
      }
    }
    return stateObj;
  }

  saveState() {
    localStorage.setItem(STATE_KEY, JSON.stringify(this.state));
    this.notify();
    const email = this.state.currentUser;
    if (email) {
      this.syncToFirestore(email);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Authentication Actions (Integrated with Firebase Auth)
  async register(name, email, password, details = {}) {
    const { auth } = await import('./utils/firebase.js');
    const { createUserWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    this.state.users[email] = {
      email,
      name,
      role: 'user',
      details: {
        age: Number(details.age) || 25,
        gender: details.gender || 'Other',
        height: Number(details.height) || 170,
        weight: Number(details.weight) || 70,
        occupation: details.occupation || 'Freelancer'
      }
    };
    
    // Set default gamification structure
    this.state.gamification[email] = {
      points: 0,
      streak: 0,
      lastActiveDate: '',
      badges: [],
      level: 1
    };

    // Set empty log structure
    this.state.logs[email] = {};

    this.saveState();
    
    // Sync profile to Firestore database
    await this.syncToFirestore(email);
    return user;
  }

  async login(email, password) {
    const { auth } = await import('./utils/firebase.js');
    const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  }

  async logout() {
    try {
      const { auth } = await import('./utils/firebase.js');
      const { signOut } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
      await signOut(auth);
    } catch (e) {
      console.error("Firebase logout failed:", e);
    }
  }

  forgotPassword(email) {
    if (!this.state.users[email]) {
      throw new Error('No account found with this email.');
    }
    // Mock successful reset trigger
    return `A reset link was generated successfully! Mock Token: RST-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  // Logs & Habits Management
  saveDailyLog(dateStr, logData) {
    const email = this.state.currentUser;
    if (!email) throw new Error('Authentication required.');

    if (!this.state.logs[email]) {
      this.state.logs[email] = {};
    }

    // Merge existing log if present
    const existing = this.state.logs[email][dateStr] || {};
    this.state.logs[email][dateStr] = {
      ...existing,
      ...logData
    };

    // Calculate score updates & trigger rewards
    this.calculateRewardsForLog(email, dateStr, this.state.logs[email][dateStr]);

    this.saveState();
    
    // Sync with Firestore cloud database
    this.syncToFirestore(email);
  }

  getLogs() {
    const email = this.state.currentUser;
    if (!email) return {};
    return this.state.logs[email] || {};
  }

  getLogForDate(dateStr) {
    const email = this.state.currentUser;
    if (!email) return null;
    return (this.state.logs[email] && this.state.logs[email][dateStr]) || this.getEmptyLogTemplate();
  }

  getEmptyLogTemplate() {
    return {
      sleep: { sleepTime: '', wakeTime: '', quality: 0 },
      water: { amount: 0, goal: 8 },
      diet: { breakfast: '', lunch: '', dinner: '', snacks: '', junk: 0, protein: 0, sugar: 0, fruits: 0, vegetables: 0 },
      exercise: { duration: 0, type: '', steps: 0, calories: 0 },
      mental: { mood: 'Neutral', stress: 0, anxiety: 0, meditation: 0, gratitude: '' },
      screen: { mobile: 0, social: 0, gaming: 0, work: 0 },
      productivity: { hours: 0, tasks: 0, focus: 0, breaks: 0 },
      habits: { smoking: false, alcohol: false, caffeine: 0, reading: false, learning: false, outdoor: false }
    };
  }

  // Gamification & Streak Logics
  checkAndUpdateStreaks(email) {
    const gamification = this.state.gamification[email];
    if (!gamification) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const lastDate = gamification.lastActiveDate;

    if (lastDate === todayStr) {
      // Already logged in today, do nothing
      return;
    }

    if (lastDate === yesterdayStr) {
      // Streak continues
      gamification.streak += 1;
      gamification.points += 20; // 20 points for daily login streak boost
      this.checkStreakBadges(email, gamification.streak);
    } else if (lastDate !== '') {
      // Streak broken
      gamification.streak = 1;
    } else {
      // First log
      gamification.streak = 1;
    }

    gamification.lastActiveDate = todayStr;
    gamification.level = Math.floor(gamification.points / 100) + 1;
  }

  checkStreakBadges(email, streak) {
    const badges = this.state.gamification[email].badges;
    if (streak >= 3 && !badges.includes('streak_beginner')) {
      badges.push('streak_beginner');
      this.state.gamification[email].points += 50;
    }
    if (streak >= 7 && !badges.includes('streak_master')) {
      badges.push('streak_master');
      this.state.gamification[email].points += 100;
    }
  }

  calculateRewardsForLog(email, dateStr, log) {
    const gamification = this.state.gamification[email];
    if (!gamification) return;

    let pointsAwarded = 0;
    const badges = gamification.badges;

    // Water goal reached
    if (log.water && log.water.amount >= log.water.goal && log.water.goal > 0) {
      pointsAwarded += 10;
      if (!badges.includes('hydro_king')) {
        badges.push('hydro_king');
        pointsAwarded += 50;
      }
    }

    // Wakeup early check
    if (log.sleep && log.sleep.wakeTime) {
      const hours = parseInt(log.sleep.wakeTime.split(':')[0]);
      if (hours < 7) {
        pointsAwarded += 10;
        if (!badges.includes('early_bird')) {
          badges.push('early_bird');
          pointsAwarded += 50;
        }
      }
    }

    // High productivity check
    if (log.productivity && log.productivity.focus >= 8) {
      pointsAwarded += 15;
      if (log.productivity.focus >= 9 && !badges.includes('focus_master')) {
        badges.push('focus_master');
        pointsAwarded += 75;
      }
    }

    // Mindful monk check
    if (log.mental && log.mental.meditation >= 15) {
      pointsAwarded += 15;
      if (!badges.includes('mindful_monk')) {
        badges.push('mindful_monk');
        pointsAwarded += 50;
      }
    }

    // Healthy Diet check
    if (log.diet && log.diet.junk === 0 && (log.diet.fruits > 0 || log.diet.vegetables > 0)) {
      pointsAwarded += 15;
      if (!badges.includes('healthy_eater')) {
        badges.push('healthy_eater');
        pointsAwarded += 50;
      }
    }

    // Workout warrior check
    if (log.exercise && log.exercise.calories >= 400) {
      pointsAwarded += 20;
      if (!badges.includes('workout_warrior')) {
        badges.push('workout_warrior');
        pointsAwarded += 50;
      }
    }

    // Update state points & level calculation
    gamification.points += pointsAwarded;
    gamification.level = Math.floor(gamification.points / 100) + 1;
  }

  // Admin Section Operations
  addFeedback(message) {
    const email = this.state.currentUser || 'anonymous@pulselife.com';
    const date = new Date().toISOString().split('T')[0];
    this.state.feedback.push({ email, date, message });
    this.saveState();
  }

  // Theme & Settings Toggles
  setTheme(theme) {
    this.state.settings.theme = theme;
    this.saveState();
  }

  setLanguage(lang) {
    this.state.settings.lang = lang;
    this.saveState();
  }

  setGroqKey(key) {
    this.state.settings.groqKey = key;
    this.saveState();
    const email = this.state.currentUser;
    if (email) {
      this.syncToFirestore(email);
    }
  }

  updateProfileDetails(name, details) {
    const email = this.state.currentUser;
    if (!email) return;
    this.state.users[email].name = name;
    this.state.users[email].details = {
      ...this.state.users[email].details,
      ...details
    };
    this.saveState();
    
    // Sync with Firestore cloud database
    this.syncToFirestore(email);
  }

  // Firebase Auth Real-Time Observer Listener
  async initFirebaseAuthListener() {
    try {
      const { auth } = await import('./utils/firebase.js');
      const { onAuthStateChanged } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
      
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          console.log("Firebase Auth: User active -", firebaseUser.email);
          this.state.currentUser = firebaseUser.email;
          this.state.jwtToken = firebaseUser.uid; // Use firebase uid as token
          
          if (!this.state.users[firebaseUser.email]) {
            this.state.users[firebaseUser.email] = {
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              role: (firebaseUser.email.endsWith('@pulselife.com') && firebaseUser.email.startsWith('admin')) ? 'admin' : 'user',
              details: { age: 25, gender: 'Male', height: 175, weight: 70, occupation: 'Software Engineer' }
            };
          }

          if (!this.state.gamification[firebaseUser.email]) {
            this.state.gamification[firebaseUser.email] = {
              points: 0,
              streak: 0,
              lastActiveDate: '',
              badges: [],
              level: 1
            };
          }

          if (!this.state.logs[firebaseUser.email]) {
            this.state.logs[firebaseUser.email] = {};
          }
          
          // Asynchronously merge database state
          await this.loadFromFirestore(firebaseUser.email);
          
        } else {
          console.log("Firebase Auth: Session is unauthenticated.");
          this.state.currentUser = null;
          this.state.jwtToken = null;
        }
        
        this.saveState();
        
        // Notify views to redraw and trigger router logic
        this.notify();
        if (window.router) {
          window.router.handleRoute();
        }
      });
    } catch (e) {
      console.error("Firebase auth listener failed:", e);
    }
  }

  // Cloud Sync Utilities with Firebase Firestore
  async syncToFirestore(email) {
    try {
      const { db } = await import('./utils/firebase.js');
      const { doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
      
      const userRef = doc(db, "users", email);
      await setDoc(userRef, {
        profile: this.state.users[email] || {},
        logs: this.state.logs[email] || {},
        gamification: this.state.gamification[email] || {},
        settings: this.state.settings || {}
      }, { merge: true });
      console.log("Firestore: Cloud synchronization successful for:", email);
    } catch (e) {
      console.error("Firestore sync failed:", e);
    }
  }

  async loadFromFirestore(email) {
    try {
      const { db } = await import('./utils/firebase.js');
      const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
      
      const userRef = doc(db, "users", email);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        let stateChanged = false;
        if (data.profile) {
          this.state.users[email] = { ...this.state.users[email], ...data.profile };
          stateChanged = true;
        }
        if (data.logs) {
          this.state.logs[email] = { ...this.state.logs[email], ...data.logs };
          stateChanged = true;
        }
        if (data.gamification) {
          this.state.gamification[email] = { ...this.state.gamification[email], ...data.gamification };
          stateChanged = true;
        }
        
        if (stateChanged) {
          this.saveState();
        }
        console.log("Firestore: Data retrieved and merged successfully for:", email);
      }
    } catch (e) {
      console.error("Firestore data retrieval failed:", e);
    }
  }
}

export const store = new Store();
export default store;
