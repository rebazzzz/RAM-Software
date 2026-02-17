// ============================================
// RAM Software - Main JavaScript
// ============================================

/**
 * Component Loader - Injects shared header and footer into pages
 */
const ComponentLoader = {
  /**
   * Initialize the component loader
   */
  init() {
    this.loadHeader();
    this.loadFooter();
    this.initThemeToggle();
    this.initMobileMenu();
    this.initSmoothScroll();
    this.highlightCurrentNav();
  },

  /**
   * Load the shared header component
   */
  loadHeader() {
    const headerContainer = document.getElementById("header-container");
    if (!headerContainer) return;

    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";

    headerContainer.innerHTML = `
      <header class="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#101722]/80 backdrop-blur-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="index.html" class="logo">
            <div class="logo-icon">
              <span class="material-symbols-outlined text-xl">terminal</span>
            </div>
            <span class="logo-text">RAM Software</span>
          </a>
          
          <nav class="hidden md:flex items-center gap-8 text-sm font-medium nav-desktop">
            <a href="services.html" class="nav-link ${currentPage === "services.html" ? "text-primary" : ""}">Services</a>
            <a href="work.html" class="nav-link ${currentPage === "work.html" ? "text-primary" : ""}">Case Studies</a>
            <a href="index.html#vision" class="nav-link ${currentPage === "index.html" ? "text-primary" : ""}">About</a>
            <a href="book-call.html" class="nav-link ${currentPage === "book-call.html" ? "text-primary" : ""}">Contact</a>
            <a href="book-call.html" class="btn btn-primary">Book a Call</a>
          </nav>
          
          <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle menu">
            <span class="material-symbols-outlined">menu</span>
          </button>
        </div>
        
        <!-- Mobile Menu -->
        <div id="mobile-menu" class="hidden md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#101722]">
          <div class="px-6 py-4 space-y-4">
            <a href="services.html" class="block nav-link ${currentPage === "services.html" ? "text-primary" : ""}">Services</a>
            <a href="work.html" class="block nav-link ${currentPage === "work.html" ? "text-primary" : ""}">Case Studies</a>
            <a href="index.html#vision" class="block nav-link ${currentPage === "index.html" ? "text-primary" : ""}">About</a>
            <a href="index.html#contact" class="block nav-link">Contact</a>
            <a href="book-call.html" class="btn btn-primary w-full">Book a Call</a>
          </div>
        </div>
      </header>
    `;
  },

  /**
   * Load the shared footer component
   */
  loadFooter() {
    const footerContainer = document.getElementById("footer-container");
    if (!footerContainer) return;

    footerContainer.innerHTML = `
      <footer class="bg-white border-t border-gray-100 pt-24 pb-12 px-6">
        <div class="max-w-7xl mx-auto">
          <div class="grid md:grid-cols-4 gap-16 mb-20">
            <div class="col-span-2 space-y-6">
              <div class="flex items-center gap-2">
                <div class="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                  <span class="material-symbols-outlined text-xl">terminal</span>
                </div>
                <span class="text-xl font-extrabold tracking-tight text-charcoal">RAM Software</span>
              </div>
              <p class="text-slate-500 max-w-sm leading-relaxed">
                Building the next generation of scalable digital systems. From Stockholm to the world.
              </p>
              <div class="flex gap-4">
                <a href="#" class="social-link" aria-label="Twitter">
                  <svg class="size-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="#" class="social-link" aria-label="LinkedIn">
                  <svg class="size-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div class="space-y-6">
              <h4 class="font-bold text-charcoal">Company</h4>
              <ul class="space-y-4 text-slate-500 text-sm">
                <li><a href="index.html#vision" class="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="services.html" class="hover:text-primary transition-colors">Services</a></li>
                <li><a href="work.html" class="hover:text-primary transition-colors">Work</a></li>
                <li><a href="index.html#vision" class="hover:text-primary transition-colors">Vision</a></li>
              </ul>
            </div>


            <div class="space-y-6">
              <h4 class="font-bold text-charcoal">Services</h4>
              <ul class="space-y-4 text-slate-500 text-sm">
                <li><a href="services.html" class="hover:text-primary transition-colors">Web Development</a></li>
                <li><a href="services.html" class="hover:text-primary transition-colors">AI Systems</a></li>
                <li><a href="services.html" class="hover:text-primary transition-colors">Mobile Engineering</a></li>
                <li><a href="services.html" class="hover:text-primary transition-colors">Cloud Infra</a></li>
              </ul>
            </div>
          </div>
          <div class="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between gap-6">
            <p class="text-slate-400 text-xs font-medium uppercase tracking-widest">© ${new Date().getFullYear()} RAM SOFTWARE AB. ALL RIGHTS RESERVED.</p>
            <div class="flex gap-8 text-xs font-bold text-slate-400">
              <a href="#" class="hover:text-charcoal uppercase tracking-widest transition-colors">Privacy Policy</a>
              <a href="#" class="hover:text-charcoal uppercase tracking-widest transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  },

  /**
   * Initialize theme toggle (dark/light mode)
   */
  initThemeToggle() {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.toggle("dark", savedTheme === "dark");

    // Add theme toggle button to header if needed
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const isDark = document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
      });
    }
  },

  /**
   * Initialize mobile menu toggle
   */
  initMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
        const icon = mobileMenuBtn.querySelector(".material-symbols-outlined");
        icon.textContent = mobileMenu.classList.contains("hidden")
          ? "menu"
          : "close";
      });

      // Close menu when clicking on a link
      mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          mobileMenu.classList.add("hidden");
          mobileMenuBtn.querySelector(
            ".material-symbols-outlined",
          ).textContent = "menu";
        });
      });
    }
  },

  /**
   * Initialize smooth scroll for anchor links
   */
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#") return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  },

  /**
   * Highlight current navigation item based on URL
   * Note: Primary highlighting is done in loadHeader() with conditional classes
   * This function is kept for any additional highlighting needs
   */
  highlightCurrentNav() {
    // Primary highlighting is done in loadHeader() with conditional classes
    // This function is kept for backward compatibility
  },
};

/**
 * Utility Functions
 */
const Utils = {
  /**
   * Debounce function to limit how often a function can fire
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function to limit execution rate
   */
  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Intersection Observer helper for animations
   */
  observeElements(selector, callback, options = {}) {
    const defaultOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { ...defaultOptions, ...options },
    );

    document.querySelectorAll(selector).forEach((el) => observer.observe(el));
  },

  /**
   * Format date for display
   */
  formatDate(date, options = {}) {
    const defaultOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", {
      ...defaultOptions,
      ...options,
    }).format(date);
  },

  /**
   * Validate email format
   */
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  /**
   * Show toast notification
   */
  showToast(message, type = "info", duration = 3000) {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-y-20 opacity-0 ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
          ? "bg-red-500 text-white"
          : "bg-primary text-white"
    }`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-20", "opacity-0");
    });

    // Remove after duration
    setTimeout(() => {
      toast.classList.add("translate-y-20", "opacity-0");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },
};

