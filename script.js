const cards = document.querySelectorAll('.focus-card, .work-card');
const sections = document.querySelectorAll('.section-anchor');
const navLinks = document.querySelectorAll('.nav-link');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });
cards.forEach((card, index) => {
  card.style.transitionDelay = `${(index % 3) * 70}ms`;
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

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.add('is-navigating');
    window.setTimeout(() => document.body.classList.remove('is-navigating'), 500);
  });
});

// Privacy-friendly analytics hook: integrates with a future analytics provider without loading one today.
const track = (eventName, detail = {}) => {
  window.dispatchEvent(new CustomEvent('abda:event', { detail: { eventName, ...detail } }));
};
document.querySelectorAll('[data-event]').forEach((element) => {
  element.addEventListener('click', () => track(element.dataset.event, { href: element.getAttribute('href') || null }));
});

const guideVideo = document.querySelector('#guide-video');
const guideSound = document.querySelector('.guide-sound');
if (guideVideo && guideSound) {
  const playGuide = () => {
    guideVideo.play().catch(() => {});
    track('guide_video_play');
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
