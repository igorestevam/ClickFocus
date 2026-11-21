(() => {
  'use strict';
  // Contatos oficiais da ClickFocus (DDI + DDD + número para o WhatsApp).
  const WHATSAPP_BUSINESS = '5527992249680';
  const CONTACT_EMAIL = 'igorestevam1900@gmail.com';

  const header = document.getElementById('site-header');
  const toggle = document.getElementById('menu-toggle');
  const mobile = document.getElementById('mobile-menu');
  const setScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 12);
  window.addEventListener('scroll', setScroll, { passive: true });
  setScroll();

  const closeMenu = () => {
    mobile?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Abrir menu');
  };
  toggle?.addEventListener('click', () => {
    const open = mobile.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  mobile?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth >= 1024) closeMenu(); });

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-reveal');
    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px 24px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }

  // Projeto demonstrativo: botões de portfólio abrem estudos de caso.
  let activeModal = null;
  let previousFocus = null;
  function closeModal() {
    if (!activeModal) return;
    activeModal.classList.remove('is-open');
    activeModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cf-no-scroll');
    activeModal = null;
    previousFocus?.focus();
  }
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    closeMenu();
    const next = document.getElementById('project-' + button.dataset.project);
    if (!next) return;
    closeModal();
    previousFocus = button;
    activeModal = next;
    next.classList.add('is-open');
    next.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cf-no-scroll');
    next.querySelector('.cf-modal__close')?.focus();
  }));
  document.querySelectorAll('.cf-modal').forEach(modal => {
    modal.querySelector('.cf-modal__close')?.addEventListener('click', closeModal);
    modal.querySelectorAll('[data-close-modal]').forEach(a => a.addEventListener('click', closeModal));
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeMenu(); }
    if (e.key === 'Tab' && activeModal) {
      const nodes = Array.from(activeModal.querySelectorAll('button:not([disabled]),a[href],input,select,textarea')).filter(el => el.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // FAQ
  document.querySelectorAll('.cf-faq__trigger').forEach(btn => btn.addEventListener('click', () => {
    const item = btn.closest('.cf-faq__item');
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    const nowOpen = btn.getAttribute('aria-expanded') !== 'true';
    document.querySelectorAll('.cf-faq__trigger').forEach(other => {
      other.setAttribute('aria-expanded', 'false');
      other.closest('.cf-faq__item')?.classList.remove('is-open');
      const otherPanel = document.getElementById(other.getAttribute('aria-controls'));
      if (otherPanel) otherPanel.hidden = true;
    });
    btn.setAttribute('aria-expanded', String(nowOpen));
    item?.classList.toggle('is-open', nowOpen);
    if (panel) panel.hidden = !nowOpen;
  }));

  const emailNote = document.getElementById('contact-email-note');
  const emailLink = document.getElementById('contact-email-link');
  const configuredEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(CONTACT_EMAIL);
  if (configuredEmail && emailLink) {
    emailLink.href = 'mailto:' + CONTACT_EMAIL;
    emailLink.textContent = CONTACT_EMAIL;
    emailLink.hidden = false;
    if (emailNote) emailNote.hidden = true;
  }
  const waLink = document.getElementById('whatsapp-link');
  const waNote = document.getElementById('whatsapp-note');
  const activeBusiness = /^\d{12,13}$/.test(WHATSAPP_BUSINESS);
  const contactSubmit = document.getElementById('contact-submit');
  const formDisclosure = document.querySelector('#contact-form .cf-small');
  if (activeBusiness) {
    if (contactSubmit) contactSubmit.textContent = 'Continuar no WhatsApp';
    if (formDisclosure) formDisclosure.textContent = 'Abriremos o WhatsApp com sua mensagem preenchida. Confira os dados e toque em enviar: nenhum briefing é enviado automaticamente.';
  }
  if (activeBusiness && waLink) {
    waLink.hidden = false;
    waLink.href = 'https://wa.me/' + WHATSAPP_BUSINESS + '?text=' + encodeURIComponent('Olá! Encontrei a ClickFocus pelo site e gostaria de pedir um orçamento.');
    if (waNote) waNote.textContent = 'Atendimento pelo número (27) 99224-9680. Envie sua mensagem pelo botão abaixo.';
  }

  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('contact-feedback');
  function notify(message, type) {
    feedback.textContent = message;
    feedback.className = 'cf-form__feedback is-visible cf-form__feedback--' + type;
  }
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      notify('Confira os campos obrigatórios antes de continuar.', 'err');
      return;
    }
    const data = new FormData(form);
    const briefing = [
      'Olá, ClickFocus! Gostaria de solicitar um orçamento de landing page.',
      'Nome: ' + String(data.get('name') || '').trim(),
      'E-mail: ' + String(data.get('email') || '').trim(),
      'WhatsApp: ' + String(data.get('phone') || 'Não informado').trim(),
      'Projeto: ' + String(data.get('projectType') || ''),
      'Sobre: ' + String(data.get('message') || '').trim()
    ].join('\n');
    if (activeBusiness) {
      const conversation = 'https://wa.me/' + WHATSAPP_BUSINESS + '?text=' + encodeURIComponent(briefing);
      window.open(conversation, '_blank', 'noopener,noreferrer');
      notify('O WhatsApp foi solicitado em uma nova aba. Se seu navegador bloquear a abertura, permita o pop-up e tente novamente. Revise e envie a mensagem no aplicativo.', 'ok');
      return;
    }
    let copied = false;
    try { await navigator.clipboard.writeText(briefing); copied = true; } catch (_) {
      const ta = document.createElement('textarea');
      ta.value = briefing; document.body.append(ta); ta.select();
      copied = document.execCommand('copy'); ta.remove();
    }
    if (copied) notify('Seu texto foi copiado, mas ainda não há um canal de atendimento ativo. Nada foi enviado para a ClickFocus. Guarde o briefing para enviar quando o WhatsApp estiver disponível.', 'ok');
    else notify('O contato ainda não está disponível e não foi possível copiar o texto automaticamente. Seus dados não foram enviados.', 'err');
  });
})();
