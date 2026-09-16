const cards = document.querySelectorAll('.focus-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.14 });
cards.forEach((card, index) => { card.style.transitionDelay = `${index * 70}ms`; observer.observe(card); });

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.add('is-navigating');
    window.setTimeout(() => document.body.classList.remove('is-navigating'), 500);
  });
});
