// NAFC Home v7: project motion (xd-motion skill). Runs only with html.js (see the head snippet).
(() => {
  if (!document.documentElement.classList.contains('js')) return;

  // Partner logo marquee: wrap the logo list in a track and add a second, hidden copy so -50% loops seamlessly.
  // The first frame matches the static XD row; the edge fades stay on top.
  document.querySelectorAll('ul[data-marquee]').forEach((list) => {
    const marquee = document.createElement('div');
    marquee.className = 'marquee';
    const track = document.createElement('div');
    track.className = 'marquee__track';
    list.before(marquee);
    marquee.appendChild(track);
    track.appendChild(list);
    const copy = list.cloneNode(true);
    copy.removeAttribute('data-marquee');
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('img').forEach((img) => { img.alt = ''; });
    track.appendChild(copy);
  });
  // Nav hover pill: slides between the main links; stays on a menu item while its mega panel is open.
  const nav = document.querySelector('.main-nav');
  const list = nav && nav.querySelector(':scope > ul');
  const deskHover = window.matchMedia('(min-width: 1280px) and (hover: hover) and (pointer: fine)');
  if (list) {
    const pill = document.createElement('span');
    pill.className = 'nav-pill';
    pill.setAttribute('aria-hidden', 'true');
    nav.prepend(pill);
    const items = [...list.children];
    const trigger = (li) => li.querySelector(':scope > a, :scope > .mnav__btn');
    const PAD = 12;   // pill padding around the label (the gaps between links are 31-32px)
    let shown = false;
    let hovering = false;
    const place = (li) => {
      const n = nav.getBoundingClientRect(), r = trigger(li).getBoundingClientRect();
      pill.style.setProperty('--l', `${(r.left - n.left + 14 - PAD).toFixed(2)}px`);
      pill.style.setProperty('--r', `${(n.right + 14 - r.right - PAD).toFixed(2)}px`);
    };
    const show = (li) => {
      if (!deskHover.matches) return;
      if (!shown) { pill.classList.add('is-jump'); place(li); void pill.offsetWidth; pill.classList.remove('is-jump'); shown = true; }
      else place(li);
      pill.classList.add('is-on');
    };
    const hide = () => { pill.classList.remove('is-on'); shown = false; };
    const openItem = () => items.find((li) => li.classList.contains('is-open'));
    items.forEach((li) => li.addEventListener('mouseenter', () => { hovering = true; show(li); }));
    list.addEventListener('mouseleave', () => {
      hovering = false;
      const o = openItem();
      if (o) show(o); else hide();
    });
    // mega menu opened or closed by click, keyboard or its own hover timers
    new MutationObserver(() => {
      if (hovering) return;
      const o = openItem();
      if (o) show(o); else hide();
    }).observe(list, { subtree: true, attributes: true, attributeFilter: ['class'] });
    deskHover.addEventListener('change', hide);
  }

  // Load sequence: once an item has landed, drop its hook so no finished animation stays attached
  // (a held animation keeps the element on its own layer and shifts the anti-aliasing of fine icons).
  document.querySelectorAll('[data-load]').forEach((el) => {
    el.addEventListener('animationend', (e) => { if (e.target === el) el.removeAttribute('data-load'); }, { once: false });
  });

  // Header Donate Now: the heart beats twice, once, about 1.5s after load (after the hero sequence).
  // A class (not a CSS animation on the element) so the beat never replays when a hover ends.
  const donate = document.querySelector('.hbtn--donate');
  if (donate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setTimeout(() => {
      if (donate.matches(':hover')) return;
      donate.classList.add('is-beat');
      donate.querySelector('.i-heart').addEventListener('animationend', () => donate.classList.remove('is-beat'), { once: true });
    }, 1500);
  }
})();
