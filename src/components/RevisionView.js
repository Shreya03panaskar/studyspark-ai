/**
 * StudySpark Revision & Knowledge Gaps View
 * Displays every question the student has answered incorrectly across quizzes,
 * provides verified explanations, tracks mistake frequency, and offers a targeted
 * revision drill session.
 */

import { StorageService } from '../services/storage.js';
import { getQuestionById, SUBJECTS } from '../data/questions.js';
import { getIcon } from './Icons.js';

export class RevisionView {
  constructor(onStartDrill = null, onNavigate = null) {
    this.onStartDrill = onStartDrill;
    this.onNavigate = onNavigate;
    this.activeFilter = 'all'; // 'all', 'java', 'htmlcss', 'networks'
  }

  render() {
    const rawBank = StorageService.getRevisionBank();
    const stats = StorageService.getComputedStats();

    // Map each revision item to the actual question data
    const enrichedItems = rawBank.map(item => {
      const q = getQuestionById(item.questionId);
      return { ...item, questionData: q };
    }).filter(item => item.questionData !== null);

    const filteredItems = enrichedItems.filter(item => {
      if (this.activeFilter === 'all') return true;
      return item.subjectId === this.activeFilter;
    });

    return `
      <div class="revision-page">
        <!-- Overview Banner -->
        <div class="card" style="margin-bottom: 1.5rem; background: var(--brand-gradient-subtle); border-color: rgba(79, 70, 229, 0.2);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div>
              <span class="badge badge-indigo" style="margin-bottom: 0.375rem;">Targeted Review</span>
              <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem;">
                Personal Knowledge Gaps Bank
              </h2>
              <p style="font-size: 0.875rem; color: var(--text-secondary); max-width: 600px;">
                Every time you answer a practice question incorrectly, StudySpark saves it here so you can review the underlying concept and eliminate blind spots.
              </p>
            </div>

            ${enrichedItems.length > 0 ? `
              <button type="button" class="btn btn-primary" id="btn-drill-gaps">
                ${getIcon('spark', 16)} Drill Missed Questions (${enrichedItems.length})
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Filter Pills -->
        <div class="filter-pills" role="tablist" aria-label="Filter by Subject">
          <button 
            type="button" 
            class="filter-btn ${this.activeFilter === 'all' ? 'active' : ''}" 
            data-filter-subject="all"
          >
            All Gaps (${enrichedItems.length})
          </button>
          ${SUBJECTS.map(s => {
            const count = enrichedItems.filter(i => i.subjectId === s.id).length;
            return `
              <button 
                type="button" 
                class="filter-btn ${this.activeFilter === s.id ? 'active' : ''}" 
                data-filter-subject="${s.id}"
              >
                ${s.name} (${count})
              </button>
            `;
          }).join('')}
        </div>

        <!-- Content Area -->
        ${enrichedItems.length === 0 ? `
          <div class="card empty-state">
            <div class="empty-state-icon" style="background: var(--success-bg); color: var(--success);">
              ${getIcon('checkCircle', 28)}
            </div>
            <h3>Your Revision Bank is Clean!</h3>
            <p>You currently have no recorded knowledge gaps. Take a practice quiz to diagnose areas where you can improve.</p>
            <button type="button" class="btn btn-primary btn-sm" id="btn-empty-take-quiz">
              ${getIcon('quiz', 14)} Explore Practice Quizzes
            </button>
          </div>
        ` : filteredItems.length === 0 ? `
          <div class="card empty-state">
            <div class="empty-state-icon">
              ${getIcon('check', 28)}
            </div>
            <h3>No Gaps for this Subject</h3>
            <p>You have zero incorrect answers recorded for this category.</p>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            ${filteredItems.map(item => {
              const q = item.questionData;
              const optionKeys = ['A', 'B', 'C', 'D'];
              const dateAdded = new Date(item.lastMistakeDate || item.addedDate).toLocaleDateString();

              return `
                <div class="card revision-item" style="padding: 1.5rem;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 0.75rem;">
                    <div>
                      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.375rem;">
                        <span class="badge badge-indigo">${q.topic}</span>
                        <span class="badge badge-danger">Missed ${item.mistakeCount || 1} time${(item.mistakeCount || 1) === 1 ? '' : 's'}</span>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">Recorded on ${dateAdded}</span>
                      </div>
                      <h3 style="font-size: 1.0625rem; font-weight: 700; color: var(--text-primary);">
                        ${q.question}
                      </h3>
                    </div>

                    <button 
                      type="button" 
                      class="btn btn-secondary btn-sm" 
                      data-resolve-gap="${item.questionId}"
                      title="Mark as understood and remove from gap list"
                    >
                      ${getIcon('check', 14)} Mastered
                    </button>
                  </div>

                  ${q.codeSnippet ? `
                    <pre class="code-snippet"><code>${this.escapeHtml(q.codeSnippet)}</code></pre>
                  ` : ''}

                  <!-- Answer Options Breakdown -->
                  <div class="options-list" style="margin-bottom: 1rem;">
                    ${q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctIndex;
                      const wasSelected = optIdx === item.lastGivenAnswerIndex;
                      let optClass = 'option-btn';
                      if (isCorrect) optClass += ' correct';
                      else if (wasSelected) optClass += ' incorrect';

                      return `
                        <div class="${optClass}" style="cursor: default;">
                          <span class="option-key">${optionKeys[optIdx]}</span>
                          <span style="flex: 1;">${opt}</span>
                          ${isCorrect ? `
                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--success);">
                              Correct Answer
                            </span>
                          ` : (wasSelected ? `
                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--danger);">
                              Your Previous Mistake
                            </span>
                          ` : '')}
                        </div>
                      `;
                    }).join('')}
                  </div>

                  <!-- Verified Explanation -->
                  <div class="explanation-card">
                    <strong>${getIcon('spark', 14)} Why this is tested:</strong>
                    ${q.explanation}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  }

  attachEvents(container, onRerender) {
    // Subject filter pills
    container.querySelectorAll('[data-filter-subject]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeFilter = btn.getAttribute('data-filter-subject');
        onRerender();
      });
    });

    // Resolve / Master a gap
    container.querySelectorAll('[data-resolve-gap]').forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = btn.getAttribute('data-resolve-gap');
        StorageService.removeRevisionItem(qId);
        onRerender();
      });
    });

    // Start Drill Button
    const drillBtn = container.querySelector('#btn-drill-gaps');
    if (drillBtn) {
      drillBtn.addEventListener('click', () => {
        const bank = StorageService.getRevisionBank();
        if (bank.length > 0 && this.onStartDrill) {
          this.onStartDrill(bank);
        }
      });
    }

    // Empty state CTA
    const emptyCta = container.querySelector('#btn-empty-take-quiz');
    if (emptyCta && this.onNavigate) {
      emptyCta.addEventListener('click', () => {
        this.onNavigate('quiz');
      });
    }
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

