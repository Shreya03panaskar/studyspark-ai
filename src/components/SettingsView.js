/**
 * StudySpark Settings & Usability View
 * Provides theme selection, local storage usage breakdown, privacy explanation,
 * daily study goal configuration, JSON export, and confirmed progress reset.
 */

import { StorageService } from '../services/storage.js';
import { getIcon } from './Icons.js';

export class SettingsView {
  constructor(onThemeChange = null, onReset = null) {
    this.onThemeChange = onThemeChange;
    this.onReset = onReset;
    this.showResetModal = false;
  }

  render() {
    const prefs = StorageService.getPreferences();
    const stats = StorageService.getComputedStats();
    const rawAttempts = StorageService.getAttempts();
    const rawGaps = StorageService.getRevisionBank();

    return `
      <div class="settings-page" style="max-width: 760px; margin: 0 auto;">
        <!-- Local Privacy Notice -->
        <div class="card" style="margin-bottom: 1.5rem; border-color: rgba(37, 99, 235, 0.2); background: var(--info-bg);">
          <div style="display: flex; gap: 1rem; align-items: flex-start;">
            <div style="color: var(--brand-blue); margin-top: 0.125rem;">
              ${getIcon('spark', 22)}
            </div>
            <div>
              <h3 style="font-size: 1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.25rem;">
                100% Local & Private
              </h3>
              <p style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.5;">
                StudySpark operates entirely inside this web browser using <code>localStorage</code>. 
                Your quiz attempts, learning streak, and knowledge gaps are never transmitted to external cloud databases or third-party trackers.
              </p>
            </div>
          </div>
        </div>

        <!-- Preferences Section -->
        <div class="card" style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.0625rem; font-weight: 700; margin-bottom: 1rem;">
            Display & Daily Target Preferences
          </h3>

          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <!-- Theme Selection -->
            <div>
              <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">
                Interface Theme
              </label>
              <div style="display: flex; gap: 0.75rem;">
                <button 
                  type="button" 
                  class="btn ${prefs.theme === 'light' ? 'btn-primary' : 'btn-secondary'}" 
                  data-set-theme="light"
                  style="flex: 1;"
                >
                  ${getIcon('sun', 16)} Light Mode
                </button>
                <button 
                  type="button" 
                  class="btn ${prefs.theme === 'dark' ? 'btn-primary' : 'btn-secondary'}" 
                  data-set-theme="dark"
                  style="flex: 1;"
                >
                  ${getIcon('moon', 16)} Dark Mode
                </button>
              </div>
            </div>

            <!-- Daily Target -->
            <div>
              <label for="daily-goal-select" style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">
                Daily Practice Target
              </label>
              <select id="daily-goal-select" class="search-input" style="padding-left: 1rem;">
                <option value="1" ${prefs.dailyGoal === 1 ? 'selected' : ''}>1 Quiz per day (Quick Review)</option>
                <option value="2" ${prefs.dailyGoal === 2 ? 'selected' : ''}>2 Quizzes per day (Recommended)</option>
                <option value="3" ${prefs.dailyGoal === 3 ? 'selected' : ''}>3 Quizzes per day (Exam Prep Sprint)</option>
                <option value="5" ${prefs.dailyGoal === 5 ? 'selected' : ''}>5 Quizzes per day (Intensive Cramming)</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Data & Storage Management -->
        <div class="card" style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.0625rem; font-weight: 700; margin-bottom: 0.75rem;">
            Storage & Progress Management
          </h3>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
            <div style="background-color: var(--bg-secondary); padding: 0.875rem; border-radius: var(--radius-md);">
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Saved Quiz Attempts</span>
              <strong style="font-size: 1.125rem;">${rawAttempts.length} Records</strong>
            </div>
            <div style="background-color: var(--bg-secondary); padding: 0.875rem; border-radius: var(--radius-md);">
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Knowledge Gaps Stored</span>
              <strong style="font-size: 1.125rem;">${rawGaps.length} Questions</strong>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary" id="btn-export-json">
              ${getIcon('download', 16)} Export Progress (JSON)
            </button>
            <button type="button" class="btn btn-danger" id="btn-open-reset-modal">
              ${getIcon('trash', 16)} Reset Demo Progress
            </button>
          </div>
        </div>

        <!-- Reset Confirmation Modal -->
        ${this.showResetModal ? `
          <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-reset-title">
            <div class="modal-content">
              <div class="modal-header">
                <h3 id="modal-reset-title" style="color: var(--danger); display: flex; align-items: center; gap: 0.5rem;">
                  ${getIcon('trash', 20)} Reset All Progress?
                </h3>
              </div>

              <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem;">
                This will permanently delete your stored quiz attempts, current day streak, and recorded knowledge gaps from this browser's <code>localStorage</code>.
              </p>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="btn-cancel-reset">
                  Cancel
                </button>
                <button type="button" class="btn btn-danger" id="btn-confirm-reset">
                  Yes, Reset Everything
                </button>
              </div>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  attachEvents(container, onRerender) {
    // Theme buttons
    container.querySelectorAll('[data-set-theme]').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-set-theme');
        StorageService.savePreferences({ theme });
        if (this.onThemeChange) {
          this.onThemeChange(theme);
        }
        onRerender();
      });
    });

    // Daily goal change
    const goalSelect = container.querySelector('#daily-goal-select');
    if (goalSelect) {
      goalSelect.addEventListener('change', (e) => {
        const dailyGoal = parseInt(e.target.value, 10);
        StorageService.savePreferences({ dailyGoal });
      });
    }

    // Export progress JSON
    const exportBtn = container.querySelector('#btn-export-json');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const jsonStr = StorageService.exportDataJson();
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `studyspark-progress-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    // Open reset modal
    const openResetBtn = container.querySelector('#btn-open-reset-modal');
    if (openResetBtn) {
      openResetBtn.addEventListener('click', () => {
        this.showResetModal = true;
        onRerender();
      });
    }

    // Cancel reset modal
    const cancelResetBtn = container.querySelector('#btn-cancel-reset');
    if (cancelResetBtn) {
      cancelResetBtn.addEventListener('click', () => {
        this.showResetModal = false;
        onRerender();
      });
    }

    // Confirm reset
    const confirmResetBtn = container.querySelector('#btn-confirm-reset');
    if (confirmResetBtn) {
      confirmResetBtn.addEventListener('click', () => {
        StorageService.resetAll();
        this.showResetModal = false;
        if (this.onReset) {
          this.onReset();
        }
        onRerender();
      });
    }
  }
}

