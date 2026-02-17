// ============================================
// RAM Software - Landing Page Specific JavaScript
// ============================================

/**
 * Landing Page Animations and Interactions
 */
const LandingPage = {
  init() {
    this.initScrollAnimations();
    this.initHeroAnimation();
    this.initCounterAnimation();
    this.initCaseStudyHover();
  },

  /**
   * Initialize scroll-triggered animations
   */
  initScrollAnimations() {
    // Animate sections on scroll
    RAMSoftware.Utils.observeElements(
      "section",
      (element) => {
        element.classList.add("animate-fade-in");
      },
      { threshold: 0.1 },
    );

    // Animate service cards with stagger
    const serviceCards = document.querySelectorAll(".service-card");
    serviceCards.forEach((card, index) => {
      RAMSoftware.Utils.observeElements(card, (el) => {
        el.style.animationDelay = `${index * 100}ms`;
        el.classList.add("animate-slide-in");
      });
    });

    // Animate case study cards
    const caseStudies = document.querySelectorAll(".case-study-card");
    caseStudies.forEach((card, index) => {
      RAMSoftware.Utils.observeElements(card, (el) => {
        el.style.animationDelay = `${index * 150}ms`;
        el.classList.add("animate-fade-in");
      });
    });

    // Animate bento items
    const bentoItems = document.querySelectorAll(".bento-item");
    bentoItems.forEach((item, index) => {
      RAMSoftware.Utils.observeElements(item, (el) => {
        el.style.animationDelay = `${index * 100}ms`;
        el.classList.add("animate-fade-in");
      });
    });
  },

  /**
   * Initialize hero section animations
   */
  initHeroAnimation() {
    const hero = document.querySelector("section:first-of-type");
    if (!hero) return;

    // Add initial animation classes
    const heroElements = hero.querySelectorAll("h1, p, .btn, .inline-flex");
    heroElements.forEach((el, index) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";

      setTimeout(
        () => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        },
        100 + index * 100,
      );
    });

    // Animate hero image
    const heroImage = hero.querySelector(".relative.group");
    if (heroImage) {
      heroImage.style.opacity = "0";
      heroImage.style.transform = "translateX(30px)";
      heroImage.style.transition = "opacity 0.8s ease, transform 0.8s ease";

      setTimeout(() => {
        heroImage.style.opacity = "1";
        heroImage.style.transform = "translateX(0)";
      }, 400);
    }
  },

  /**
   * Initialize counter animation for stats
   */
  initCounterAnimation() {
    const counters = document.querySelectorAll(".stat-value");

    counters.forEach((counter) => {
      RAMSoftware.Utils.observeElements(counter, (el) => {
        const target = el.textContent;
        const isPercentage = target.includes("%");
        const isTime = target.includes("ms");
        const numericValue = parseFloat(target.replace(/[^0-9.]/g, ""));

        if (!isNaN(numericValue)) {
          this.animateCounter(el, numericValue, isPercentage, isTime);
        }
      });
    });
  },

  /**
   * Animate a counter from 0 to target value
   */
  animateCounter(element, target, isPercentage, isTime) {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;

      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      let displayValue = current.toFixed(isTime ? 0 : 1);
      if (isPercentage) displayValue += "%";
      if (isTime) displayValue += "ms";
      if (target < 1 && !isTime && !isPercentage)
        displayValue = "<" + displayValue;

      element.textContent = displayValue;
    }, stepDuration);
  },

  /**
   * Initialize case study card hover effects
   */
  initCaseStudyHover() {
    const caseStudies = document.querySelectorAll(".case-study-card");

    caseStudies.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-4px)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
      });
    });
  },
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  LandingPage.init();
});
