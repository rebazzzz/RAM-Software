// ============================================
// RAM Software - Case Study Page JavaScript
// ============================================

/**
 * Case Study Page Animations and Interactions
 */
const CaseStudyPage = {
  init() {
    this.initScrollAnimations();
    this.initTimelineAnimation();
    this.initStatsCounter();
    this.initImageZoom();
  },

  /**
   * Initialize scroll-triggered animations
   */
  initScrollAnimations() {
    // Animate sections on scroll
    const sections = document.querySelectorAll("section");
    sections.forEach((section, index) => {
      RAMSoftware.Utils.observeElements(section, (el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";

        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, index * 100);
      });
    });

    // Animate project overview cards with stagger
    const overviewCards = document.querySelectorAll(".grid > div");
    overviewCards.forEach((card, index) => {
      RAMSoftware.Utils.observeElements(card, (el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";

        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, index * 150);
      });
    });
  },

  /**
   * Initialize timeline animation
   */
  initTimelineAnimation() {
    const timelineItems = document.querySelectorAll(".timeline-number");

    timelineItems.forEach((item, index) => {
      RAMSoftware.Utils.observeElements(item, (el) => {
        el.style.opacity = "0";
        el.style.transform = "scale(0.8)";
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";

        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "scale(1)";
        }, index * 200);
      });
    });

    // Animate timeline content
    const timelineContent = document.querySelectorAll(".timeline-number + div");
    timelineContent.forEach((content, index) => {
      RAMSoftware.Utils.observeElements(content, (el) => {
        el.style.opacity = "0";
        el.style.transform = "translateX(20px)";
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease";

        setTimeout(
          () => {
            el.style.opacity = "1";
            el.style.transform = "translateX(0)";
          },
          200 + index * 200,
        );
      });
    });
  },

  /**
   * Initialize stats counter animation
   */
  initStatsCounter() {
    const stats = document.querySelectorAll(".card-dark .text-4xl");

    stats.forEach((stat) => {
      RAMSoftware.Utils.observeElements(stat, (el) => {
        const text = el.textContent;
        const isPercentage = text.includes("%");
        const hasNumber = /\d/.test(text);

        if (hasNumber) {
          const numericValue = parseFloat(text.replace(/[^0-9.]/g, ""));
          if (!isNaN(numericValue)) {
            this.animateStat(el, numericValue, isPercentage, text);
          }
        }
      });
    });
  },

  /**
   * Animate a stat counter
   */
  animateStat(element, target, isPercentage, originalText) {
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

      let displayValue = current.toFixed(target < 10 ? 1 : 0);
      if (isPercentage) displayValue += "%";

      // Preserve any prefix/suffix from original
      if (originalText.includes("<")) displayValue = "<" + displayValue;
      if (originalText.toLowerCase().includes("real-time"))
        displayValue = "Real-time";

      element.textContent = displayValue;
    }, stepDuration);
  },

  /**
   * Initialize image zoom on click
   */
  initImageZoom() {
    const images = document.querySelectorAll(
      'img[alt*="Dashboard"], img[alt*="analytics"]',
    );

    images.forEach((img) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => {
        this.openLightbox(img.src, img.alt);
      });
    });
  },

  /**
   * Open lightbox for image zoom
   */
  openLightbox(src, alt) {
    // Remove existing lightbox if any
    const existing = document.getElementById("lightbox");
    if (existing) existing.remove();

    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.className =
      "fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out animate-fade-in";
    lightbox.innerHTML = `
      <img src="${src}" alt="${alt}" class="max-w-full max-h-full rounded-lg shadow-2xl">
      <button class="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors">
        <span class="material-symbols-outlined text-3xl">close</span>
      </button>
    `;

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.closest("button")) {
        lightbox.classList.add("opacity-0");
        setTimeout(() => lightbox.remove(), 300);
      }
    });

    document.body.appendChild(lightbox);
    document.body.style.overflow = "hidden";

    // Close on escape key
    const closeOnEscape = (e) => {
      if (e.key === "Escape") {
        lightbox.classList.add("opacity-0");
        setTimeout(() => {
          lightbox.remove();
          document.body.style.overflow = "";
        }, 300);
        document.removeEventListener("keydown", closeOnEscape);
      }
    };
    document.addEventListener("keydown", closeOnEscape);
  },
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  CaseStudyPage.init();
});
