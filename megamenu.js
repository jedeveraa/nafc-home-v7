// Header mega menu. Desktop (≥1280): full-width panels that open on hover (with a short
// delay) or click, and work from the keyboard. Below 1280 the same panels are accordions
// inside the menu panel. Panels start closed, so the static XD render is unchanged.
(() => {
  const nav = document.querySelector('.main-nav');
  if (!nav) return;
  const items = [...nav.querySelectorAll('.has-mega')];
  if (!items.length) return;

  const desk = window.matchMedia('(min-width: 1280px)');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  const OPEN_DELAY = 90;    // ms of hover before a panel opens (stops flashes when passing over)
  const CLOSE_DELAY = 220;  // ms grace after the pointer leaves
  let current = null;
  let openTimer = 0;
  let closeTimer = 0;
  let openedByHoverAt = 0;

  // stagger delays: intro first, links 20ms apart (capped), card early
  items.forEach((li) => {
    const links = [...li.querySelectorAll('.mega__links > li')];
    const intro = li.querySelector('.mega__intro');
    const card = li.querySelector('.mega__card');
    // short: this menu is opened many times a visit, so content lands within ~350ms
    if (intro) intro.style.setProperty('--d', '0ms');
    links.forEach((el, i) => el.style.setProperty('--d', `${20 + Math.min(i, 6) * 20}ms`));
    if (card) card.style.setProperty('--d', '80ms');
  });

  // the panel is positioned inside the absolutely placed nav, so give it the nav's offset
  const measure = () => {
    const r = nav.getBoundingClientRect();
    nav.style.setProperty('--mega-x', `${-r.left}px`);
    nav.style.setProperty('--mega-w', `${document.documentElement.clientWidth}px`);
    nav.style.setProperty('--nav-w', `${r.width}px`);
  };

  const btnOf = (li) => li.querySelector('.mnav__btn');
  const setState = (li, on) => {
    li.classList.toggle('is-open', on);
    btnOf(li).setAttribute('aria-expanded', String(on));
  };

  const open = (li) => {
    if (current === li) return;
    if (desk.matches) {
      measure();
      if (current) {
        nav.classList.add('is-switching');
        setState(current, false);
        setState(li, true);
        current = li;
        requestAnimationFrame(() => requestAnimationFrame(() => nav.classList.remove('is-switching')));
        return;
      }
    } else if (current) {
      setState(current, false);
    }
    setState(li, true);
    current = li;
  };

  const close = () => {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    if (!current) return;
    setState(current, false);
    current = null;
  };

  const hoverOK = () => desk.matches && canHover.matches;

  items.forEach((li) => {
    const btn = btnOf(li);

    li.addEventListener('mouseenter', () => {
      if (!hoverOK()) return;
      clearTimeout(closeTimer);
      clearTimeout(openTimer);
      openTimer = setTimeout(() => { open(li); openedByHoverAt = Date.now(); }, current ? 0 : OPEN_DELAY);
    });
    li.addEventListener('mouseleave', () => {
      if (!hoverOK()) return;
      clearTimeout(openTimer);
      closeTimer = setTimeout(close, CLOSE_DELAY);
    });

    btn.addEventListener('click', () => {
      // a click right after a hover-open shouldn't immediately close it again
      if (current === li && hoverOK() && Date.now() - openedByHoverAt < 400) return;
      if (current === li) close();
      else open(li);
    });

    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && desk.matches) {
        e.preventDefault();
        open(li);
        const first = li.querySelector('.mega__links a');
        if (first) setTimeout(() => first.focus(), 30);
      }
    });

    li.addEventListener('focusout', (e) => {
      if (desk.matches && current === li && !li.contains(e.relatedTarget)) close();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !current) return;
    const btn = btnOf(current);
    close();
    btn.focus();
  });

  document.addEventListener('click', (e) => {
    if (desk.matches && current && !current.contains(e.target)) close();
  });

  // measure up front and on every resize: a closed panel still takes up layout width
  if (desk.matches) measure();
  window.addEventListener('resize', () => { if (desk.matches) measure(); });
  desk.addEventListener('change', close);
})();
