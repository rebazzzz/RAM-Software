// ============================================
// RAM Software - Services Page JavaScript
// ============================================

/**
 * Services Page Animations and Interactions
 */
const ServicesPage = {
  init() {
    this.initScrollAnimations();
    this.initServiceCards();
    this.initTechStackHover();
    this.initProcessAnimation();
  },

  /**
   * Initialize scroll-triggered animations
   */
  initScrollAnimations() {
    // Animate hero section
    const hero = document.querySelector("section:first-of-type");
    if (hero) {
      const heroElements = hero.querySelectorAll("h1, h2, p");
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
    }

    // Animate service sections
    const serviceSections = document.querySelectorAll(".grid.lg\\:grid-cols-2");
    serviceSections.forEach((section, index) => {
      RAMSoftware.Utils.observeElements(section, (el) => {
        el.style.opacity = "0";
        el.style.transform =
          index % 2 === 0 ? "translateX(-30px)" : "translateX(30px)";
        el.style.transition = "opacity 0.8s ease, transform 0.8s ease";

        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "translateX(0)";
        }, 100);
      });
    });
  },

  /**
   * Initialize service card interactions
   */
  initServiceCards() {
    const serviceCards = document.querySelectorAll(".grid.lg\\:grid-cols-2");

    serviceCards.forEach((card) => {
      const visual = card.querySelector(".aspect-\\[4\\/3\\]");
      if (visual) {
        // Add hover effect to the entire card
        card.addEventListener("mouseenter", () => {
          visual.style.transform = "scale(1.02)";
          visual.style.transition = "transform 0.5s ease";
        });

        card.addEventListener("mouseleave", () => {
          visual.style.transform = "scale(1)";
        });
      }

      // Animate checkmarks on scroll
      const checkmarks = card.querySelectorAll(".material-symbols-outlined");
      checkmarks.forEach((check, index) => {
        RAMSoftware.Utils.observeElements(check, (el) => {
          el.style.opacity = "0";
          el.style.transform = "scale(0)";
          el.style.transition = "opacity 0.3s ease, transform 0.3s ease";

          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "scale(1)";
          }, index * 100);
        });
      });
    });
  },

  /**
   * Initialize tech stack hover effects
   */
  initTechStackHover() {
    const techItems = document.querySelectorAll(".grid.grid-cols-2 > div");

    techItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        item.style.transform = "translateY(-4px)";
        item.style.boxShadow = "0 10px 25px -5px rgba(60, 131, 246, 0.15)";
        item.style.transition = "all 0.3s ease";
      });

      item.addEventListener("mouseleave", () => {
        item.style.transform = "translateY(0)";
        item.style.boxShadow = "";
      });
    });

    // Stagger animation on scroll
    techItems.forEach((item, index) => {
      RAMSoftware.Utils.observeElements(item, (el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";

        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, index * 50);
      });
    });
  },

  /**
   * Initialize process section animation
   */
  initProcessAnimation() {
    const processCards = document.querySelectorAll(".relative.p-8");

    processCards.forEach((card, index) => {
      RAMSoftware.Utils.observeElements(card, (el) => {
        // Animate the number badge
        const badge = el.querySelector(".absolute");
        if (badge) {
          badge.style.transform = "scale(0) rotate(-180deg)";
          badge.style.transition =
            "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";

          setTimeout(() => {
            badge.style.transform = "scale(1) rotate(0deg)";
          }, 200);
        }

        // Animate card content
        const content = el.querySelectorAll("h4, p");
        content.forEach((contentEl, contentIndex) => {
          contentEl.style.opacity = "0";
          contentEl.style.transform = "translateY(10px)";
          contentEl.style.transition = "opacity 0.4s ease, transform 0.4s ease";

          setTimeout(
            () => {
              contentEl.style.opacity = "1";
              contentEl.style.transform = "translateY(0)";
            },
            300 + contentIndex * 100,
          );
        });
      });
    });

    // Connect process cards with animated line
    this.drawProcessLine();
  },

  /**
   * Draw animated connection line between process cards
   */
  drawProcessLine() {
    const cards = document.querySelectorAll(".relative.p-8");
    if (cards.length < 2 || window.innerWidth < 768) return;

    // Add connecting line effect using pseudo-elements via CSS
    cards.forEach((card, index) => {
      if (index < cards.length - 1) {
        const line = document.createElement("div");
        line.className =
          "hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30";
        line.style.transform = "translateY(-50%)";
        card.style.position = "relative";
        card.appendChild(line);
      }
    });
  },
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  ServicesPage.init();
});
