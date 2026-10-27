/**
 * StudySpark Search & Topic Discovery Component
 * Enables instantaneous searching across subjects, specific topics, and question text
 * with subject filtering pills and clear empty states.
 */

import { QUESTION_BANK, SUBJECTS } from '../data/questions.js';
import { getIcon } from './Icons.js';

export class SearchView {
  constructor(onStartQuiz = null) {
    this.onStartQuiz = onStartQuiz;
    this.searchQuery = '';
    this.selectedSubjectFilter = 'all';
  }

  render() {
    const query = this.searchQuery.trim().toLowerCase();

    // Filter questions
    const results = QUESTION_BANK.filter(q => {
      // Subject filter check
      if (this.selectedSubjectFilter !== 'all' && q.subjectId !== this.selectedSubjectFilter) {
        return false;
      }

      if (!query) return true;

      // Query check against question text, topic, explanation, code snippet, and subject name
      const subject = SUBJECTS.find(s => s.id === q.subjectId);
      const subjectName = subject ? subject.name.toLowerCase() : '';
      const promptMatch = q.question.toLowerCase().includes(query);
      const topicMatch = q.topic.toLowerCase().includes(query);
      const explanationMatch = q.explanation.toLowerCase().includes(query);
      const codeMatch = q.codeSnippet ? q.codeSnippet.toLowerCase().includes(query) : false;

      return promptMatch || topicMatch || explanationMatch || codeMatch || subjectName.includes(query);
    });

    return `
      <div class="search-page">
        <!-- Search Input Bar -->
        <div class="search-bar-wrapper">
          <span class="search-icon-inside">${getIcon('search', 18)}</span>
          <input 
            type="search" 
            class="search-input" 
            id="topic-search-input"
            placeholder="Search concepts (e.g. 'TCP', 'Flexbox', 'finally', 'Polymorphism', 'ARP')..."
            value="${this.escapeHtml(this.searchQuery)}"
            aria-label="Search topics and practice questions"
          />
        </div>

        <!-- Filter Pills -->
        <div class="filter-pills" role="tablist" aria-label="Filter Search Results by Subject">
          <button 
            type="button" 
            class="filter-btn ${this.selectedSubjectFilter === 'all' ? 'active' : ''}" 
            data-search-filter="all"
          >
            All Subjects (${QUESTION_BANK.length})
          </button>
          ${SUBJECTS.map(s => {
            const count = QUESTION_BANK.filter(q => q.subjectId === s.id).length;
            return `
              <button 
                type="button" 
                class="filter-btn ${this.selectedSubjectFilter === s.id ? 'active' : ''}" 
                data-search-filter="${s.id}"
              >
                ${s.name} (${count})
              </button>
            `;
          }).join('')}
        </div>

        <!-- Results Summary Info -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; font-size: 0.8125rem; color: var(--text-muted);">
          <span>Showing <strong>${results.length}</strong> matching concept${results.length === 1 ? '' : 's'}</span>
          ${this.searchQuery ? `
            <button type="button" class="btn btn-secondary btn-sm" id="btn-clear-search">
              Clear Search
            </button>
          ` : ''}
        </div>

        <!-- Results List -->
        ${results.length === 0 ? `
          <div class="card empty-state">
            <div class="empty-state-icon">
              ${getIcon('search', 28)}
            </div>
            <h3>No Concepts Found</h3>
            <p>
              No questions matched "<strong>${this.escapeHtml(this.searchQuery)}</strong>". 
              Try searching for common terms like "CSS", "UDP", "static", "O(1)", or switch filters.
            </p>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-reset-filters">
              Reset Filters
            </button>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${results.map(q => {
              const subject = SUBJECTS.find(s => s.id === q.subjectId);
              return `
                <div class="card" style="padding: 1.25rem;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.5rem;">
                    <div>
                      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                        <span class="badge badge-indigo">${subject ? subject.name : q.subjectId}</span>
                        <span class="badge" style="background-color: var(--bg-secondary); color: var(--text-secondary);">${q.topic}</span>
                      </div>
                      <h3 style="font-size: 1rem; font-weight: 700; color: var(--text-primary);">
                        ${this.highlightMatch(q.question, this.searchQuery)}
                      </h3>
                    </div>

                    <button 
                      type="button" 
                      class="btn btn-primary btn-sm" 
                      data-quiz-subject="${q.subjectId}"
                      title="Start quiz in ${subject ? subject.name : ''}"
                    >
                      ${getIcon('quiz', 14)} Practise
                    </button>
                  </div>

                  <p style="font-size: 0.8125rem; color: var(--text-secondary); line-height: 1.5; margin-top: 0.5rem;">
                    ${this.highlightMatch(q.explanation, this.searchQuery)}
                  </p>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;
  }

  attachEvents(container, onRerender) {
    // Search input typing with debounce or direct input
    const input = container.querySelector('#topic-search-input');
    if (input) {
      input.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        onRerender();
        // Restore focus to input after render
        const updatedInput = container.querySelector('#topic-search-input');
        if (updatedInput) {
          updatedInput.focus();
          updatedInput.setSelectionRange(updatedInput.value.length, updatedInput.value.length);
        }
      });
    }

    // Filter pills
    container.querySelectorAll('[data-search-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedSubjectFilter = btn.getAttribute('data-search-filter');
        onRerender();
      });
    });

    // Clear search
    const clearBtn = container.querySelector('#btn-clear-search');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.searchQuery = '';
        onRerender();
      });
    }

    // Reset filters
    const resetBtn = container.querySelector('#btn-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.searchQuery = '';
        this.selectedSubjectFilter = 'all';
        onRerender();
      });
    }

    // Launch quiz on subject
    container.querySelectorAll('[data-quiz-subject]').forEach(btn => {
      btn.addEventListener('click', () => {
        const subjectId = btn.getAttribute('data-quiz-subject');
        if (this.onStartQuiz) {
          this.onStartQuiz(subjectId);
        }
      });
    });
  }

  highlightMatch(text, query) {
    if (!query || !query.trim()) return this.escapeHtml(text);
    const cleanQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${cleanQuery})`, 'gi');
    return this.escapeHtml(text).replace(regex, '<mark style="background-color: #fef08a; color: #854d0e; padding: 0.1em 0.2em; border-radius: 2px;">$1</mark>');
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

