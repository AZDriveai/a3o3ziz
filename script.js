const cards = document.querySelectorAll('.focus-card');
const sections = document.querySelectorAll('.section-anchor');
const navLinks = document.querySelectorAll('.nav-link');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.14 });
cards.forEach((card, index) => { card.style.transitionDelay = `${index * 70}ms`; revealObserver.observe(card); });

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


const guideVideo = document.querySelector('#guide-video');
const guideSound = document.querySelector('.guide-sound');
if (guideVideo && guideSound) {
  guideSound.addEventListener('click', () => {
    guideVideo.muted = !guideVideo.muted;
    guideSound.setAttribute('aria-pressed', String(!guideVideo.muted));
    guideSound.innerHTML = guideVideo.muted ? 'Sound off <span>↗</span>' : 'Sound on <span>↗</span>';
    if (!guideVideo.muted) guideVideo.play().catch(() => {});
  });
}
