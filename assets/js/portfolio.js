(() => {
  const navLinks = [...document.querySelectorAll('[data-nav]')];
  const syncNavigation = () => {
    const aboutPage = location.pathname.endsWith('/about.html');
    const selected = aboutPage ? (location.hash === '#contact' ? 'contact' : 'about') : 'work';
    navLinks.forEach(link => {
      if (link.dataset.nav === selected) link.setAttribute('aria-current', selected === 'about' ? 'page' : 'location');
      else link.removeAttribute('aria-current');
    });
  };
  syncNavigation();
  window.addEventListener('hashchange', syncNavigation);


  document.querySelectorAll('[data-copy-email]').forEach(button => {
    const status = button.parentElement.querySelector('.copy-status');
    button.addEventListener('click', async () => {
      const email = button.dataset.copyEmail;
      let copied = false;
      if (navigator.clipboard && window.isSecureContext) {
        try { await navigator.clipboard.writeText(email); copied = true; } catch (_) {}
      }
      if (!copied) {
        const field = document.createElement('textarea');
        field.value = email;
        field.setAttribute('readonly', '');
        field.style.cssText = 'position:fixed;left:-9999px;top:0;font-size:16px';
        document.body.appendChild(field);
        field.select();
        try { copied = document.execCommand('copy'); } catch (_) {}
        field.remove();
        button.focus({preventScroll:true});
      }
      button.querySelector('span').textContent = copied ? '已复制 ✓' : '重试';
      if (status) status.textContent = copied ? '邮箱已复制，可以粘贴使用。' : '未能自动复制，请长按或选中上方邮箱手动复制。';
    });
  });

  const toc = document.querySelector('.toc details');
  const mobile = matchMedia('(max-width:760px)');
  const syncToc = () => { toc.open = !mobile.matches; };
  if (toc) { syncToc(); mobile.addEventListener('change', syncToc); }
  const links = [...document.querySelectorAll('.toc nav a')];
  links.forEach(link => link.addEventListener('click', () => {
    if (mobile.matches) toc.open = false;
  }));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const entry = entries.filter(item => item.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!entry) return;
      links.forEach(link => {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, {rootMargin:'-10% 0px -65% 0px',threshold:0});
    document.querySelectorAll('.chapter').forEach(section => observer.observe(section));
  }
  const dialog = document.getElementById('image-dialog');
  if (!dialog) return;
  const full = document.getElementById('large-image');
  let opener;
  document.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => {
    const img = button.querySelector('img');
    if (!dialog.showModal) { window.open(img.src, '_blank', 'noopener'); return; }
    opener = button;
    full.src = img.src;
    full.alt = img.alt;
    document.getElementById('image-caption').textContent = img.alt;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    document.getElementById('close-image').focus();
  }));
  document.getElementById('close-image').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => {
    const rect = dialog.getBoundingClientRect();
    if (e.target === dialog && (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {document.body.style.overflow = ''; opener?.focus({preventScroll:true});});
})();
