// ===== Supabase Client =====
// Preencha as credenciais abaixo com seu projeto Supabase (https://supabase.com)
// PLACEHOLDER: substituir SUPABASE_URL e SUPABASE_ANON_KEY antes de usar em produção.
window.SUPABASE_CONFIG = {
  url: 'YOUR_SUPABASE_URL',      // Ex.: https://xxxxx.supabase.co
  anonKey: 'YOUR_SUPABASE_ANON_KEY'
};

let _supabase = null;
window.HR = window.HR || {};
window.HR.getSupabase = async function() {
  if (_supabase) return _supabase;
  const cfg = window.SUPABASE_CONFIG;
  const ok = cfg && cfg.url && cfg.anonKey && !cfg.url.includes('YOUR_') && !cfg.anonKey.includes('YOUR_');
  if (!ok) {
    console.warn('[Hub Redirect] Supabase não configurado. Preencha /assets/js/supabase-client.js');
    return null;
  }
  const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm');
  _supabase = createClient(cfg.url, cfg.anonKey);
  return _supabase;
};

window.HR.isSupabaseConfigured = function() {
  const cfg = window.SUPABASE_CONFIG;
  return !!(cfg && cfg.url && cfg.anonKey && !cfg.url.includes('YOUR_') && !cfg.anonKey.includes('YOUR_'));
};