/**
 * Form Handler
 */
const FormHandler = {
  /**
   * Initialize form validation and submission
   */
  init(formSelector, options = {}) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!this.validateForm(form)) return;

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn?.textContent || "Submit";

      // Show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML =
          '<span class="animate-spin inline-block mr-2">⟳</span> Processing...';
      }

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        Utils.showToast(
          options.successMessage || "Form submitted successfully!",
          "success",
        );
        form.reset();

        if (options.onSuccess) {
          options.onSuccess();
        }
      } catch (error) {
        Utils.showToast(
          options.errorMessage || "Something went wrong. Please try again.",
          "error",
        );
        console.error("Form submission error:", error);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  },

  /**
   * Validate form fields
   */
  validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll("[required]");

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add("border-red-500");

        // Remove error state on input
        field.addEventListener(
          "input",
          () => {
            field.classList.remove("border-red-500");
          },
          { once: true },
        );
      }

      // Email validation
      if (
        field.type === "email" &&
        field.value &&
        !Utils.isValidEmail(field.value)
      ) {
        isValid = false;
        field.classList.add("border-red-500");
        Utils.showToast("Please enter a valid email address", "error");
      }
    });

    return isValid;
  },
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  ComponentLoader.init();
});

// Export for use in other modules
window.RAMSoftware = {
  ComponentLoader,
  Utils,
  FormHandler,
};
