/**
 * StudySpark Main Application Controller
 * Manages view routing, global state updates, theme coordination,
 * and component lifecycles.
 */

import { Navigation } from './components/Navigation.js';
import { renderDashboard, attachDashboardEvents } from './components/Dashboard.js';
import { QuizView } from './components/QuizView.js';
import { RevisionView } from './components/RevisionView.js';
import { SearchView } from './components/SearchView.js';
import { SettingsView } from './components/SettingsView.js';
import { StorageService } from './services/storage.js';
import { createRevisionQuizSession } from './services/quizEngine.js';

class App {
  constructor() {
    this.activeTab = 'dashboard';
    this.quizView = new QuizView(
      null, 
      (result) => this.handleQuizComplete(result),
      (tab) => this.navigateTo(tab)
    );
    this.revisionView = new RevisionView(
      (bank) => this.handleStartRevisionDrill(bank),
      (tab) => this.navigateTo(tab)
    );
    this.searchView = new SearchView((subjectId) => {
      this.quizView.startSession(subjectId);
      this.navigateTo('quiz');
    });
    this.settingsView = new SettingsView(
      (theme) => this.applyTheme(theme),
      () => this.handleDataReset()
    );

    this.navigation = new Navigation(
      this.activeTab,
      (tab) => this.navigateTo(tab),
      () => this.toggleTheme()
    );

    this.init();
  }

  init() {
    // Apply saved theme preference
    const prefs = StorageService.getPreferences();
    this.applyTheme(prefs.theme || 'light');

    // Setup global keyboard shortcut listeners
    this.setupKeyboardShortcuts();

    // Render initial app shell
    this.render();
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    StorageService.savePreferences({ theme: nextTheme });
    this.applyTheme(nextTheme);
    this.render();
  }

  navigateTo(tab) {
    this.activeTab = tab;
    this.navigation.setActiveTab(tab);
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  handleStartQuiz(subjectId) {
    this.quizView.startSession(subjectId);
    this.navigateTo('quiz');
  }

  handleStartRevisionDrill(revisionBank) {
    const drillSession = createRevisionQuizSession(revisionBank);
    this.quizView.session = drillSession;
    this.quizView.showUnansweredModal = false;
    this.quizView.reviewFilterMode = 'all';
    this.navigateTo('quiz');
  }

  handleQuizComplete(result) {
    // Refresh stats and badge counters
    this.navigation.update();
  }

  handleDataReset() {
    // Reset view states and refresh
    this.quizView = new QuizView(
      null, 
      (result) => this.handleQuizComplete(result),
      (tab) => this.navigateTo(tab)
    );
    this.navigateTo('dashboard');
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Allow number keys 1, 2, 3, 4 to select options during active quiz
      if (this.activeTab === 'quiz' && this.quizView.session && !this.quizView.session.isSubmitted) {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const optIdx = parseInt(e.key, 10) - 1;
          const currentQ = this.quizView.session.getCurrentQuestion();
          if (currentQ && currentQ.options[optIdx] !== undefined) {
            this.quizView.session.selectAnswer(currentQ.id, optIdx);
            this.render();
          }
        }
      }
    });
  }

  render() {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    let contentHtml = '';

    switch (this.activeTab) {
      case 'dashboard':
        contentHtml = renderDashboard(
          (subjectId) => this.handleStartQuiz(subjectId),
          (tab) => this.navigateTo(tab)
        );
        break;

      case 'quiz':
        contentHtml = this.quizView.render();
        break;

      case 'revision':
        contentHtml = this.revisionView.render();
        break;

      case 'search':
        contentHtml = this.searchView.render();
        break;

      case 'settings':
        contentHtml = this.settingsView.render();
        break;

      default:
        contentHtml = renderDashboard(
          (subjectId) => this.handleStartQuiz(subjectId),
          (tab) => this.navigateTo(tab)
        );
    }

    appContainer.innerHTML = `
      ${this.navigation.renderSidebar()}
      <div class="main-wrapper">
        ${this.navigation.renderHeader()}
        <main class="page-container" id="page-content" role="main">
          ${contentHtml}
        </main>
      </div>
    `;

    // Attach event listeners for the active view
    this.navigation.attachEvents(appContainer);

    switch (this.activeTab) {
      case 'dashboard':
        attachDashboardEvents(
          appContainer, 
          (subjectId) => this.handleStartQuiz(subjectId),
          (tab) => this.navigateTo(tab)
        );
        break;

      case 'quiz':
        this.quizView.attachEvents(appContainer, () => this.render());
        break;

      case 'revision':
        this.revisionView.attachEvents(appContainer, () => this.render());
        break;

      case 'search':
        this.searchView.attachEvents(appContainer, () => this.render());
        break;

      case 'settings':
        this.settingsView.attachEvents(appContainer, () => this.render());
        break;
    }
  }
}

// Bootstrap application once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.studySparkApp = new App();
});

