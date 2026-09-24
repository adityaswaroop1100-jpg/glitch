/**
 * ═══════════════════════════════════════════════════════════════
 * GLITCH MATRIX — FIREBASE CLOUD FIRESTORE TELEMETRY ENGINE
 * Handles Participant Registration, Realtime Score Sync & Fallbacks
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
  // Default Firebase config for Glitch project
  const DEFAULT_CONFIG = {
    apiKey: 'AIzaSyCxQ5akoyRA9zrBkat7dZ4aJJXuLblWWLE',
    authDomain: 'glitch-49720.firebaseapp.com',
    projectId: 'glitch-49720',
    storageBucket: 'glitch-49720.firebasestorage.app',
    messagingSenderId: '549462505723',
    appId: '1:549462505723:web:a6161ced64d005283bd85e'
  };

  let activeConfig = null;
  let firestoreDb = null;
  let firebaseApp = null;

  /**
   * Safe parser for Firebase config from localStorage or string
   */
  function loadConfig() {
    if (window.__FIREBASE_CONFIG__ && typeof window.__FIREBASE_CONFIG__ === 'object') {
      return window.__FIREBASE_CONFIG__;
    }
    const saved = localStorage.getItem('gm_firebase_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('[Firebase] Failed to parse saved config:', e);
      }
    }
    return DEFAULT_CONFIG;
  }

  /**
   * Initialize Firebase SDK & Firestore
   */
  function initFirebase() {
    activeConfig = loadConfig();

    if (typeof firebase === 'undefined') {
      console.warn('[Firebase] Firebase SDK not detected in global scope.');
      return false;
    }

    if (!activeConfig || !activeConfig.apiKey || !activeConfig.projectId) {
      console.log('[Firebase] Awaiting credentials. Use ⚙️ DB CONFIG on login screen to connect.');
      return false;
    }

    try {
      if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(activeConfig);
      } else {
        firebaseApp = firebase.app();
      }
      firestoreDb = firebase.firestore();
      console.log('[Firebase] Connected to Project:', activeConfig.projectId);
      return true;
    } catch (err) {
      console.warn('[Firebase] Initialization error:', err.message);
      return false;
    }
  }

  /**
   * Save or update Firebase configuration
   * Supports JSON object or JS snippet string from Firebase console
   */
  function saveConfig(rawInput) {
    let parsedConfig = {};
    if (typeof rawInput === 'object') {
      parsedConfig = rawInput;
    } else if (typeof rawInput === 'string') {
      let str = rawInput.trim();
      // Remove any 'const firebaseConfig = ' or 'var config = ' wrapper if user pasted raw snippet
      str = str.replace(/^(const|let|var)\s+\w+\s*=\s*/, '').replace(/;$/, '');
      try {
        // Try direct JSON parse
        parsedConfig = JSON.parse(str);
      } catch (e) {
        // Fallback: parse relaxed object literals (e.g. unquoted keys)
        try {
          const fn = new Function('return (' + str + ');');
          parsedConfig = fn();
        } catch (e2) {
          throw new Error('Invalid Firebase config format. Please paste valid JSON or configuration object.');
        }
      }
    }

    if (!parsedConfig.apiKey || !parsedConfig.projectId) {
      throw new Error('Config missing required fields: "apiKey" and "projectId".');
    }

    localStorage.setItem('gm_firebase_config', JSON.stringify(parsedConfig));
    activeConfig = parsedConfig;

    // Reset app if already initialized
    try {
      if (firebase.apps.length) {
        firebase.app().delete().then(() => {
          initFirebase();
        });
      } else {
        initFirebase();
      }
    } catch (e) {
      initFirebase();
    }

    return true;
  }

  /**
   * Check if Firebase is currently configured and active
   */
  function isReady() {
    return !!(firestoreDb && activeConfig && activeConfig.projectId);
  }

  /**
   * Register Participant into Firestore `participants` collection
   * @param {Object} details - { name, reg_number, email, phone }
   * @returns {Promise<Object>}
   */
  async function registerParticipant(details) {
    const timestamp = new Date().toISOString();
    const cleanReg = (details.reg_number || '').trim().toUpperCase();

    const participantRecord = {
      name: (details.name || '').trim(),
      reg_number: cleanReg,
      email: (details.email || '').trim().toLowerCase(),
      phone: (details.phone || '').trim(),
      score: 0,
      modules_cleared: 0,
      time_left: 300,
      status: 'LOGGED_IN',
      created_at: timestamp,
      updated_at: timestamp
    };

    // Always store in localStorage for offline resilience
    localStorage.setItem('glitchmatrix_user', JSON.stringify(participantRecord));

    if (isReady()) {
      try {
        // Use reg_number as document ID for idempotency and easy lookups
        const docRef = firestoreDb.collection('participants').doc(cleanReg);
        await docRef.set(participantRecord, { merge: true });
        console.log('[Firebase] Participant document synced:', cleanReg);
        return { success: true, firestore: true, data: participantRecord };
      } catch (err) {
        console.warn('[Firebase] Firestore write error:', err.message);
        return { success: true, firestore: false, error: err.message, data: participantRecord };
      }
    } else {
      console.log('[Firebase] Running in local offline mode (no active Firestore connection).');
      return { success: true, firestore: false, localOnly: true, data: participantRecord };
    }
  }

  /**
   * Update Participant Score & Progress on Game Finish
   * @param {number} finalScore - Total score (min 0, max 25)
   * @param {number} modulesCleared - Number of modules cleared (0 to 7)
   * @param {number} timeLeft - Remaining seconds
   * @param {Object} [extraDetails] - { questionScore, timeBonus }
   */
  async function recordFinalScore(finalScore, modulesCleared, timeLeft, extraDetails = {}) {
    const rawUser = localStorage.getItem('glitchmatrix_user');
    if (!rawUser) return;

    try {
      const user = JSON.parse(rawUser);
      // Strictly bound between 0 and 25 points
      const safeScore = Math.min(25, Math.max(0, Math.round(finalScore)));
      const questionScore = Math.min(21, Math.max(0, extraDetails.questionScore !== undefined ? extraDetails.questionScore : Math.min(21, safeScore)));
      const timeBonus = Math.min(4, Math.max(0, extraDetails.timeBonus !== undefined ? extraDetails.timeBonus : Math.max(0, safeScore - questionScore)));
      const timeTaken = Math.max(0, 300 - timeLeft);

      user.score = safeScore;
      user.question_score = questionScore;
      user.time_bonus = timeBonus;
      user.modules_cleared = modulesCleared;
      user.time_left = timeLeft;
      user.time_taken = timeTaken;
      user.status = modulesCleared >= 7 ? 'MAINFRAME_RESTORED' : 'SIGNAL_LOST';
      user.completed_at = new Date().toISOString();
      user.updated_at = new Date().toISOString();

      localStorage.setItem('glitchmatrix_user', JSON.stringify(user));

      if (isReady() && user.reg_number) {
        const docRef = firestoreDb.collection('participants').doc(user.reg_number);
        await docRef.set({
          name: user.name || 'Anonymous Operative',
          reg_number: user.reg_number,
          email: user.email || '',
          phone: user.phone || '',
          score: safeScore,
          question_score: questionScore,
          time_bonus: timeBonus,
          modules_cleared: modulesCleared,
          time_left: timeLeft,
          time_taken: timeTaken,
          status: user.status,
          completed_at: user.completed_at,
          updated_at: user.updated_at
        }, { merge: true });
        console.log('[Firebase] Telemetry saved to Firestore for:', user.reg_number, 'Points:', safeScore, `(${questionScore} Q + ${timeBonus} Time)`);
      }
    } catch (err) {
      console.warn('[Firebase] Score telemetry sync failed:', err);
    }
  }

  /**
   * Fetch Live Operative Leaderboard from Firestore
   * Sorted primarily by Total Score (DESC), secondarily by Time Taken (ASC)
   * @param {number} limitCount
   * @returns {Promise<Object>}
   */
  async function getLeaderboard(limitCount = 50) {
    if (isReady()) {
      try {
        const snap = await firestoreDb.collection('participants')
          .orderBy('score', 'desc')
          .limit(limitCount)
          .get();

        const list = [];
        snap.forEach(doc => {
          const d = doc.data();
          if (d && d.name && d.reg_number) {
            list.push(d);
          }
        });

        // In-memory sort: primary: score DESC, secondary: time_taken ASC, tertiary: completed_at ASC
        list.sort((a, b) => {
          if ((b.score || 0) !== (a.score || 0)) {
            return (b.score || 0) - (a.score || 0);
          }
          return (a.time_taken || 300) - (b.time_taken || 300);
        });

        return { success: true, firestore: true, leaderboard: list };
      } catch (err) {
        console.warn('[Firebase] Failed to fetch leaderboard from Firestore:', err.message);
      }
    }

    // Fallback: local session user
    const local = localStorage.getItem('glitchmatrix_user');
    const list = [];
    if (local) {
      try {
        list.push(JSON.parse(local));
      } catch (e) {}
    }
    return { success: true, firestore: false, leaderboard: list };
  }

  /**
   * Test Firestore connection by attempting a lightweight read/write ping
   */
  async function testConnection() {
    if (!isReady()) {
      const ok = initFirebase();
      if (!ok) return { success: false, message: 'Firebase not configured or SDK missing.' };
    }
    try {
      const testDoc = firestoreDb.collection('_health_check').doc('ping');
      await testDoc.set({ timestamp: new Date().toISOString() });
      return { success: true, message: 'Connected successfully to Firebase Cloud Firestore!' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  // Public API
  window.FirebaseManager = {
    init: initFirebase,
    getConfig: () => activeConfig || loadConfig(),
    saveConfig,
    isReady,
    registerParticipant,
    recordFinalScore,
    getLeaderboard,
    testConnection
  };

  // Auto-init on script load
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initFirebase);
    } else {
      initFirebase();
    }
  }
})();
