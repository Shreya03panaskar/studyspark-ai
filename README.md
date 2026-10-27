# StudySpark — College Technical Practice & Revision Platform

StudySpark is a distraction-free, responsive web platform designed for college students to practise core computer science topics, diagnose knowledge gaps, revise incorrect answers with verified explanations, and maintain consistent daily study streaks before exams.

---

## 1. Project Overview

College students often find themselves drowning in dense slides and disjointed notes right before exams. StudySpark transforms exam preparation into an active recall workflow:
1. **Practise:** Take focused 5-minute quizzes in **Java Programming**, **HTML & CSS**, and **Computer Networks**.
2. **Diagnose:** Instantly identify weak concepts through automatic score computation and verified technical explanations.
3. **Revise:** Automatically store every missed question in a personal **Revision Bank** (Knowledge Gaps) to review and drill until mastered.
4. **Track:** Maintain active day streaks, monitor completion toward daily learning goals, and track average mastery across subjects.

---

## 2. Key Features

### A. Academic Dashboard
* **Daily Learning Goal:** Visual tracker showing daily quiz target completion (e.g. 2 quizzes/day).
* **Subject Cards:** Detailed cards for Java, HTML/CSS, and Computer Networks displaying topic tags, question counts, and historical best scores.
* **Progress & Streak Metrics:** Live counts of quizzes attempted, overall average accuracy percentage, current day streak, and active knowledge gaps.
* **Recent Activity Log:** Tabular record of recent attempts with timestamps, scores, and one-click "Retake" actions.

### B. Interactive Quiz Experience
* **Subject & Topic Scoping:** Choose between all topics or isolate specific areas (e.g., *OOP Principles*, *Flexbox & Grid*, *TCP vs UDP*).
* **Verified Sample Question Bank:** 18 carefully checked, beginner-friendly college questions (6 per subject) with 4 options each.
* **Flexible Answer Selection:** Select and change options freely before submitting. Keyboard shortcut support (`1`, `2`, `3`, `4`) for rapid testing.
* **Question Navigator:** Interactive numbered pills showing current, answered, and unanswered states.
* **Missing-Answer Validation:** Prevents accidental submissions by detecting unanswered questions and displaying an alert dialog with direct jump links.
* **Instant Rationale & Scoring:** Full percentage calculation, mastery tier badges, option-level color coding (emerald green / rose red), and conceptual explanations for every question.
* **Post-Quiz Actions:** One-click "Retry This Quiz", "Back to Dashboard", and "Filter Incorrect Only" review toggle.

### C. Personal Revision Bank (Knowledge Gaps)
* Automatically captures every question answered incorrectly across quiz sessions.
* Displays frequency of mistakes (e.g., *"Missed 2 times"*) and the student's previous incorrect choice side-by-side with the correct answer.
* **"Drill Missed Questions" Mode:** Generates a custom quiz session containing only previously missed questions.
* **"Mastered" Action:** Allows students to mark resolved concepts and remove them from the gap list.
* Clear, encouraging empty states when no gaps exist.

### D. Search & Topic Discovery
* Real-time search indexing questions, topics, explanations, code snippets, and subjects.
* Subject filter pills (*All*, *Java*, *HTML & CSS*, *Computer Networks*) with live counter badges.
* Highlighted search terms and helpful empty states when queries return zero results.

### E. Settings & Usability
* **Theme Switching:** Instant toggle between Light Mode and Dark Mode with high-contrast WCAG 2.1 AA compliant color tokens.
* **Daily Goal Configuration:** Set daily study targets (1, 2, 3, or 5 quizzes per day).
* **100% Local Privacy:** Operates entirely within `localStorage` with zero remote servers, tracking cookies, or external accounts.
* **Export Progress:** Download complete quiz history, streaks, and knowledge gaps as a JSON backup.
* **Reset Progress:** Safe data purge with an explicit confirmation modal.

---

## 3. Technology Stack & Architectural Explanation (For Judges)

### Architecture Highlights
* **Zero-Build, Pure Web Standards:** Built using modern ES6 JavaScript Modules (`type="module"`) and vanilla CSS Custom Properties.
* **Component-Based Modular Hierarchy:**
  ```
  studyspark-ai/
  ├── index.html                 # Semantic HTML5 entry point
  ├── product.md                 # Product specifications & MVP scope
  ├── ui.md                      # UI/UX design tokens & wireframes
  ├── engineering.md             # Engineering architecture plan
  ├── tests/
  │   ├── test_harness.html      # Headless test runner harness
  │   └── run_e2e_tests.py       # Automated QA verification script
  └── src/
      ├── main.js                # App state controller & view router
      ├── styles/
      │   └── main.css           # Design system tokens (Navy/Violet/Blue)
      ├── data/
      │   └── questions.js       # Curated sample question bank (18 questions)
      ├── services/
      │   ├── storage.js         # Type-safe localStorage manager
      │   └── quizEngine.js      # Session state machine & score calculator
      └── components/
          ├── Icons.js           # Lightweight SVG icon generator
          ├── Navigation.js      # Responsive sidebar & mobile header
          ├── Dashboard.js       # Hero banner, stats row, subject grid
          ├── QuizView.js        # Active quiz runner & validation modal
          ├── RevisionView.js    # Knowledge gaps tracker & drill launcher
          ├── SearchView.js      # Live search & filter pills
          └── SettingsView.js    # Theme toggle & storage management
  ```
* **Why This Architecture?**
  1. **Maximum Portability:** Requires no Node.js compilation, npm install, or bundler overhead. Opens directly in any browser or local HTTP server.
  2. **100% Offline & Private:** Zero backend server requirement ensures the app works without network connectivity.
  3. **High Hackathon Velocity:** Easy to inspect, understand, debug, and maintain for beginner and senior engineers alike.

