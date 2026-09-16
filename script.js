const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const cards = document.querySelectorAll('.focus-card, .work-card');
const sections = document.querySelectorAll('.section-anchor');
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

cards.forEach((card, index) => {
  card.style.transitionDelay = reducedMotion.matches ? '0ms' : `${(index % 3) * 70}ms`;
  revealObserver.observe(card);
});

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const current = entry.target.dataset.sectionId;
    navLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.section === current));
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
sections.forEach((section) => activeObserver.observe(section));

const setMenu = (open) => {
  if (!menuToggle || !nav) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
  if (open) navLinks[0]?.focus();
};
menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

const track = (eventName, detail = {}) => {
  window.dispatchEvent(new CustomEvent('abda:event', { detail: { eventName, ...detail } }));
};
document.querySelectorAll('[data-event]').forEach((element) => {
  element.addEventListener('click', () => track(element.dataset.event, { href: element.getAttribute('href') || null }));
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.add('is-navigating');
    window.setTimeout(() => document.body.classList.remove('is-navigating'), reducedMotion.matches ? 0 : 500);
  });
});

const guideVideo = document.querySelector('#guide-video');
const guideSound = document.querySelector('.guide-sound');
if (guideVideo && guideSound) {
  let hasTrackedPlay = false;
  const playGuide = () => {
    guideVideo.play().then(() => {
      if (!hasTrackedPlay) {
        track('guide_video_play');
        hasTrackedPlay = true;
      }
    }).catch(() => {});
  };
  const videoObserver = new IntersectionObserver((entries, observer) => {
    if (!entries[0].isIntersecting) return;
    playGuide();
    observer.disconnect();
  }, { threshold: 0.2 });
  videoObserver.observe(guideVideo);
  guideSound.addEventListener('click', () => {
    guideVideo.muted = !guideVideo.muted;
    const isOn = !guideVideo.muted;
    guideSound.setAttribute('aria-pressed', String(isOn));
    guideSound.setAttribute('aria-label', isOn ? 'Turn guide audio off' : 'Turn guide audio on');
    guideSound.innerHTML = isOn ? 'Sound on <span>↗</span>' : 'Sound off <span>↗</span>';
    track('guide_sound_toggle', { enabled: isOn });
    if (isOn) playGuide();
  });
}
