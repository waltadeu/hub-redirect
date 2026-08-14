// ===== Common runtime =====
(function() {
  function injectHeader() {
    const header = document.querySelector('[data-header]');
    if (!header) return;
    header.innerHTML = `
      <header class="site-header">
        <div class="container nav">
          <a href="index.html" class="brand" aria-label="Hub Redirect">
            <img src="assets/img/logo.svg" alt="Hub Redirect"/>
          </a>
          <nav class="nav-links" id="navLinks">
            <a href="index.html" data-i18n="nav.home">Início</a>
            <a href="frete.html" data-i18n="nav.frete">Calcular Frete</a>
            <!--<a href="contato.html" data-i18n="nav.contato">Contato</a>-->
            <a href="https://api.whatsapp.com/send?phone=5511992585335" target="_blank" data-i18n="nav.contato">Contato</a>
          </nav>
          <div class="nav-actions">
            <div class="lang-switch" role="group" aria-label="Language">
              <button data-lang="pt-BR" type="button">PT</button>
              <button data-lang="en" type="button">EN</button>
            </div>
            <!--<a href="login.html" class="btn btn-ghost" data-auth-hide data-i18n="nav.login">Entrar</a>-->
            <!--<a href="cadastro.html" class="btn btn-primary" data-auth-hide data-i18n="nav.cadastro">Cadastrar</a>-->
            <a href="perfil.html" class="btn btn-outline" data-auth-show style="display:none" data-i18n="nav.perfil">Meu Perfil</a>
            <button type="button" class="btn btn-ghost" data-auth-show style="display:none" data-logout data-i18n="nav.logout">Sair</button>
            <button class="mobile-toggle" aria-label="menu" onclick="document.getElementById('navLinks').classList.toggle('open')">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>
      </header>
    `;
  }
  function injectFooter() {
    const footer = document.querySelector('[data-footer]');
    if (!footer) return;
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <img src="assets/img/logo.svg" alt="Hub Redirect"/>
              <p data-i18n="footer.tagline">Seu hub de redirecionamento de encomendas da Europa para o Brasil.</p>
            </div>
            <div>
              <h5 data-i18n="footer.services">Serviços</h5>
              <ul>
                <li><a href="/frete" data-i18n="nav.frete">Calcular Frete</a></li>
                <li><a href="/cadastro" data-i18n="nav.cadastro">Cadastrar</a></li>
                <li><a href="/login" data-i18n="nav.login">Entrar</a></li>
              </ul>
            </div>
            <div>
              <h5 data-i18n="footer.company">Empresa</h5>
              <ul>
                <!--<li><a href="/contato" data-i18n="footer.contact">Contato</a></li>-->
                <li><a href="https://api.whatsapp.com/send?phone=5511992585335" target="_blank" data-i18n="footer.contact">Contato</a></li>
                <li><a href="/#faq" data-i18n="footer.faq">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h5 data-i18n="footer.legal">Legal</h5>
              <ul>
                <li><a href="#" data-i18n="footer.privacy">Privacidade</a></li>
                <li><a href="#" data-i18n="footer.terms">Termos</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            &copy; <span id="y"></span> Hub Redirect. <span data-i18n="footer.rights">Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>
    `;
    const y = document.getElementById('y'); if (y) y.textContent = new Date().getFullYear();
  }

  async function setupAuthNav() {
    const supa = await window.HR.getSupabase();
    let logged = false;
    if (supa) {
      const { data } = await supa.auth.getSession();
      logged = !!(data && data.session);
    }
    document.querySelectorAll('[data-auth-hide]').forEach(el => el.style.display = logged ? 'none' : '');
    document.querySelectorAll('[data-auth-show]').forEach(el => el.style.display = logged ? '' : 'none');
    const btn = document.querySelector('[data-logout]');
    if (btn) btn.onclick = async () => {
      const supa2 = await window.HR.getSupabase();
      if (supa2) await supa2.auth.signOut();
      location.href = '/';
    };
  }

  function setupLangSwitch() {
    document.querySelectorAll('.lang-switch button').forEach(btn => {
      btn.addEventListener('click', () => window.HR.setLang(btn.getAttribute('data-lang')));
    });
  }

  function highlightActive() {
    const path = location.pathname.replace(/\/$/, '') || '/';
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === path || (path === '/' && href === '/')) a.classList.add('active');
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    injectHeader();
    injectFooter();
    setupLangSwitch();
    window.HR.applyI18n();
    window.HR.setLang(window.HR.getLang());
    highlightActive();
    await setupAuthNav();
  });
})();
