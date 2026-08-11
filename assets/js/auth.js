// ===== Auth flows =====
window.HR = window.HR || {};

window.HR.showMsg = function(id, type, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = 'form-msg ' + type;
  el.textContent = text;
  el.style.display = 'block';
};

window.HR.handleRegister = async function(evt) {
  evt.preventDefault();
  const form = evt.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const supa = await window.HR.getSupabase();
  if (!supa) {
    window.HR.showMsg('formMsg', 'info', '⚠️ Supabase não configurado. Preencha /assets/js/supabase-client.js com URL e anon key. (Placeholder ativo)');
    return;
  }
  form.querySelector('button[type=submit]').disabled = true;
  const { data, error } = await supa.auth.signUp({
    email, password,
    options: { data: { full_name: name } }
  });
  form.querySelector('button[type=submit]').disabled = false;
  if (error) return window.HR.showMsg('formMsg', 'error', error.message);
  window.HR.showMsg('formMsg', 'success', 'Conta criada! Verifique seu e-mail se a confirmação estiver ativa.');
  // Also insert into profiles table if you have one:
  try {
    if (data && data.user) {
      await supa.from('profiles').upsert({ id: data.user.id, full_name: name, email });
    }
  } catch (e) { /* table might not exist yet */ }
  setTimeout(() => location.href = '/perfil', 1200);
};

window.HR.handleLogin = async function(evt) {
  evt.preventDefault();
  const form = evt.target;
  const email = form.email.value.trim();
  const password = form.password.value;
  const supa = await window.HR.getSupabase();
  if (!supa) {
    window.HR.showMsg('formMsg', 'info', '⚠️ Supabase não configurado. Preencha /assets/js/supabase-client.js.');
    return;
  }
  form.querySelector('button[type=submit]').disabled = true;
  const { error } = await supa.auth.signInWithPassword({ email, password });
  form.querySelector('button[type=submit]').disabled = false;
  if (error) return window.HR.showMsg('formMsg', 'error', error.message);
  window.HR.showMsg('formMsg', 'success', 'Login realizado! Redirecionando...');
  setTimeout(() => location.href = '/perfil', 800);
};

window.HR.loadProfile = async function() {
  const supa = await window.HR.getSupabase();
  const cardInfo = document.getElementById('profileInfo');
  if (!supa) {
    if (cardInfo) cardInfo.innerHTML = '<div class="form-msg info" style="display:block">⚠️ Supabase não configurado. Preencha as credenciais em <code>/assets/js/supabase-client.js</code> para habilitar login e perfil.</div>';
    return;
  }
  const { data: { session } } = await supa.auth.getSession();
  if (!session) { location.href = '/login'; return; }
  const user = session.user;
  const name = (user.user_metadata && user.user_metadata.full_name) || user.email.split('@')[0];
  document.getElementById('userName').textContent = name;
  document.getElementById('userEmail').textContent = user.email;
  document.getElementById('avatarInitial').textContent = (name[0] || '?').toUpperCase();
  document.getElementById('fldName').value = name;
  document.getElementById('fldEmail').value = user.email;
  // Load orders
  try {
    const { data: orders } = await supa.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    const list = document.getElementById('ordersList');
    if (orders && orders.length) {
      list.innerHTML = orders.map(o => `
        <div style="padding:14px;border:1px solid var(--border);border-radius:10px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center">
          <div><strong>${o.tracking || 'Sem código'}</strong><div style="font-size:13px;color:var(--muted)">${o.description || ''}</div></div>
          <span style="padding:4px 10px;background:var(--primary-50);color:var(--primary);border-radius:999px;font-size:12px;font-weight:600">${o.status || 'aguardando'}</span>
        </div>
      `).join('');
    }
  } catch (e) { /* orders table might not exist */ }
};

window.HR.handleChangePassword = async function(evt) {
  evt.preventDefault();
  const supa = await window.HR.getSupabase();
  if (!supa) return;
  const newPass = evt.target.newpass.value;
  const { error } = await supa.auth.updateUser({ password: newPass });
  if (error) return window.HR.showMsg('passMsg', 'error', error.message);
  window.HR.showMsg('passMsg', 'success', 'Senha alterada com sucesso!');
  evt.target.reset();
};
