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
    const isUsersPage = Boolean(document.getElementById("users-page"));

    // Search functionality
    let searchInputs = document.querySelectorAll("[data-table-search]");
    if (!searchInputs.length && !isUsersPage) {
      searchInputs = document.querySelectorAll('input[type="text"]');
    }
    searchInputs.forEach((input) => {
      if (input.placeholder && input.placeholder.includes("Search")) {
        input.addEventListener("input", (e) => {
          this.filterTable(e.target.value);
        });
      }
    });

    // Status filter
    let statusSelects = document.querySelectorAll("[data-status-filter]");
    if (!statusSelects.length && !isUsersPage) {
      statusSelects = document.querySelectorAll("select");
    }
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

/**
 * Team members page controller
 */
const TeamMembersPage = {
  roles: {
    "Super Admin": {
      slug: "super-admin",
      description:
        "Owns platform-wide security, billing, and all admin capabilities.",
      permissions: {
        dashboard: "Full",
        bookings: "Full",
        caseStudies: "Full",
        content: "Full",
        media: "Full",
        users: "Full",
        settings: "Full",
      },
    },
    Admin: {
      slug: "admin",
      description:
        "Manages operations, approvals, and team access without owner-only controls.",
      permissions: {
        dashboard: "Full",
        bookings: "Full",
        caseStudies: "Full",
        content: "Full",
        media: "Full",
        users: "Write",
        settings: "Write",
      },
    },
    Manager: {
      slug: "manager",
      description:
        "Runs project workflow, staffing, and publishing approvals for departments.",
      permissions: {
        dashboard: "Full",
        bookings: "Write",
        caseStudies: "Write",
        content: "Write",
        media: "Write",
        users: "Read",
        settings: "None",
      },
    },
    Editor: {
      slug: "editor",
      description:
        "Edits client-facing content and updates case studies and structured data.",
      permissions: {
        dashboard: "Read",
        bookings: "Read",
        caseStudies: "Write",
        content: "Write",
        media: "Write",
        users: "None",
        settings: "None",
      },
    },
    Developer: {
      slug: "developer",
      description:
        "Maintains technical assets, deployment media, and integration workflows.",
      permissions: {
        dashboard: "Read",
        bookings: "Read",
        caseStudies: "Read",
        content: "Write",
        media: "Write",
        users: "None",
        settings: "Read",
      },
    },
    Designer: {
      slug: "designer",
      description:
        "Creates visual assets and updates brand media with controlled publishing.",
      permissions: {
        dashboard: "Read",
        bookings: "None",
        caseStudies: "Write",
        content: "Write",
        media: "Write",
        users: "None",
        settings: "None",
      },
    },
    Viewer: {
      slug: "viewer",
      description:
        "Read-only access for stakeholders, clients, and auditing visibility.",
      permissions: {
        dashboard: "Read",
        bookings: "Read",
        caseStudies: "Read",
        content: "Read",
        media: "Read",
        users: "None",
        settings: "None",
      },
    },
  },

  members: [
    {
      id: 1,
      fullName: "Ava Daniels",
      email: "ava@ramsoftware.com",
      role: "Super Admin",
      status: "Active",
      department: "Leadership",
      title: "Head of Operations",
      phone: "+1 (555) 201-0191",
      joinDate: "2023-02-14",
      lastActive: "5m ago",
    },
    {
      id: 2,
      fullName: "Noah Carter",
      email: "noah@ramsoftware.com",
      role: "Admin",
      status: "Active",
      department: "Operations",
      title: "Admin Lead",
      phone: "+1 (555) 201-0192",
      joinDate: "2023-06-03",
      lastActive: "18m ago",
    },
    {
      id: 3,
      fullName: "Sarah Kim",
      email: "sarah@ramsoftware.com",
      role: "Manager",
      status: "Away",
      department: "Delivery",
      title: "Project Manager",
      phone: "+1 (555) 201-0193",
      joinDate: "2024-01-22",
      lastActive: "1h ago",
    },
    {
      id: 4,
      fullName: "John Patel",
      email: "john@ramsoftware.com",
      role: "Developer",
      status: "Active",
      department: "Engineering",
      title: "Full-Stack Developer",
      phone: "+1 (555) 201-0194",
      joinDate: "2024-03-11",
      lastActive: "12m ago",
    },
    {
      id: 5,
      fullName: "Mia Lopez",
      email: "mia@ramsoftware.com",
      role: "Designer",
      status: "Inactive",
      department: "Design",
      title: "Product Designer",
      phone: "+1 (555) 201-0195",
      joinDate: "2024-05-09",
      lastActive: "2d ago",
    },
    {
      id: 6,
      fullName: "Chris Allen",
      email: "chris@ramsoftware.com",
      role: "Editor",
      status: "Active",
      department: "Marketing",
      title: "Content Editor",
      phone: "+1 (555) 201-0196",
      joinDate: "2024-08-19",
      lastActive: "27m ago",
    },
    {
      id: 7,
      fullName: "Olivia Reed",
      email: "olivia@ramsoftware.com",
      role: "Viewer",
      status: "Active",
      department: "Client Success",
      title: "Account Observer",
      phone: "+1 (555) 201-0197",
      joinDate: "2025-01-07",
      lastActive: "3h ago",
    },
  ],

  activityLog: [
    "Role updated: Sarah Kim moved to Manager.",
    "Bulk action: 2 members set to Active.",
    "Mia Lopez set to Inactive after offboarding.",
    "Noah Carter updated settings permissions.",
  ],

  selectedMemberIds: new Set(),

  init() {
    this.root = document.getElementById("users-page");
    if (!this.root) return;

    this.cacheElements();
    this.populateRoleDropdowns();
    this.populateDepartmentFilter();
    this.renderPermissionMatrix();
    this.renderRoleGuide();
    this.bindEvents();
    this.render();
  },

  cacheElements() {
    this.memberTableBody = document.getElementById("member-table-body");
    this.memberStats = document.getElementById("member-stats");
    this.activityLogEl = document.getElementById("member-activity-log");
    this.permissionMatrixBody = document.getElementById("permission-matrix-body");
    this.roleGuideContent = document.getElementById("role-guide-content");

    this.searchInput = document.getElementById("search-members");
    this.roleFilter = document.getElementById("filter-role");
    this.departmentFilter = document.getElementById("filter-department");
    this.statusFilter = document.getElementById("filter-status");
    this.clearFiltersBtn = document.getElementById("clear-filters");
    this.bulkActions = document.getElementById("bulk-actions");
    this.selectedCount = document.getElementById("selected-count");
    this.selectAll = document.getElementById("select-all-members");
    this.bulkActionSelect = document.getElementById("bulk-action-select");
    this.applyBulkActionBtn = document.getElementById("apply-bulk-action");
    this.clearSelectionBtn = document.getElementById("clear-selection");

    this.addModal = document.getElementById("add-modal");
    this.editModal = document.getElementById("edit-modal");
    this.roleGuideModal = document.getElementById("role-guide-modal");

    this.addForm = document.getElementById("add-member-form");
    this.editForm = document.getElementById("edit-member-form");
  },

  bindEvents() {
    this.searchInput?.addEventListener("input", () => this.renderMembers());
    this.roleFilter?.addEventListener("change", () => this.renderMembers());
    this.departmentFilter?.addEventListener("change", () => this.renderMembers());
    this.statusFilter?.addEventListener("change", () => this.renderMembers());
    this.selectAll?.addEventListener("change", (event) =>
      this.toggleSelectAll(event.target.checked),
    );

    this.clearFiltersBtn?.addEventListener("click", () => this.clearFilters());
    document
      .getElementById("open-add-modal")
      ?.addEventListener("click", () => this.openAddModal());

    document
      .getElementById("open-role-guide")
      ?.addEventListener("click", () => this.openRoleGuide());
    document
      .getElementById("close-role-guide")
      ?.addEventListener("click", () => this.closeRoleGuide());
    document
      .getElementById("role-guide-backdrop")
      ?.addEventListener("click", () => this.closeRoleGuide());

    document.querySelectorAll("[data-close-modal='add']").forEach((btn) => {
      btn.addEventListener("click", () => this.closeAddModal());
    });
    document.querySelectorAll("[data-close-modal='edit']").forEach((btn) => {
      btn.addEventListener("click", () => this.closeEditModal());
    });

    this.addForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      this.createMember();
    });
    this.editForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      this.updateMember();
    });

    this.memberTableBody?.addEventListener("click", (event) => {
      const target = event.target.closest("[data-action]");
      if (!target) return;
      const action = target.getAttribute("data-action");
      const memberId = Number(target.getAttribute("data-member-id"));

      if (action === "edit") {
        this.openEditModal(memberId);
      }
      if (action === "delete") {
        this.deleteMember(memberId);
      }
      if (action === "toggle-select") {
        this.toggleMemberSelection(memberId, target.checked);
      }
    });

    this.applyBulkActionBtn?.addEventListener("click", () => {
      this.applyBulkAction(this.bulkActionSelect?.value || "set-active");
    });
    this.clearSelectionBtn?.addEventListener("click", () => {
      this.selectedMemberIds.clear();
      this.renderMembers();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.closeAddModal();
        this.closeEditModal();
        this.closeRoleGuide();
      }
    });
  },

  populateRoleDropdowns() {
    const roleOptions = Object.keys(this.roles)
      .map((role) => `<option value="${role}">${role}</option>`)
      .join("");

    document.querySelectorAll("[data-role-select]").forEach((select) => {
      select.innerHTML = roleOptions;
    });

    if (this.roleFilter) {
      this.roleFilter.innerHTML =
        `<option value="all">All Roles</option>${roleOptions}`;
    }
  },

  populateDepartmentFilter() {
    if (!this.departmentFilter) return;
    const departments = [...new Set(this.members.map((m) => m.department))].sort();
    this.departmentFilter.innerHTML =
      '<option value="all">All Departments</option>' +
      departments
        .map((dept) => `<option value="${dept}">${dept}</option>`)
        .join("");
  },

  render() {
    this.renderMembers();
    this.renderStats();
    this.renderActivityLog();
    this.renderBulkState();
    this.updateClearFiltersVisibility();
  },

  getFilteredMembers() {
    const search = this.searchInput?.value?.trim().toLowerCase() || "";
    const role = this.roleFilter?.value || "all";
    const department = this.departmentFilter?.value || "all";
    const status = this.statusFilter?.value || "all";

    return this.members.filter((member) => {
      const matchesSearch =
        !search ||
        member.fullName.toLowerCase().includes(search) ||
        member.email.toLowerCase().includes(search) ||
        member.title.toLowerCase().includes(search);
      const matchesRole = role === "all" || member.role === role;
      const matchesDepartment =
        department === "all" || member.department === department;
      const matchesStatus =
        status === "all" || member.status.toLowerCase() === status;

      return matchesSearch && matchesRole && matchesDepartment && matchesStatus;
    });
  },

  renderMembers() {
    if (!this.memberTableBody) return;
    const rows = this.getFilteredMembers();

    if (!rows.length) {
      this.memberTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="px-4 py-10 text-center text-gray-500">
            No members match the current filters.
          </td>
        </tr>
      `;
      this.renderBulkState();
      this.updateClearFiltersVisibility();
      return;
    }

    this.memberTableBody.innerHTML = rows
      .map((member) => {
        const initials = this.getInitials(member.fullName);
        const roleClass = this.getRoleBadgeClass(member.role);
        const permissionLevel = this.getPermissionLevel(member.role);
        const statusBadge = this.getStatusBadge(member.status);
        const isChecked = this.selectedMemberIds.has(member.id);
        return `
          <tr class="member-card">
            <td class="px-4 py-3">
              <input
                type="checkbox"
                class="size-4 rounded border-gray-300"
                data-action="toggle-select"
                data-member-id="${member.id}"
                ${isChecked ? "checked" : ""}
              >
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="size-10 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 text-white text-xs font-bold flex items-center justify-center">${initials}</div>
                <div>
                  <p class="font-semibold text-charcoal">${member.fullName}</p>
                  <p class="text-xs text-gray-500">${member.email}</p>
                  <p class="text-xs text-gray-400">${member.title}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <span class="role-chip ${roleClass}">${member.role}</span>
            </td>
            <td class="px-4 py-3">
              <p class="font-medium text-gray-700">${member.department}</p>
              <p class="text-xs text-gray-400">Joined ${member.joinDate}</p>
            </td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${permissionLevel.className} bg-gray-100">${permissionLevel.label}</span>
            </td>
            <td class="px-4 py-3">${statusBadge}</td>
            <td class="px-4 py-3 text-gray-600">${member.lastActive}</td>
            <td class="px-4 py-3 text-right">
              <div class="inline-flex items-center gap-1">
                <button class="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary" data-action="edit" data-member-id="${member.id}" aria-label="Edit member">
                  <span class="material-symbols-outlined text-[20px] pointer-events-none">edit</span>
                </button>
                <button class="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600" data-action="delete" data-member-id="${member.id}" aria-label="Delete member">
                  <span class="material-symbols-outlined text-[20px] pointer-events-none">delete</span>
                </button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");

    this.renderBulkState();
    this.updateClearFiltersVisibility();
  },

  renderStats() {
    if (!this.memberStats) return;
    const total = this.members.length;
    const active = this.members.filter((m) => m.status === "Active").length;
    const privileged = this.members.filter((m) =>
      ["Super Admin", "Admin", "Manager"].includes(m.role),
    ).length;
    const departments = new Set(this.members.map((m) => m.department)).size;

    const cards = [
      { label: "Total Members", value: total, sub: "All team accounts" },
      { label: "Active Now", value: active, sub: "Online or recently active" },
      {
        label: "Privileged Roles",
        value: privileged,
        sub: "Super Admin, Admin, Manager",
      },
      { label: "Departments", value: departments, sub: "Operational teams" },
    ];

    this.memberStats.innerHTML = cards
      .map(
        (card) => `
          <div class="bg-white rounded-xl border border-gray-200 p-4">
            <p class="text-sm text-gray-500">${card.label}</p>
            <p class="text-2xl font-black text-charcoal">${card.value}</p>
            <p class="text-xs text-gray-400">${card.sub}</p>
          </div>
        `,
      )
      .join("");
  },

  renderPermissionMatrix() {
    if (!this.permissionMatrixBody) return;
    const accessKeys = [
      "dashboard",
      "bookings",
      "caseStudies",
      "content",
      "media",
      "users",
      "settings",
    ];

    this.permissionMatrixBody.innerHTML = Object.entries(this.roles)
      .map(([role, meta]) => {
        const cells = accessKeys
          .map((key) => {
            const level = meta.permissions[key];
            const className = this.getPermissionLevelClass(level);
            return `<td class="px-4 py-3"><span class="text-xs font-semibold ${className}">${level}</span></td>`;
          })
          .join("");
        return `
          <tr>
            <td class="px-4 py-3">
              <span class="role-chip ${this.getRoleBadgeClass(role)}">${role}</span>
            </td>
            ${cells}
          </tr>
        `;
      })
      .join("");
  },

  renderRoleGuide() {
    if (!this.roleGuideContent) return;
    this.roleGuideContent.innerHTML = Object.entries(this.roles)
      .map(
        ([role, meta]) => `
          <div class="border border-gray-200 rounded-xl p-4">
            <div class="flex items-center justify-between gap-3">
              <span class="role-chip ${this.getRoleBadgeClass(role)}">${role}</span>
              <span class="text-xs text-gray-500">${this.getPermissionLevel(role).label}</span>
            </div>
            <p class="mt-2 text-sm text-gray-700">${meta.description}</p>
          </div>
        `,
      )
      .join("");
  },

  renderActivityLog() {
    if (!this.activityLogEl) return;
    this.activityLogEl.innerHTML = this.activityLog
      .slice(0, 12)
      .map(
        (entry) => `
          <div class="activity-item p-4">
            <p class="text-sm text-charcoal">${entry}</p>
          </div>
        `,
      )
      .join("");
  },

  renderBulkState() {
    const count = this.selectedMemberIds.size;
    if (!this.bulkActions || !this.selectedCount) return;
    const isVisible = count > 0;
    this.bulkActions.classList.toggle("hidden", !isVisible);
    this.bulkActions.setAttribute("aria-hidden", isVisible ? "false" : "true");
    this.selectedCount.textContent = `${count} selected`;
    if (this.selectAll) {
      const currentRows = this.getFilteredMembers();
      this.selectAll.checked =
        currentRows.length > 0 &&
        currentRows.every((member) => this.selectedMemberIds.has(member.id));
    }
  },

  clearFilters() {
    if (this.searchInput) this.searchInput.value = "";
    if (this.roleFilter) this.roleFilter.value = "all";
    if (this.departmentFilter) this.departmentFilter.value = "all";
    if (this.statusFilter) this.statusFilter.value = "all";
    this.renderMembers();
    this.updateClearFiltersVisibility();
  },

  updateClearFiltersVisibility() {
    if (!this.clearFiltersBtn) return;
    const hasSearch = Boolean(this.searchInput?.value?.trim());
    const hasRoleFilter = (this.roleFilter?.value || "all") !== "all";
    const hasDepartmentFilter =
      (this.departmentFilter?.value || "all") !== "all";
    const hasStatusFilter = (this.statusFilter?.value || "all") !== "all";
    const show = hasSearch || hasRoleFilter || hasDepartmentFilter || hasStatusFilter;
    this.clearFiltersBtn.classList.toggle("hidden", !show);
  },

  openAddModal() {
    this.addModal?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  },

  closeAddModal() {
    this.addModal?.classList.add("hidden");
    document.body.style.overflow = "";
    this.addForm?.reset();
  },

  openEditModal(memberId) {
    const member = this.members.find((item) => item.id === memberId);
    if (!member || !this.editForm) return;
    this.editForm.elements.id.value = String(member.id);
    this.editForm.elements.fullName.value = member.fullName;
    this.editForm.elements.email.value = member.email;
    this.editForm.elements.role.value = member.role;
    this.editForm.elements.status.value = member.status;
    this.editForm.elements.department.value = member.department;
    this.editForm.elements.title.value = member.title;
    this.editForm.elements.phone.value = member.phone;
    this.editForm.elements.joinDate.value = member.joinDate;

    this.editModal?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  },

  closeEditModal() {
    this.editModal?.classList.add("hidden");
    document.body.style.overflow = "";
  },

  createMember() {
    if (!this.addForm) return;
    const data = Object.fromEntries(new FormData(this.addForm));
    const member = {
      id: Date.now(),
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role,
      status: data.status,
      department: data.department.trim(),
      title: data.title.trim(),
      phone: data.phone.trim(),
      joinDate: data.joinDate,
      lastActive: "Just now",
    };

    this.members.unshift(member);
    this.activityLog.unshift(
      `Member created: ${member.fullName} (${member.role}, ${member.department}).`,
    );
    this.populateDepartmentFilter();
    this.closeAddModal();
    this.render();
    AdminPanel.showToast("Team member added successfully", "success");
  },

  updateMember() {
    if (!this.editForm) return;
    const data = Object.fromEntries(new FormData(this.editForm));
    const memberId = Number(data.id);
    const member = this.members.find((item) => item.id === memberId);
    if (!member) return;

    const previousRole = member.role;
    member.fullName = data.fullName.trim();
    member.email = data.email.trim().toLowerCase();
    member.role = data.role;
    member.status = data.status;
    member.department = data.department.trim();
    member.title = data.title.trim();
    member.phone = data.phone.trim();
    member.joinDate = data.joinDate;
    member.lastActive = "Just now";

    this.activityLog.unshift(
      `Member updated: ${member.fullName} (${previousRole} -> ${member.role}).`,
    );
    this.populateDepartmentFilter();
    this.closeEditModal();
    this.render();
    AdminPanel.showToast("Member profile updated", "success");
  },

  deleteMember(memberId) {
    const member = this.members.find((item) => item.id === memberId);
    if (!member) return;
    if (!confirm(`Delete ${member.fullName}?`)) return;

    this.members = this.members.filter((item) => item.id !== memberId);
    this.selectedMemberIds.delete(memberId);
    this.activityLog.unshift(`Member deleted: ${member.fullName}.`);
    this.populateDepartmentFilter();
    this.render();
    AdminPanel.showToast("Member removed", "success");
  },

  toggleMemberSelection(memberId, isSelected) {
    if (isSelected) this.selectedMemberIds.add(memberId);
    else this.selectedMemberIds.delete(memberId);
    this.renderBulkState();
  },

  toggleSelectAll(isSelected) {
    const filtered = this.getFilteredMembers();
    filtered.forEach((member) => {
      if (isSelected) this.selectedMemberIds.add(member.id);
      else this.selectedMemberIds.delete(member.id);
    });
    this.renderMembers();
  },

  applyBulkAction(action) {
    const ids = [...this.selectedMemberIds];
    if (!ids.length) return;

    if (action === "delete") {
      if (!confirm(`Delete ${ids.length} selected member(s)?`)) return;
      this.members = this.members.filter((member) => !this.selectedMemberIds.has(member.id));
      this.activityLog.unshift(`Bulk delete: ${ids.length} members removed.`);
    }

    if (action === "set-active") {
      this.members.forEach((member) => {
        if (this.selectedMemberIds.has(member.id)) member.status = "Active";
      });
      this.activityLog.unshift(`Bulk update: ${ids.length} members set to Active.`);
    }

    if (action === "set-inactive") {
      this.members.forEach((member) => {
        if (this.selectedMemberIds.has(member.id)) member.status = "Inactive";
      });
      this.activityLog.unshift(
        `Bulk update: ${ids.length} members set to Inactive.`,
      );
    }

    if (action === "set-viewer") {
      this.members.forEach((member) => {
        if (this.selectedMemberIds.has(member.id)) member.role = "Viewer";
      });
      this.activityLog.unshift(`Bulk update: ${ids.length} members set to Viewer.`);
    }

    this.selectedMemberIds.clear();
    this.populateDepartmentFilter();
    this.render();
    AdminPanel.showToast("Bulk action applied", "success");
  },

  openRoleGuide() {
    this.roleGuideModal?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  },

  closeRoleGuide() {
    this.roleGuideModal?.classList.add("hidden");
    document.body.style.overflow = "";
  },

  getInitials(fullName) {
    return fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  },

  getRoleBadgeClass(role) {
    const slug = this.roles[role]?.slug || "viewer";
    return `role-${slug}`;
  },

  getPermissionLevel(role) {
    const permissions = this.roles[role]?.permissions || {};
    const levels = Object.values(permissions);
    if (levels.includes("Full")) return { label: "Full Access", className: "text-green-700" };
    if (levels.includes("Write")) return { label: "Write Access", className: "text-blue-700" };
    if (levels.includes("Read")) return { label: "Read Access", className: "text-amber-700" };
    return { label: "No Access", className: "text-red-700" };
  },

  getPermissionLevelClass(level) {
    if (level === "Full") return "text-green-600";
    if (level === "Write") return "text-blue-600";
    if (level === "Read") return "text-amber-600";
    return "text-red-600";
  },

  getStatusBadge(status) {
    const color =
      status === "Active"
        ? "bg-green-100 text-green-700"
        : status === "Away"
          ? "bg-amber-100 text-amber-700"
          : "bg-gray-200 text-gray-700";
    return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${color}">${status}</span>`;
  },
};

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  AdminPanel.init();
  TeamMembersPage.init();
});

// Export for use in other modules
window.AdminPanel = AdminPanel;
window.TeamMembersPage = TeamMembersPage;
