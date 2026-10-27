/**
 * StudySpark Quiz View Component
 * Robust quiz experience with subject/topic selection, interactive question navigation,
 * answer selection/modification, missing-answer validation, scoring calculation,
 * and comprehensive explanations.
 */

import { SUBJECTS, getSubjectById, getQuestionsBySubject } from '../data/questions.js';
import { createQuizSession } from '../services/quizEngine.js';
import { getIcon } from './Icons.js';

export class QuizView {
  constructor(initialSubjectId = null, onQuizComplete = null, onNavigate = null) {
    this.selectedSubjectId = initialSubjectId || 'java';
    this.selectedTopic = 'all';
    this.session = null;
    this.onQuizComplete = onQuizComplete;
    this.onNavigate = onNavigate;
    this.showUnansweredModal = false;
    this.reviewFilterMode = 'all'; // 'all' or 'incorrect'

    if (initialSubjectId) {
      this.startSession(initialSubjectId);
    }
  }

  startSession(subjectId, topic = 'all') {
    const subject = getSubjectById(subjectId);
    if (!subject) return;

    this.selectedSubjectId = subjectId;
    this.selectedTopic = topic;
    this.session = createQuizSession(subject, topic);
    this.showUnansweredModal = false;
    this.reviewFilterMode = 'all';
  }

  restartCurrentQuiz() {
    if (!this.session) return;
    this.startSession(this.session.subject.id, this.selectedTopic);
  }

  render() {
    if (!this.session) {
      return this.renderSubjectSelector();
    }

    if (this.session.isSubmitted) {
      return this.renderResults();
    }

    return this.renderActiveQuiz();
  }

