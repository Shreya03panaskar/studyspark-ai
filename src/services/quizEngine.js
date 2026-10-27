/**
 * StudySpark Quiz Engine
 * Manages active quiz session, navigation, answer validation, score computation,
 * and state transitions.
 */

import { getQuestionsBySubject, getQuestionById } from '../data/questions.js';
import { StorageService } from './storage.js';

export class QuizSession {
  constructor(subject, questions, topicTitle = 'All Topics') {
    this.subject = subject;
    this.questions = questions;
    this.topicTitle = topicTitle;
    this.currentIndex = 0;
    this.userAnswers = {}; // { [questionId]: selectedOptionIndex }
    this.isSubmitted = false;
    this.result = null;
    this.startTime = Date.now();
  }

  getCurrentQuestion() {
    return this.questions[this.currentIndex] || null;
  }

  selectAnswer(questionId, optionIndex) {
    if (this.isSubmitted) return;
    this.userAnswers[questionId] = optionIndex;
  }

  getSelectedAnswer(questionId) {
    return this.userAnswers[questionId] !== undefined ? this.userAnswers[questionId] : null;
  }

  isAnswered(index) {
    const q = this.questions[index];
    return q && this.userAnswers[q.id] !== undefined;
  }

  getAnsweredCount() {
    return Object.keys(this.userAnswers).length;
  }

  getUnansweredQuestions() {
    const unanswered = [];
    this.questions.forEach((q, idx) => {
      if (this.userAnswers[q.id] === undefined) {
        unanswered.push({ index: idx, number: idx + 1, question: q });
      }
    });
    return unanswered;
  }

  goToQuestion(index) {
    if (index >= 0 && index < this.questions.length) {
      this.currentIndex = index;
    }
  }

  nextQuestion() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex += 1;
    }
  }

  prevQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex -= 1;
    }
  }

  submit() {
    if (this.isSubmitted) return this.result;

    let correctCount = 0;
    const incorrectQuestions = [];

    this.questions.forEach(q => {
      const selectedIndex = this.userAnswers[q.id];
      const isCorrect = selectedIndex === q.correctIndex;

      if (isCorrect) {
        correctCount += 1;
      } else {
        incorrectQuestions.push({
          questionId: q.id,
          subjectId: q.subjectId,
          topic: q.topic,
          questionText: q.question,
          selectedAnswerIndex: selectedIndex !== undefined ? selectedIndex : null,
          correctAnswerIndex: q.correctIndex,
          explanation: q.explanation
        });
      }
    });

    const totalQuestions = this.questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    let tier = 'Needs Practice';
    if (percentage >= 90) tier = 'Mastery (A+)';
    else if (percentage >= 75) tier = 'Proficient (B+)';
    else if (percentage >= 60) tier = 'Developing (C)';

    this.isSubmitted = true;
    this.result = {
      score: correctCount,
      totalQuestions,
      percentage,
      tier,
      durationSeconds: Math.round((Date.now() - this.startTime) / 1000),
      incorrectQuestions,
      userAnswers: { ...this.userAnswers }
    };

    // Automatically persist attempt to localStorage
    StorageService.saveAttempt({
      subjectId: this.subject.id,
      subjectName: this.subject.name,
      topic: this.topicTitle,
      score: correctCount,
      totalQuestions,
      percentage,
      tier,
      incorrectQuestions
    });

    return this.result;
  }
}

export function createQuizSession(subject, topic = 'all') {
  let questions = getQuestionsBySubject(subject.id);
  let topicTitle = 'All Topics';

  if (topic && topic !== 'all') {
    questions = questions.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
    topicTitle = topic;
  }

  return new QuizSession(subject, questions, topicTitle);
}

export function createRevisionQuizSession(revisionItems) {
  const questions = revisionItems
    .map(item => getQuestionById(item.questionId))
    .filter(Boolean);

  const mockSubject = {
    id: 'revision',
    name: 'Knowledge Gaps Revision',
    category: 'Targeted Review',
    colorKey: 'networks',
    description: 'Reviewing previously missed questions to turn weak spots into strengths.'
  };

  return new QuizSession(mockSubject, questions, 'Mistake Bank Drill');
}

