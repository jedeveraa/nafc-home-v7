// Menu toggle: below 1280px the header nav becomes a drawer that slides in from the right.
(() => {
  const header = document.querySelector('.site-header');
  const toggle = header && header.querySelector('.menu-toggle');
  if (!toggle) return;

  const setOpen = (open) => {
    header.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };

  toggle.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));
  // the scrim is the header's ::before: a click on it targets the header itself
  header.addEventListener('click', (e) => { if (e.target === header && header.classList.contains('is-open')) setOpen(false); });
  // following a link inside the drawer closes it
  header.querySelectorAll('.site-header__menu a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  window.matchMedia('(min-width: 1280px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
})();

// Distance control: the white thumb moves to the chosen option (--i = its index).
document.querySelectorAll('.seg').forEach((seg) => {
  const inputs = [...seg.querySelectorAll('input')];
  const sync = () => seg.style.setProperty('--i', String(Math.max(0, inputs.findIndex((i) => i.checked))));
  inputs.forEach((input) => input.addEventListener('change', sync));
  sync();
});
