/**
 * StudySpark Navigation Component
 * Desktop sidebar and responsive top navigation header with mobile drawer.
 */

import { getIcon } from './Icons.js';
import { StorageService } from '../services/storage.js';

export class Navigation {
  constructor(activeTab, onTabChange, onThemeToggle) {
    this.activeTab = activeTab;
    this.onTabChange = onTabChange;
    this.onThemeToggle = onThemeToggle;
    this.isMobileOpen = false;
  }

  setActiveTab(newTab) {
    this.activeTab = newTab;
    this.isMobileOpen = false;
    this.update();
  }

  renderSidebar() {
    const streak = StorageService.getStreak();
    const revisionCount = StorageService.getRevisionBank().length;

    const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'quiz', label: 'Practise Quizzes', icon: 'quiz' },
      { id: 'revision', label: 'Revision Bank', icon: 'revision', badge: revisionCount > 0 ? revisionCount : null },
      { id: 'search', label: 'Discover Topics', icon: 'search' },
      { id: 'settings', label: 'Settings', icon: 'settings' }
    ];

    return `
      <aside class="sidebar ${this.isMobileOpen ? 'open' : ''}" id="app-sidebar" aria-label="Main Navigation">
        <div class="sidebar-header">
          <a href="#dashboard" class="brand" data-nav="dashboard">
            <div class="brand-icon">
              ${getIcon('spark', 18)}
            </div>
            <span class="brand-name">StudySpark</span>
            <span class="brand-badge">College</span>
          </a>
        </div>

        <nav class="sidebar-nav">
          ${navItems.map(item => `
            <button 
              type="button"
              class="nav-item ${this.activeTab === item.id ? 'active' : ''}" 
              data-nav="${item.id}"
              aria-current="${this.activeTab === item.id ? 'page' : 'false'}"
            >
              <span class="nav-icon">${getIcon(item.icon, 18)}</span>
              <span>${item.label}</span>
              ${item.badge ? `<span class="nav-badge" title="${item.badge} topics to review">${item.badge}</span>` : ''}
            </button>
          `).join('')}
        </nav>

        <div class="sidebar-footer">
          <div class="streak-card">
            <div class="streak-icon">
              ${getIcon('flame', 18)}
            </div>
            <div class="streak-info">
              <h4>${streak.currentStreak} Day${streak.currentStreak === 1 ? '' : 's'} Streak</h4>
              <p>${streak.currentStreak > 0 ? 'Consistency leads to A+' : 'Complete a quiz today!'}</p>
            </div>
          </div>
        </div>
      </aside>
    `;
  }

  renderHeader() {
    const titles = {
      dashboard: 'Dashboard',
      quiz: 'Subject Practice Quizzes',
      revision: 'Knowledge Gaps & Revision Bank',
      search: 'Search & Topic Discovery',
      settings: 'Settings & Storage Management'
    };

    const currentTitle = titles[this.activeTab] || 'StudySpark';
    const currentTheme = StorageService.getPreferences().theme || 'light';

    return `
      <header class="top-header">
        <div class="header-left">
          <button 
            type="button" 
            class="mobile-menu-btn" 
            id="mobile-toggle-btn"
            aria-label="Toggle navigation menu"
            aria-expanded="${this.isMobileOpen}"
          >
            ${getIcon('menu', 20)}
          </button>
          <div class="page-title-group">
            <h1>${currentTitle}</h1>
          </div>
        </div>

        <div class="header-right">
          <button 
            type="button" 
            class="theme-btn" 
            id="theme-toggle-btn" 
            title="Toggle Light/Dark Theme"
            aria-label="Toggle theme current: ${currentTheme}"
          >
            ${getIcon(currentTheme === 'dark' ? 'sun' : 'moon', 18)}
          </button>
        </div>
      </header>
    `;
  }

  attachEvents(container) {
    // Navigation items click handling
    container.querySelectorAll('[data-nav]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = btn.getAttribute('data-nav');
        if (targetTab && targetTab !== this.activeTab) {
          this.onTabChange(targetTab);
        }
      });
    });

    // Mobile menu toggle
    const toggleBtn = container.querySelector('#mobile-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.isMobileOpen = !this.isMobileOpen;
        const sidebar = container.querySelector('#app-sidebar');
        if (sidebar) {
          sidebar.classList.toggle('open', this.isMobileOpen);
        }
      });
    }

    // Theme toggle
    const themeBtn = container.querySelector('#theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        this.onThemeToggle();
      });
    }

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
      if (this.isMobileOpen && !e.target.closest('#app-sidebar') && !e.target.closest('#mobile-toggle-btn')) {
        this.isMobileOpen = false;
        const sidebar = document.querySelector('#app-sidebar');
        if (sidebar) sidebar.classList.remove('open');
      }
    });
  }

  update() {
    // Re-render handled by main App
  }
}

