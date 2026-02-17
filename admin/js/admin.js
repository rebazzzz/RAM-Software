// ============================================
// RAM Software - Admin Panel JavaScript
// ============================================

/**
 * Admin Panel Controller
 */
const AdminPanel = {
  /**
   * Initialize the admin panel
   */
  init() {
    this.initSidebar();
    this.initMobileMenu();
    this.initFormHandlers();
    this.initDataTables();
    this.initCharts();
  },

  /**
   * Initialize sidebar functionality
   */
  initSidebar() {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("sidebar-toggle");

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        this.createOverlay();
      });
    }
  },

  /**
   * Create mobile overlay
   */
  createOverlay() {
    let overlay = document.querySelector(".sidebar-overlay");

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "sidebar-overlay";
      document.body.appendChild(overlay);

      overlay.addEventListener("click", () => {
        document.getElementById("sidebar").classList.remove("open");
        overlay.classList.remove("open");
      });
    }

    overlay.classList.toggle("open");
  },

  /**
   * Initialize mobile menu
   */
  initMobileMenu() {
    // Mobile-specific initialization
    if (window.innerWidth < 1024) {
      const sidebar = document.getElementById("sidebar");
      if (sidebar) {
        sidebar.classList.remove("open");
      }
    }
  },

  /**
   * Initialize form handlers
   */
  initFormHandlers() {
    // Auto-save indicator
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      const inputs = form.querySelectorAll("input, textarea, select");
      inputs.forEach((input) => {
        input.addEventListener("change", () => {
          this.showAutoSaveIndicator();
        });
      });
    });

    // Save buttons
    const saveButtons = document.querySelectorAll("button");
    saveButtons.forEach((btn) => {
      if (btn.textContent.includes("Save")) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.showToast("Changes saved successfully!", "success");
        });
      }
    });
  },

  /**
   * Initialize data tables
   */
  initDataTables() {
    // Search functionality
    const searchInputs = document.querySelectorAll('input[type="text"]');
    searchInputs.forEach((input) => {
      if (input.placeholder && input.placeholder.includes("Search")) {
        input.addEventListener("input", (e) => {
          this.filterTable(e.target.value);
        });
      }
    });

    // Status filter
    const statusSelects = document.querySelectorAll("select");
    statusSelects.forEach((select) => {
      select.addEventListener("change", (e) => {
        this.filterByStatus(e.target.value);
      });
    });
  },

  /**
   * Filter table rows
   */
  filterTable(searchTerm) {
    const rows = document.querySelectorAll("tbody tr");
    const term = searchTerm.toLowerCase();

    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(term) ? "" : "none";
    });
  },

  /**
   * Filter by status
   */
  filterByStatus(status) {
    if (!status) {
      // Show all
      const rows = document.querySelectorAll("tbody tr");
      rows.forEach((row) => (row.style.display = ""));
      return;
    }

    const rows = document.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      const statusCell = row.querySelector("td:nth-child(5)");
      if (statusCell) {
        const rowStatus = statusCell.textContent.toLowerCase();
        row.style.display = rowStatus.includes(status.toLowerCase())
          ? ""
          : "none";
      }
    });
  },

  /**
   * Initialize charts (placeholder for future chart integration)
   */
  initCharts() {
    // Chart initialization can be added here
    // Example: Using Chart.js or similar library
    console.log("Charts ready for initialization");
  },

  /**
   * Show auto-save indicator
   */
  showAutoSaveIndicator() {
    let indicator = document.getElementById("auto-save-indicator");

    if (!indicator) {
      indicator = document.createElement("div");
      indicator.id = "auto-save-indicator";
      indicator.className =
        "fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium opacity-0 transition-opacity duration-300 pointer-events-none z-50";
      indicator.innerHTML = `
        <span class="flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">check_circle</span>
          Draft saved
        </span>
      `;
      document.body.appendChild(indicator);
    }

    indicator.classList.remove("opacity-0");
    setTimeout(() => {
      indicator.classList.add("opacity-0");
    }, 2000);
  },

  /**
   * Show toast notification
   */
  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-y-20 opacity-0 ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
          ? "bg-red-500 text-white"
          : "bg-primary text-white"
    }`;
    toast.innerHTML = `
      <span class="flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">${type === "success" ? "check_circle" : type === "error" ? "error" : "info"}</span>
        ${message}
      </span>
    `;

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-20", "opacity-0");
    });

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.add("translate-y-20", "opacity-0");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  },

  /**
   * Export data to CSV
   */
  exportToCSV(data, filename) {
    const csvContent = this.convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Convert data to CSV format
   */
  convertToCSV(data) {
    if (!data || !data.length) return "";

    const headers = Object.keys(data[0]);
    const rows = data.map((obj) =>
      headers.map((header) => {
        const value = obj[header];
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(",") ? `"${escaped}"` : escaped;
      }),
    );

    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  },

  /**
   * Format date for display
   */
  formatDate(date, options = {}) {
    const defaultOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", {
      ...defaultOptions,
      ...options,
    }).format(new Date(date));
  },

  /**
   * Format currency
   */
  formatCurrency(amount, currency = "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  },

  /**
   * Debounce function
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
   * Confirm action
   */
  confirmAction(message, callback) {
    if (confirm(message)) {
      callback();
    }
  },

  /**
   * Handle API requests (placeholder for backend integration)
   */
  async apiRequest(endpoint, options = {}) {
    // This is a placeholder for when you connect your backend
    // Replace this with actual API calls to your backend

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      // Simulated API call
      console.log(`API Request to: ${endpoint}`, options);

      // Return mock data for now
      return {
        success: true,
        data: null,
        message: "API endpoint ready for backend integration",
      };

      // Actual implementation will be:
      // const response = await fetch(`/api${endpoint}`, { ...defaultOptions, ...options });
      // return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Update booking status
   */
  async updateBookingStatus(bookingId, status) {
    const result = await this.apiRequest(`/bookings/${bookingId}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });

    if (result.success) {
      this.showToast(`Booking marked as ${status}`, "success");
    } else {
      this.showToast("Failed to update booking", "error");
    }
  },

  /**
   * Delete booking
   */
  async deleteBooking(bookingId) {
    this.confirmAction(
      "Are you sure you want to delete this booking?",
      async () => {
        const result = await this.apiRequest(`/bookings/${bookingId}`, {
          method: "DELETE",
        });

        if (result.success) {
          this.showToast("Booking deleted successfully", "success");
          // Remove row from table
          const row = document.querySelector(
            `[data-booking-id="${bookingId}"]`,
          );
          if (row) row.remove();
        } else {
          this.showToast("Failed to delete booking", "error");
        }
      },
    );
  },

  /**
   * Save content changes
   */
  async saveContent(section, data) {
    const result = await this.apiRequest(`/content/${section}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (result.success) {
      this.showToast("Content saved successfully", "success");
    } else {
      this.showToast("Failed to save content", "error");
    }
  },

  /**
   * Upload media file
   */
  async uploadMedia(file) {
    const formData = new FormData();
    formData.append("file", file);

    const result = await this.apiRequest("/media", {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    });

    if (result.success) {
      this.showToast("File uploaded successfully", "success");
    } else {
      this.showToast("Failed to upload file", "error");
    }
  },

  /**
   * Update user role
   */
  async updateUserRole(userId, role) {
    const result = await this.apiRequest(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    });

    if (result.success) {
      this.showToast("User role updated", "success");
    } else {
      this.showToast("Failed to update user", "error");
    }
  },
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  AdminPanel.init();
});

// Export for use in other modules
window.AdminPanel = AdminPanel;
