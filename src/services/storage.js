/**
 * StudySpark Storage Service
 * Robust, type-safe localStorage manager for quiz attempts, learning streak,
 * revision bank (knowledge gaps), and user preferences.
 */

const STORAGE_KEYS = {
  ATTEMPTS: 'studyspark_quiz_attempts_v1',
  STREAK: 'studyspark_learning_streak_v1',
  REVISION_BANK: 'studyspark_revision_bank_v1',
  PREFERENCES: 'studyspark_preferences_v1'
};

export const StorageService = {
  // ================= QUIZ ATTEMPTS =================
  getAttempts() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read attempts from localStorage:', e);
      return [];
    }
  },

  saveAttempt(attempt) {
    try {
      const attempts = this.getAttempts();
      const newAttempt = {
        id: 'attempt_' + Date.now(),
        timestamp: new Date().toISOString(),
        ...attempt
      };
      attempts.unshift(newAttempt); // most recent first
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
      
      // Update streak and revision bank
      this.recordActivity();
      if (newAttempt.incorrectQuestions && newAttempt.incorrectQuestions.length > 0) {
        this.addToRevisionBank(newAttempt.incorrectQuestions);
      }

      return newAttempt;
    } catch (e) {
      console.error('Failed to save attempt to localStorage:', e);
      return null;
    }
  },

  // ================= LEARNING STREAK =================
  getStreak() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STREAK);
      if (!data) return { currentStreak: 0, lastActiveDate: null };
      const parsed = JSON.parse(data);

      // Check if streak is still valid (within 1 day)
      const lastDate = parsed.lastActiveDate ? new Date(parsed.lastActiveDate) : null;
      if (!lastDate) return { currentStreak: 0, lastActiveDate: null };

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastDay = new Date(lastDate);
      lastDay.setHours(0, 0, 0, 0);

      const diffDays = Math.round((today - lastDay) / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        // Streak broken
        return { currentStreak: 0, lastActiveDate: parsed.lastActiveDate };
      }
      return parsed;
    } catch (e) {
      return { currentStreak: 0, lastActiveDate: null };
    }
  },

  recordActivity() {
    try {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const streakData = this.getStreak();

      if (!streakData.lastActiveDate) {
        const updated = { currentStreak: 1, lastActiveDate: todayStr };
        localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(updated));
        return updated;
      }

      const lastDay = streakData.lastActiveDate;
      if (lastDay === todayStr) {
        // Already active today, streak count unchanged
        return streakData;
      }

      const lastDate = new Date(lastDay);
      lastDate.setHours(0, 0, 0, 0);
      const currDate = new Date(todayStr);
      currDate.setHours(0, 0, 0, 0);

      const diffDays = Math.round((currDate - lastDate) / (1000 * 60 * 60 * 24));
      let newStreak = diffDays === 1 ? streakData.currentStreak + 1 : 1;

      const updated = { currentStreak: newStreak, lastActiveDate: todayStr };
      localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to update streak:', e);
      return { currentStreak: 1, lastActiveDate: new Date().toISOString().split('T')[0] };
    }
  },

  // ================= REVISION BANK (KNOWLEDGE GAPS) =================
  getRevisionBank() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVISION_BANK);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  addToRevisionBank(missedQuestions) {
    try {
      const bank = this.getRevisionBank();
      const bankMap = new Map(bank.map(item => [item.questionId, item]));

      missedQuestions.forEach(item => {
        if (bankMap.has(item.questionId)) {
          const existing = bankMap.get(item.questionId);
          existing.mistakeCount = (existing.mistakeCount || 1) + 1;
          existing.lastMistakeDate = new Date().toISOString();
          existing.lastGivenAnswerIndex = item.selectedAnswerIndex;
        } else {
          bankMap.set(item.questionId, {
            questionId: item.questionId,
            subjectId: item.subjectId,
            topic: item.topic,
            mistakeCount: 1,
            addedDate: new Date().toISOString(),
            lastMistakeDate: new Date().toISOString(),
            lastGivenAnswerIndex: item.selectedAnswerIndex
          });
        }
      });

      const updated = Array.from(bankMap.values());
      localStorage.setItem(STORAGE_KEYS.REVISION_BANK, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to update revision bank:', e);
      return [];
    }
  },

  removeRevisionItem(questionId) {
    try {
      const bank = this.getRevisionBank().filter(item => item.questionId !== questionId);
      localStorage.setItem(STORAGE_KEYS.REVISION_BANK, JSON.stringify(bank));
      return bank;
    } catch (e) {
      return [];
    }
  },

  // ================= PREFERENCES & SETTINGS =================
  getPreferences() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? JSON.parse(data) : { theme: 'light', dailyGoal: 2 };
    } catch (e) {
      return { theme: 'light', dailyGoal: 2 };
    }
  },

  savePreferences(prefs) {
    try {
      const current = this.getPreferences();
      const updated = { ...current, ...prefs };
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
      return updated;
    } catch (e) {
      return { theme: 'light', dailyGoal: 2 };
    }
  },

  // ================= OVERALL STATS COMPUTATION =================
  getComputedStats() {
    const attempts = this.getAttempts();
    const streak = this.getStreak();
    const revisionBank = this.getRevisionBank();

    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        totalQuestionsAnswered: 0,
        streakDays: streak.currentStreak || 0,
        knowledgeGapsCount: revisionBank.length,
        subjectStats: {
          java: { attempts: 0, bestScore: 0, avgScore: 0 },
          htmlcss: { attempts: 0, bestScore: 0, avgScore: 0 },
          networks: { attempts: 0, bestScore: 0, avgScore: 0 }
        }
      };
    }

    const totalQuestions = attempts.reduce((acc, a) => acc + (a.totalQuestions || 0), 0);
    const avgScore = Math.round(
      attempts.reduce((acc, a) => acc + (a.percentage || 0), 0) / attempts.length
    );

    const subjectStats = {
      java: { attempts: 0, totalPct: 0, bestScore: 0 },
      htmlcss: { attempts: 0, totalPct: 0, bestScore: 0 },
      networks: { attempts: 0, totalPct: 0, bestScore: 0 }
    };

    attempts.forEach(a => {
      if (subjectStats[a.subjectId]) {
        subjectStats[a.subjectId].attempts += 1;
        subjectStats[a.subjectId].totalPct += a.percentage || 0;
        if (a.percentage > subjectStats[a.subjectId].bestScore) {
          subjectStats[a.subjectId].bestScore = a.percentage;
        }
      }
    });

    Object.keys(subjectStats).forEach(key => {
      const count = subjectStats[key].attempts;
      subjectStats[key].avgScore = count > 0 ? Math.round(subjectStats[key].totalPct / count) : 0;
    });

    return {
      totalAttempts: attempts.length,
      averageScore: avgScore,
      totalQuestionsAnswered: totalQuestions,
      streakDays: streak.currentStreak || 0,
      knowledgeGapsCount: revisionBank.length,
      subjectStats
    };
  },

  // ================= RESET ALL DATA =================
  resetAll() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
      localStorage.removeItem(STORAGE_KEYS.STREAK);
      localStorage.removeItem(STORAGE_KEYS.REVISION_BANK);
      // Keep theme preference if desired, or reset everything
      return true;
    } catch (e) {
      console.error('Failed to reset localStorage data:', e);
      return false;
    }
  },

  exportDataJson() {
    return JSON.stringify({
      attempts: this.getAttempts(),
      streak: this.getStreak(),
      revisionBank: this.getRevisionBank(),
      preferences: this.getPreferences(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  }
};

