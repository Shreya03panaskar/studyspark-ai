/**
 * StudySpark Dashboard Component
 * Clean visual hierarchy, daily learning goal, subject cards, recent attempts,
 * and quick-start actions.
 */

import { SUBJECTS, getQuestionsBySubject } from '../data/questions.js';
import { StorageService } from '../services/storage.js';
import { getIcon } from './Icons.js';

export function renderDashboard(onStartQuiz, onTabChange) {
  const stats = StorageService.getComputedStats();
  const attempts = StorageService.getAttempts();
  const recentAttempts = attempts.slice(0, 3);
  const prefs = StorageService.getPreferences();

  // Calculate today's completed quizzes towards daily goal
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCompletedCount = attempts.filter(a => a.timestamp.startsWith(todayStr)).length;
  const dailyGoal = prefs.dailyGoal || 2;
  const goalProgressPct = Math.min(100, Math.round((todayCompletedCount / dailyGoal) * 100));

  return `
    <div class="dashboard-page">
      <!-- Hero Banner -->
      <section class="hero-banner" aria-label="Welcome and Daily Goal">
        <div class="hero-content">
          <h2>Welcome back to StudySpark</h2>
          <p>Practise core technical subjects, identify knowledge gaps with verified sample questions, and revise incorrect answers before your college exams.</p>
          <div class="hero-actions">
            <button type="button" class="btn btn-secondary btn-sm" id="hero-quick-start">
              ${getIcon('quiz', 16)} Start a Quick Quiz
            </button>
            <button type="button" class="btn btn-outline btn-sm" id="hero-view-gaps" style="border-color: rgba(255,255,255,0.4); color: #fff;">
              ${getIcon('revision', 16)} Review Knowledge Gaps (${stats.knowledgeGapsCount})
            </button>
          </div>
        </div>

        <div class="daily-goal-pill">
          <span>Daily Goal (${todayCompletedCount}/${dailyGoal} Completed)</span>
          <strong>${todayCompletedCount >= dailyGoal ? 'Goal Met! 🎉' : `${dailyGoal - todayCompletedCount} more to go`}</strong>
          <div class="progress-container" style="margin-top: 0.5rem; height: 6px; background: rgba(255,255,255,0.2);">
            <div class="progress-fill" style="width: ${goalProgressPct}%; background: #10b981;"></div>
          </div>
        </div>
      </section>

      <!-- Stats Overview Row -->
      <section class="stats-grid" aria-label="Learning Progress Overview">
        <div class="card stat-card">
          <div class="stat-icon indigo">
            ${getIcon('quiz', 22)}
          </div>
          <div class="stat-meta">
            <span>Quizzes Attempted</span>
            <strong>${stats.totalAttempts}</strong>
          </div>
        </div>

        <div class="card stat-card">
          <div class="stat-icon emerald">
            ${getIcon('chart', 22)}
          </div>
          <div class="stat-meta">
            <span>Average Score</span>
            <strong>${stats.totalAttempts > 0 ? `${stats.averageScore}%` : '—'}</strong>
          </div>
        </div>

        <div class="card stat-card">
          <div class="stat-icon amber">
            ${getIcon('flame', 22)}
          </div>
          <div class="stat-meta">
            <span>Day Streak</span>
            <strong>${stats.streakDays} Day${stats.streakDays === 1 ? '' : 's'}</strong>
          </div>
        </div>

        <div class="card stat-card">
          <div class="stat-icon blue">
            ${getIcon('revision', 22)}
          </div>
          <div class="stat-meta">
            <span>Knowledge Gaps</span>
            <strong>${stats.knowledgeGapsCount} Topic${stats.knowledgeGapsCount === 1 ? '' : 's'}</strong>
          </div>
        </div>
      </section>

      <!-- Subject Cards Grid -->
      <section aria-labelledby="subjects-heading">
        <div class="section-title">
          <h2 id="subjects-heading" style="font-size: 1.125rem;">Curated Academic Subjects</h2>
          <span style="font-size: 0.8125rem; color: var(--text-muted);">Verified sample question banks</span>
        </div>

        <div class="subject-grid">
          ${SUBJECTS.map(subject => {
            const subjectQuestions = getQuestionsBySubject(subject.id);
            const subjectStat = stats.subjectStats[subject.id] || { attempts: 0, bestScore: 0 };

            return `
              <div class="card subject-card" data-subject-card="${subject.id}">
                <div class="subject-card-header">
                  <div class="subject-icon-box ${subject.colorKey}">
                    ${getIcon('book', 22)}
                  </div>
                  <div class="subject-info">
                    <h3>${subject.name}</h3>
                    <p>${subject.description}</p>
                  </div>
                </div>

                <div class="subject-topics-preview">
                  ${subject.topics.slice(0, 3).map(topic => `
                    <span class="topic-tag">${topic}</span>
                  `).join('')}
                  ${subject.topics.length > 3 ? `<span class="topic-tag">+${subject.topics.length - 3} more</span>` : ''}
                </div>

                <div class="subject-card-footer">
                  <div>
                    <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">
                      ${subjectStat.attempts > 0 ? `Best Score: ${subjectStat.bestScore}%` : 'Not attempted yet'}
                    </span>
                    <strong style="font-size: 0.8125rem; color: var(--text-primary);">
                      ${subjectQuestions.length} Questions
                    </strong>
                  </div>
                  <button 
                    type="button" 
                    class="btn btn-primary btn-sm" 
                    data-start-subject="${subject.id}"
                    aria-label="Start ${subject.name} quiz"
                  >
                    ${subjectStat.attempts > 0 ? 'Practise Again' : 'Start Quiz'} ${getIcon('arrowRight', 14)}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Recent Quiz Activity -->
      <section aria-labelledby="recent-activity-heading">
        <div class="section-title">
          <h2 id="recent-activity-heading" style="font-size: 1.125rem;">Recent Quiz Activity</h2>
          ${recentAttempts.length > 0 ? `
            <button type="button" class="btn btn-secondary btn-sm" id="view-all-attempts-btn">
              View Revision Bank
            </button>
          ` : ''}
        </div>

        ${recentAttempts.length === 0 ? `
          <div class="card empty-state">
            <div class="empty-state-icon">
              ${getIcon('quiz', 28)}
            </div>
            <h3>No Quiz Attempts Yet</h3>
            <p>Pick a subject above to take your first 5-minute practice quiz and diagnose your strengths!</p>
            <button type="button" class="btn btn-primary btn-sm" data-start-subject="java">
              ${getIcon('spark', 14)} Take Java Quiz Now
            </button>
          </div>
        ` : `
          <div class="card" style="padding: 0; overflow: hidden;">
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.875rem;">
                <thead>
                  <tr style="background-color: var(--bg-secondary); border-bottom: 1px solid var(--border-color); color: var(--text-secondary);">
                    <th style="padding: 0.75rem 1rem;">Subject</th>
                    <th style="padding: 0.75rem 1rem;">Topic</th>
                    <th style="padding: 0.75rem 1rem;">Score</th>
                    <th style="padding: 0.75rem 1rem;">Status</th>
                    <th style="padding: 0.75rem 1rem;">Date</th>
                    <th style="padding: 0.75rem 1rem; text-align: right;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentAttempts.map(attempt => {
                    const isPass = (attempt.percentage || 0) >= 70;
                    const dateFormatted = new Date(attempt.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return `
                      <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 0.875rem 1rem; font-weight: 600;">${attempt.subjectName || attempt.subjectId}</td>
                        <td style="padding: 0.875rem 1rem; color: var(--text-secondary);">${attempt.topic || 'All Topics'}</td>
                        <td style="padding: 0.875rem 1rem;">
                          <strong>${attempt.score} / ${attempt.totalQuestions}</strong>
                          <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 0.25rem;">(${attempt.percentage}%)</span>
                        </td>
                        <td style="padding: 0.875rem 1rem;">
                          <span class="badge ${isPass ? 'badge-success' : 'badge-danger'}">
                            ${attempt.tier || (isPass ? 'Proficient' : 'Needs Practice')}
                          </span>
                        </td>
                        <td style="padding: 0.875rem 1rem; color: var(--text-muted); font-size: 0.8125rem;">${dateFormatted}</td>
                        <td style="padding: 0.875rem 1rem; text-align: right;">
                          <button 
                            type="button" 
                            class="btn btn-secondary btn-sm" 
                            data-retake-subject="${attempt.subjectId}"
                            title="Retake quiz for ${attempt.subjectName}"
                          >
                            ${getIcon('rotateCcw', 12)} Retake
                          </button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `}
      </section>
    </div>
  `;
}

export function attachDashboardEvents(container, onStartQuiz, onTabChange) {
  // Start subject quiz buttons
  container.querySelectorAll('[data-start-subject]').forEach(btn => {
    btn.addEventListener('click', () => {
      const subjectId = btn.getAttribute('data-start-subject');
      onStartQuiz(subjectId);
    });
  });

  // Retake subject quiz
  container.querySelectorAll('[data-retake-subject]').forEach(btn => {
    btn.addEventListener('click', () => {
      const subjectId = btn.getAttribute('data-retake-subject');
      onStartQuiz(subjectId);
    });
  });

  // Hero Quick Start
  const heroQuickBtn = container.querySelector('#hero-quick-start');
  if (heroQuickBtn) {
    heroQuickBtn.addEventListener('click', () => {
      onStartQuiz('java');
    });
  }

  // Hero View Gaps
  const heroGapsBtn = container.querySelector('#hero-view-gaps');
  if (heroGapsBtn) {
    heroGapsBtn.addEventListener('click', () => {
      onTabChange('revision');
    });
  }

  // View all attempts button
  const viewAttemptsBtn = container.querySelector('#view-all-attempts-btn');
  if (viewAttemptsBtn) {
    viewAttemptsBtn.addEventListener('click', () => {
      onTabChange('revision');
    });
  }
}

