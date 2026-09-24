/**
 * ═══════════════════════════════════════════════════════════════
 * GLITCH MATRIX — SUPABASE INTEGRATION ENGINE
 * Handles Participant Registration, Score Telemetry, and Offline Sync
 * ═══════════════════════════════════════════════════════════════
 */

// Supabase Configuration
// Replace with your Supabase Project URL and Anon/Publishable Key
const SUPABASE_CONFIG = {
  url: window.__SUPABASE_URL__ || localStorage.getItem('gm_supabase_url') || 'https://YOUR_SUPABASE_PROJECT.supabase.co',
  anonKey: window.__SUPABASE_KEY__ || localStorage.getItem('gm_supabase_key') || 'YOUR_SUPABASE_ANON_KEY'
};

let supabaseClient = null;

function initSupabase() {
  if (typeof supabase !== 'undefined' && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey && !SUPABASE_CONFIG.url.includes('YOUR_SUPABASE')) {
    try {
      supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      console.log('[Supabase] Client initialized successfully for', SUPABASE_CONFIG.url);
    } catch (e) {
      console.warn('[Supabase] Failed to initialize client:', e);
    }
  }
}

/**
 * Register Participant into Supabase `participants` table
 * @param {Object} details - { name, reg_number, email, phone }
 * @returns {Promise<Object>}
 */
async function registerParticipant(details) {
  const timestamp = new Date().toISOString();
  const participantRecord = {
    name: details.name.trim(),
    reg_number: details.reg_number.trim().toUpperCase(),
    email: details.email.trim().toLowerCase(),
    phone: details.phone.trim(),
    score: 0,
    modules_cleared: 0,
    created_at: timestamp
  };

  // Always persist locally in localStorage for session resilience
  localStorage.setItem('glitchmatrix_user', JSON.stringify(participantRecord));

  // If Supabase client is ready, insert into database
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('participants')
        .insert([participantRecord])
        .select();

      if (error) {
        console.warn('[Supabase] Insert error:', error.message);
        return { success: true, localOnly: true, error: error.message, data: participantRecord };
      }

      if (data && data[0] && data[0].id) {
        participantRecord.id = data[0].id;
        localStorage.setItem('glitchmatrix_user', JSON.stringify(participantRecord));
      }

      console.log('[Supabase] Participant registered in database:', data);
      return { success: true, data: data ? data[0] : participantRecord };
    } catch (err) {
      console.warn('[Supabase] Network or unexpected exception:', err);
      return { success: true, localOnly: true, error: err.message, data: participantRecord };
    }
  } else {
    console.log('[Supabase] No active connection — stored in local session storage.');
    return { success: true, localOnly: true, data: participantRecord };
  }
}

/**
 * Update Participant Score & Progress on Game Finish
 * @param {number} finalScore
 * @param {number} modulesCleared
 * @param {number} timeLeft
 */
async function recordFinalScore(finalScore, modulesCleared, timeLeft) {
  const rawUser = localStorage.getItem('glitchmatrix_user');
  if (!rawUser) return;

  try {
    const user = JSON.parse(rawUser);
    user.final_score = finalScore;
    user.modules_cleared = modulesCleared;
    user.time_left = timeLeft;
    localStorage.setItem('glitchmatrix_user', JSON.stringify(user));

    if (supabaseClient) {
      if (user.id) {
        await supabaseClient
          .from('participants')
          .update({ score: finalScore, modules_cleared: modulesCleared, time_left: timeLeft })
          .eq('id', user.id);
      } else if (user.reg_number) {
        await supabaseClient
          .from('participants')
          .update({ score: finalScore, modules_cleared: modulesCleared, time_left: timeLeft })
          .eq('reg_number', user.reg_number);
      }
    }
  } catch (err) {
    console.warn('[Supabase] Score record sync skipped:', err);
  }
}

/**
 * Update Supabase credentials at runtime
 */
function updateSupabaseConfig(url, key) {
  SUPABASE_CONFIG.url = url;
  SUPABASE_CONFIG.anonKey = key;
  localStorage.setItem('gm_supabase_url', url);
  localStorage.setItem('gm_supabase_key', key);
  initSupabase();
}

window.SupabaseManager = {
  config: SUPABASE_CONFIG,
  init: initSupabase,
  registerParticipant,
  recordFinalScore,
  updateSupabaseConfig
};

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initSupabase);
}
