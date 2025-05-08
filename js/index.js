
document.addEventListener("DOMContentLoaded", () => {
  const scrollBtn = document.querySelector(".scroll-top");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});

// RELOAD PAGE WITH LOGO

document.querySelector('.navbar-toggler').addEventListener('click', function () {
  window.location.reload(); // Reload the page when clicked
});

// HIDE NAV BAR WITH SCROLL

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById('navmenu');
  let lastScrollTop = 0;

  window.addEventListener('scroll', function () {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
      // Scrolling down: hide navbar
      navbar.classList.add('collapsed');
    } else {
      // Scrolling up: show navbar
      navbar.classList.remove('collapsed');
    }

    lastScrollTop = Math.max(0, currentScroll);
  });
});


// CV BUTTON

const svgStar = `
<svg viewBox="0 0 784.11 815.53" xmlns="http://www.w3.org/2000/svg">
  <path class="fil0" d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78
    207.96,29.37 371.12,197.68 392.05,407.74
    20.93,-210.06 184.09,-378.37 392.05,-407.74
    -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"/>
</svg>`;

const createStar = (className) => {
  const div = document.createElement('div');
  div.className = className;
  div.innerHTML = svgStar;
  return div;
};

// You can still dynamically create the stars using JavaScript if necessary
document.addEventListener('DOMContentLoaded', () => {
  const stars = ['star-1', 'star-2', 'star-3', 'star-4', 'star-5', 'star-6'];
  stars.forEach((starClass) => {
    const star = createStar(starClass);
    const button = document.querySelector('.CVbtn');
    button.appendChild(star);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const animation = entry.target.getAttribute("data-animate");
        entry.target.classList.add(`animate-${animation}`);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.01,            // Smaller threshold = earlier trigger
    rootMargin: "0px 0px -150px 0px" // Pull trigger zone upward
  });

  document.querySelectorAll("[data-animate]").forEach(el => {
    observer.observe(el);
  });
});

