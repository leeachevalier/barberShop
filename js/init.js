// js/init.js
(() => {
  const $  = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  /* --- A) Resaltar día actual --- */
  function highlightToday() {
    const today = new Date().getDay(); // 0=Dom ... 6=Sab
    $$('.hours-table tr').forEach(tr => {
      if (Number(tr.dataset.day) === today) tr.classList.add('today');
    });
  }

  /* --- B) Modal de reserva + WhatsApp --- */
  function bookingModal() {
    const modal = $('#bookingModal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close');
    const backdrop = modal.querySelector('.modal-backdrop');

    const bkServicio  = $('#bkServicio');
    const bkBarbero   = $('#bkBarbero');
    const bkFechaHora = $('#bkFechaHora');
    const bkNombre    = $('#bkNombre');
    const bkTelefono  = $('#bkTelefono');
    const form        = $('#bookingForm');

    const WHATSAPP_NUMBER = document.body.dataset.whatsapp || '59899123456';

    $$('.btn-reservar').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.card');
        const servicio = card?.querySelector('h3')?.textContent.trim() || 'Servicio';
        bkServicio.value = servicio;

        const now = new Date();
        bkFechaHora.min = new Date(now.getTime() - now.getTimezoneOffset()*60000)
          .toISOString().slice(0,16); // YYYY-MM-DDTHH:MM

        modal.classList.add('open');
        bkBarbero.focus();
      });
    });

    const close = () => modal.classList.remove('open');
    closeBtn?.addEventListener('click', close);
    backdrop?.addEventListener('click', close);

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const dt    = new Date(bkFechaHora.value);
      const fecha = dt.toLocaleDateString('es-UY',
        { weekday:'long', day:'2-digit', month:'2-digit', year:'numeric' });
      const hora  = dt.toLocaleTimeString('es-UY', { hour:'2-digit', minute:'2-digit' });

      const mensaje =
        `Hola Barber Shop, soy ${bkNombre.value}. ` +
        `Quiero reservar *${bkServicio.value}* con ${bkBarbero.value} ` +
        `para el ${fecha} a las ${hora}. ` +
        `Mi teléfono: ${bkTelefono.value}`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`, '_blank');
      close();
      form.reset();
    });
  }

  /* --- C) Tema claro/oscuro --- */
  function themeInit() {
    const root = document.documentElement;
    const btn  = document.getElementById('themeToggle');

    const saved = localStorage.getItem('theme');
    const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initial = saved || systemPref;

    setTheme(initial);

    btn?.addEventListener('click', () => {
      const next = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
      setTheme(next);
      localStorage.setItem('theme', next);
    });

    function setTheme(name){
      root.setAttribute('data-theme', name);
      if (btn){
        const dark = name === 'dark';
        btn.textContent = dark ? '☀️' : '🌙';
        btn.setAttribute('aria-pressed', String(dark));
        btn.setAttribute('aria-label', dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
      }
    }
  }

  /* --- Start --- */
  const start = () => { themeInit(); highlightToday(); bookingModal(); };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