---

## 4. Prerequisites & Running the Application Locally

### Prerequisites
* Any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
* *(Optional)* Python 3.x (to run a local HTTP server).

### Running StudySpark Locally

#### Option A: Local Python Web Server (Recommended)
```bash
# Navigate to the repository root
cd studyspark-ai

# Start local server on port 8000
python -m http.server 8000
```
Open your browser and navigate to:
```
http://localhost:8000
```

#### Option B: Direct File Access via Chrome
Because StudySpark utilizes standard ES6 modules, Chrome can load the project directly using the `--allow-file-access-from-files` flag:
```bash
chrome.exe --allow-file-access-from-files "path\to\studyspark-ai\index.html"
```

---

## 5. Automated Testing Instructions & Verification Results

StudySpark includes an automated end-to-end quality assurance test suite in `tests/run_e2e_tests.py` that utilizes headless Chrome to evaluate data integrity, quiz execution, answer validation, score calculation, revision bank recording, and live DOM rendering.

### Executing the Test Suite
```bash
python tests/run_e2e_tests.py
```

### Actual Verification Results
```
=================================================================
  StudySpark Automated Quality Assurance & Verification Suite
=================================================================

--- Section 1: Logic, State & Persistence Tests (80 assertions) ---
[PASS] Subject Count: Expected 3 subjects, got 3
[PASS] Total Questions: Expected at least 18 questions, got 18
[PASS] Subject Question Count: Java Programming: Has 6 questions
[PASS] Question java-1 Options: Has 4 options
[PASS] Question java-1 Correct Index: Correct index is valid
[PASS] Question java-1 Explanation: Has clear explanation
...
[PASS] Storage Reset: Attempts Empty: Attempts: 0
[PASS] Storage Reset: Gaps Empty: Gaps: 0
[PASS] Storage Reset: Computed Stats Empty
[PASS] Quiz Session Created: Questions: 6
[PASS] Next Question Navigation
[PASS] Prev Question Navigation
[PASS] Unanswered Validation Detects Missing: Detected 6 unanswered
[PASS] Answer Selection & Modification
[PASS] Quiz Submission Result: Score: 6/6 (100% Mastery A+)
[PASS] Attempt Persisted to LocalStorage
[PASS] Streak Incremented: Streak: 1
[PASS] Net Result has 1 Incorrect
[PASS] Revision Bank Recorded Mistake: Bank items: 1
[PASS] Drill Session Created with Mistake
[PASS] Knowledge Gap Resolved/Removed: Remaining: 0
[PASS] Theme Saved to Dark
[PASS] Daily Goal Saved to 3

--- Section 2: UI DOM & Layout Verification ---
[PASS] UI Check: App Mounts Inside #app Container
[PASS] UI Check: Brand Identity Rendered
[PASS] UI Check: Navigation Items Present
[PASS] UI Check: Theme Toggle Present
[PASS] UI Check: Daily Learning Goal Banner Present
[PASS] UI Check: Subject Cards Rendered (Java, HTML/CSS, Networks)
[PASS] UI Check: Streak Counter Present
[PASS] UI Check: Accessible ARIA Roles Applied

=================================================================
  Test Execution Complete: 88/88 Passed, 0 Failed.
=================================================================
```

---

## 6. List of Implemented Features & Known Limitations

### Implemented Features
* [x] **Curated Technical Questions:** 18 verified questions covering Java OOP/memory/exceptions, HTML/CSS box model/flexbox/specificity, and Computer Networks OSI/TCP/UDP/IP addressing.
* [x] **Full Quiz Lifecycle:** Topic selection, option selection/change, keyboard shortcuts (`1`-`4`), question navigation, unanswered questions validation dialog, scoring calculation, and instant explanations.
* [x] **Persistent Revision Bank:** Automatically logs missed questions with mistake counts, lets students review conceptual explanations, and launches custom drill quizzes on missed topics.
* [x] **Live Search & Topic Filter:** Real-time query matching across questions, topics, and technical explanations.
* [x] **Complete Local Persistence:** Attempts, streaks, knowledge gaps, and theme preferences stored in `localStorage`.
* [x] **Light & Dark Themes:** Accessible, high-contrast theme toggle persisted across reloads.
* [x] **Data Export & Safe Reset:** One-click JSON backup and confirmed data purge.

### Known Limitations
* **Single Device Storage:** Progress is tied to the student's browser `localStorage`; progress does not sync across different physical computers.
* **Curated Sample Scope:** The MVP includes 18 curated sample questions across 3 subjects; expanding the question bank is done via `src/data/questions.js`.

---

## 7. AI-Assisted Changes & Transparency Log

All modifications in this project were generated transparently with strict quality controls:
1. **Planning Phase:** Authored `product.md`, `ui.md`, and `engineering.md` to define product boundaries and technical specifications.
2. **Design System:** Created `src/styles/main.css` establishing a navy, blue, and violet palette with CSS custom properties for Light/Dark modes.
3. **Data & Logic:** Authored `src/data/questions.js`, `src/services/storage.js`, and `src/services/quizEngine.js` with verified questions and explicit labels indicating curated sample content (no fake AI claims).
4. **UI Components:** Created modular ES6 views (`Dashboard.js`, `QuizView.js`, `RevisionView.js`, `SearchView.js`, `SettingsView.js`, `Navigation.js`, `Icons.js`).
5. **Quality Assurance:** Created and executed `tests/run_e2e_tests.py` using Headless Google Chrome, achieving 88 passing assertions across data logic, persistence, and DOM rendering with 0 runtime errors.