  // ================= SUBJECT & TOPIC SELECTOR =================
  renderSubjectSelector() {
    const currentSubject = getSubjectById(this.selectedSubjectId) || SUBJECTS[0];

    return `
      <div class="card" style="max-width: 680px; margin: 1rem auto; padding: 2rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <div class="empty-state-icon" style="background: var(--brand-gradient-subtle); color: var(--brand-indigo);">
            ${getIcon('quiz', 28)}
          </div>
          <h2 style="font-size: 1.375rem; font-weight: 800; margin-bottom: 0.5rem;">Configure Your Practice Quiz</h2>
          <p style="color: var(--text-muted); font-size: 0.875rem;">
            Select a subject and focus area. All questions are verified, beginner-friendly college practice material.
          </p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          <div>
            <label for="quiz-subject-select" style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">
              Choose Subject
            </label>
            <select id="quiz-subject-select" class="search-input" style="padding-left: 1rem;">
              ${SUBJECTS.map(s => `
                <option value="${s.id}" ${s.id === this.selectedSubjectId ? 'selected' : ''}>
                  ${s.name} (${getQuestionsBySubject(s.id).length} questions)
                </option>
              `).join('')}
            </select>
          </div>

          <div>
            <label for="quiz-topic-select" style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">
              Focus Topic
            </label>
            <select id="quiz-topic-select" class="search-input" style="padding-left: 1rem;">
              <option value="all">All Available Topics (Comprehensive)</option>
              ${currentSubject.topics.map(t => `
                <option value="${t}">${t}</option>
              `).join('')}
            </select>
          </div>

          <div style="margin-top: 1rem;">
            <button type="button" class="btn btn-primary btn-lg" id="btn-launch-quiz" style="width: 100%;">
              ${getIcon('spark', 18)} Start Practice Session
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ================= ACTIVE QUIZ SESSION =================
  renderActiveQuiz() {
    const q = this.session.getCurrentQuestion();
    if (!q) return `<p>Error loading question.</p>`;

    const totalQuestions = this.session.questions.length;
    const currentNum = this.session.currentIndex + 1;
    const answeredCount = this.session.getAnsweredCount();
    const progressPct = Math.round((answeredCount / totalQuestions) * 100);
    const selectedAnswerIndex = this.session.getSelectedAnswer(q.id);
    const optionKeys = ['A', 'B', 'C', 'D'];

    return `
      <div class="active-quiz-page">
        <!-- Top Status Bar -->
        <div class="quiz-header-bar">
          <div class="quiz-meta-left">
            <span class="badge badge-indigo">${this.session.subject.name}</span>
            <span style="font-size: 0.875rem; font-weight: 600; color: var(--text-secondary);">
              Question ${currentNum} of ${totalQuestions}
            </span>
          </div>

          <div class="quiz-progress-section">
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">
              <span>Progress (${answeredCount}/${totalQuestions} Answered)</span>
              <span>${progressPct}%</span>
            </div>
            <div class="progress-container">
              <div class="progress-fill" style="width: ${progressPct}%;"></div>
            </div>
          </div>

          <div>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-abort-quiz">
              Exit Quiz
            </button>
          </div>
        </div>

        <!-- Question Navigator Pills -->
        <div class="quiz-nav-pills" role="navigation" aria-label="Question Navigation">
          ${this.session.questions.map((item, idx) => {
            const isCurrent = idx === this.session.currentIndex;
            const isAnswered = this.session.isAnswered(idx);
            let pillClass = 'nav-pill';
            if (isCurrent) pillClass += ' current';
            else if (isAnswered) pillClass += ' answered';

            return `
              <button 
                type="button" 
                class="${pillClass}" 
                data-nav-question="${idx}"
                aria-label="Go to Question ${idx + 1}${isAnswered ? ' (Answered)' : ''}"
                aria-current="${isCurrent ? 'true' : 'false'}"
              >
                ${idx + 1}
              </button>
            `;
          }).join('')}
        </div>

        <!-- Question Card -->
        <div class="card question-card" role="region" aria-live="polite">
          <span class="question-category-tag">${q.topic}</span>
          <h2 class="question-prompt">${q.question}</h2>

          ${q.codeSnippet ? `
            <pre class="code-snippet"><code>${this.escapeHtml(q.codeSnippet)}</code></pre>
          ` : ''}

          <div class="options-list" role="radiogroup" aria-label="Answer Options">
            ${q.options.map((optionText, optIdx) => {
              const isSelected = selectedAnswerIndex === optIdx;

              return `
                <button 
                  type="button" 
                  class="option-btn ${isSelected ? 'selected' : ''}" 
                  data-select-option="${optIdx}"
                  role="radio"
                  aria-checked="${isSelected}"
                  aria-label="Option ${optionKeys[optIdx]}: ${optionText}"
                >
                  <span class="option-key">${optionKeys[optIdx]}</span>
                  <span style="flex: 1;">${optionText}</span>
                  ${isSelected ? `<span style="color: var(--brand-indigo);">${getIcon('check', 16)}</span>` : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Quiz Footer Actions -->
        <div class="quiz-footer-actions">
          <button 
            type="button" 
            class="btn btn-secondary" 
            id="btn-prev-question"
            ${this.session.currentIndex === 0 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}
          >
            ${getIcon('arrowLeft', 16)} Previous
          </button>

          <div style="display: flex; gap: 0.75rem;">
            ${currentNum < totalQuestions ? `
              <button type="button" class="btn btn-secondary" id="btn-next-question">
                Next ${getIcon('arrowRight', 16)}
              </button>
            ` : ''}

            <button type="button" class="btn btn-primary" id="btn-submit-quiz">
              ${getIcon('checkCircle', 16)} Submit Answers
            </button>
          </div>
        </div>

        <!-- Unanswered Questions Validation Modal -->
        ${this.showUnansweredModal ? this.renderUnansweredModal() : ''}
      </div>
    `;
  }

  // ================= UNANSWERED VALIDATION MODAL =================
  renderUnansweredModal() {
    const unanswered = this.session.getUnansweredQuestions();

    return `
      <div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-validation-title">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="modal-validation-title" style="display: flex; align-items: center; gap: 0.5rem; color: var(--warning);">
              ${getIcon('revision', 20)} Unanswered Questions (${unanswered.length})
            </h3>
          </div>

          <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
            You still have <strong>${unanswered.length} question${unanswered.length === 1 ? '' : 's'}</strong> without a selected answer:
          </p>

          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
            ${unanswered.map(u => `
              <button 
                type="button" 
                class="badge badge-warning" 
                style="cursor: pointer; padding: 0.5rem 0.75rem; font-size: 0.8125rem;"
                data-jump-unanswered="${u.index}"
              >
                Question ${u.number}
              </button>
            `).join('')}
          </div>

          <p style="font-size: 0.8125rem; color: var(--text-muted);">
            Would you like to complete these questions first, or submit the quiz right now?
          </p>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-dismiss-modal">
              Review Missing
            </button>
            <button type="button" class="btn btn-danger" id="btn-confirm-submit">
              Submit Anyway
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ================= RESULTS & EXPLANATIONS VIEW =================
  renderResults() {
    const result = this.session.result;
    if (!result) return `<p>Error loading results.</p>`;

    const isHighPassing = result.percentage >= 75;
    const optionKeys = ['A', 'B', 'C', 'D'];

    // Filter questions based on toggle
    const questionsToDisplay = this.session.questions.filter(q => {
      if (this.reviewFilterMode === 'incorrect') {
        const selected = result.userAnswers[q.id];
        return selected !== q.correctIndex;
      }
      return true;
    });

    return `
      <div class="quiz-results-page">
        <!-- Results Summary Card -->
        <div class="card results-card">
          <div class="score-radial">
            <span class="percentage">${result.percentage}%</span>
            <span class="fraction">${result.score} / ${result.totalQuestions} Correct</span>
          </div>

          <h2 style="font-size: 1.375rem; font-weight: 800; margin-bottom: 0.375rem;">
            ${isHighPassing ? 'Excellent Work!' : 'Good Effort! Time to Revise.'}
          </h2>
          <p style="color: var(--text-muted); font-size: 0.875rem;">
            ${isHighPassing 
              ? 'You have demonstrated strong grasp of these concepts.' 
              : 'Review your incorrect questions below to solidify your understanding.'}
          </p>

          <div class="results-meta-stats">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Subject</span>
              <strong style="font-size: 0.875rem;">${this.session.subject.name}</strong>
            </div>
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Mastery Level</span>
              <span class="badge ${isHighPassing ? 'badge-success' : 'badge-danger'}">
                ${result.tier}
              </span>
            </div>
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Time Spent</span>
              <strong style="font-size: 0.875rem;">${result.durationSeconds}s</strong>
            </div>
          </div>

          <div class="results-actions">
            <button type="button" class="btn btn-primary" id="btn-retry-quiz">
              ${getIcon('rotateCcw', 16)} Retry This Quiz
            </button>
            <button type="button" class="btn btn-secondary" id="btn-results-to-dashboard">
              Back to Dashboard
            </button>
            <button type="button" class="btn btn-outline" id="btn-results-to-revision">
              ${getIcon('revision', 16)} Open Revision Bank
            </button>
          </div>
        </div>

        <!-- Explanations & Review Section -->
        <div style="margin-top: 2rem;">
          <div class="section-title">
            <h3 style="font-size: 1.125rem;">Question Breakdown & Verified Explanations</h3>

            <div style="display: flex; gap: 0.5rem;">
              <button 
                type="button" 
                class="filter-btn ${this.reviewFilterMode === 'all' ? 'active' : ''}" 
                id="filter-all-questions"
              >
                All Questions (${this.session.questions.length})
              </button>
              <button 
                type="button" 
                class="filter-btn ${this.reviewFilterMode === 'incorrect' ? 'active' : ''}" 
                id="filter-incorrect-questions"
              >
                Incorrect Only (${result.incorrectQuestions.length})
              </button>
            </div>
          </div>

          ${questionsToDisplay.length === 0 ? `
            <div class="card empty-state">
              <div class="empty-state-icon" style="background: var(--success-bg); color: var(--success);">
                ${getIcon('checkCircle', 28)}
              </div>
              <h3>Zero Mistakes!</h3>
              <p>You answered every single question in this quiz correctly. Phenomenal job!</p>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              ${questionsToDisplay.map((q, idx) => {
                const userChoice = result.userAnswers[q.id];
                const isCorrect = userChoice === q.correctIndex;
                const wasAnswered = userChoice !== undefined;

                return `
                  <div class="card ${isCorrect ? '' : 'revision-item'}" style="padding: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                      <div>
                        <span class="question-category-tag">${q.topic}</span>
                        <h4 style="font-size: 1.0625rem; font-weight: 700; color: var(--text-primary);">
                          ${q.question}
                        </h4>
                      </div>
                      <span class="badge ${isCorrect ? 'badge-success' : 'badge-danger'}">
                        ${isCorrect ? 'Correct' : (wasAnswered ? 'Incorrect' : 'Unanswered')}
                      </span>
                    </div>

                    ${q.codeSnippet ? `
                      <pre class="code-snippet"><code>${this.escapeHtml(q.codeSnippet)}</code></pre>
                    ` : ''}

                    <div class="options-list">
                      ${q.options.map((opt, optIdx) => {
                        let optClass = 'option-btn';
                        if (optIdx === q.correctIndex) {
                          optClass += ' correct';
                        } else if (optIdx === userChoice) {
                          optClass += ' incorrect';
                        }

                        return `
                          <div class="${optClass}" style="cursor: default;">
                            <span class="option-key">${optionKeys[optIdx]}</span>
                            <span style="flex: 1;">${opt}</span>
                            ${optIdx === q.correctIndex ? `
                              <span style="font-size: 0.75rem; font-weight: 700; color: var(--success);">
                                Correct Answer
                              </span>
                            ` : (optIdx === userChoice ? `
                              <span style="font-size: 0.75rem; font-weight: 700; color: var(--danger);">
                                Your Choice
                              </span>
                            ` : '')}
                          </div>
                        `;
                      }).join('')}
                    </div>

                    <div class="explanation-card">
                      <strong>${getIcon('spark', 14)} Concept Explanation:</strong>
                      ${q.explanation}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  }

  // ================= EVENT HANDLING =================
  attachEvents(container, onRerender) {
    // Subject selector dropdown change
    const subjectSelect = container.querySelector('#quiz-subject-select');
    if (subjectSelect) {
      subjectSelect.addEventListener('change', (e) => {
        this.selectedSubjectId = e.target.value;
        onRerender();
      });
    }

    // Launch Quiz button
    const launchBtn = container.querySelector('#btn-launch-quiz');
    if (launchBtn) {
      launchBtn.addEventListener('click', () => {
        const topicSelect = container.querySelector('#quiz-topic-select');
        const topic = topicSelect ? topicSelect.value : 'all';
        this.startSession(this.selectedSubjectId, topic);
        onRerender();
      });
    }

    // Exit / Abort Quiz
    const abortBtn = container.querySelector('#btn-abort-quiz');
    if (abortBtn) {
      abortBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to exit? Your progress in this unfinished quiz will be lost.')) {
          this.session = null;
          if (this.onNavigate) this.onNavigate('dashboard');
          else onRerender();
        }
      });
    }

    // Question pill navigation
    container.querySelectorAll('[data-nav-question]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-nav-question'), 10);
        this.session.goToQuestion(idx);
        onRerender();
      });
    });

    // Option selection
    container.querySelectorAll('[data-select-option]').forEach(btn => {
      btn.addEventListener('click', () => {
        const optionIndex = parseInt(btn.getAttribute('data-select-option'), 10);
        const currentQ = this.session.getCurrentQuestion();
        if (currentQ) {
          this.session.selectAnswer(currentQ.id, optionIndex);
          onRerender();
        }
      });
    });

    // Previous Question
    const prevBtn = container.querySelector('#btn-prev-question');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.session.prevQuestion();
        onRerender();
      });
    }

    // Next Question
    const nextBtn = container.querySelector('#btn-next-question');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.session.nextQuestion();
        onRerender();
      });
    }

    // Submit Quiz button
    const submitBtn = container.querySelector('#btn-submit-quiz');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const unanswered = this.session.getUnansweredQuestions();
        if (unanswered.length > 0) {
          this.showUnansweredModal = true;
          onRerender();
        } else {
          this.session.submit();
          if (this.onQuizComplete) this.onQuizComplete(this.session.result);
          onRerender();
        }
      });
    }

    // Modal: Jump to unanswered question
    container.querySelectorAll('[data-jump-unanswered]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-jump-unanswered'), 10);
        this.session.goToQuestion(idx);
        this.showUnansweredModal = false;
        onRerender();
      });
    });

    // Modal: Dismiss / Review
    const dismissModalBtn = container.querySelector('#btn-dismiss-modal');
    if (dismissModalBtn) {
      dismissModalBtn.addEventListener('click', () => {
        const unanswered = this.session.getUnansweredQuestions();
        if (unanswered.length > 0) {
          this.session.goToQuestion(unanswered[0].index);
        }
        this.showUnansweredModal = false;
        onRerender();
      });
    }

    // Modal: Confirm submit anyway
    const confirmSubmitBtn = container.querySelector('#btn-confirm-submit');
    if (confirmSubmitBtn) {
      confirmSubmitBtn.addEventListener('click', () => {
        this.showUnansweredModal = false;
        this.session.submit();
        if (this.onQuizComplete) this.onQuizComplete(this.session.result);
        onRerender();
      });
    }

    // Results: Retry
    const retryBtn = container.querySelector('#btn-retry-quiz');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        this.restartCurrentQuiz();
        onRerender();
      });
    }

    // Results: Back to Dashboard
    const toDashboardBtn = container.querySelector('#btn-results-to-dashboard');
    if (toDashboardBtn) {
      toDashboardBtn.addEventListener('click', () => {
        this.session = null;
        if (this.onNavigate) this.onNavigate('dashboard');
      });
    }

    // Results: To Revision Bank
    const toRevisionBtn = container.querySelector('#btn-results-to-revision');
    if (toRevisionBtn) {
      toRevisionBtn.addEventListener('click', () => {
        this.session = null;
        if (this.onNavigate) this.onNavigate('revision');
      });
    }

    // Results: Filter all vs incorrect
    const filterAllBtn = container.querySelector('#filter-all-questions');
    if (filterAllBtn) {
      filterAllBtn.addEventListener('click', () => {
        this.reviewFilterMode = 'all';
        onRerender();
      });
    }

    const filterIncorrectBtn = container.querySelector('#filter-incorrect-questions');
    if (filterIncorrectBtn) {
      filterIncorrectBtn.addEventListener('click', () => {
        this.reviewFilterMode = 'incorrect';
        onRerender();
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

