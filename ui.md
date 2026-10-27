# StudySpark — UI/UX Design Specification

## 1. Visual Style & Design System

StudySpark is designed around an **"Energetic Academic"** aesthetic: distraction-free, high-contrast, modern, and motivating. It avoids dark, dreary textbook vibes in favor of clean card-based layouts and crisp typography that help students focus under exam pressure.

### Typography
* **Primary Sans-Serif (Body & UI):** `Inter` or `Plus Jakarta Sans`
  * Headings: `font-bold` / `font-semibold` with tight tracking (`tracking-tight`)
  * Body: `text-base` (16px) or `text-sm` (14px) with high readability line-height (`leading-relaxed`)
* **Monospace (Formulas, Equations, Code):** `JetBrains Mono` or `Fira Code`

### Color Palette (Tailwind Tokens)

| Role | Tailwind Class | Hex Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Brand Primary** | `indigo-600` | `#4F46E5` | Primary buttons, active tabs, progress bars |
| **Brand Accent / Spark**| `amber-500` | `#F59E0B` | Badges, streaks, "Exam High-Yield" callouts |
| **Success / Correct** | `emerald-600` | `#059669` | Correct quiz options, mastered flashcards |
| **Danger / Incorrect** | `rose-600` | `#E11D48` | Incorrect quiz options, needs review tags |
| **Background (Light)**| `slate-50` | `#F8FAFC` | Main application background |
| **Card Surface** | `white` | `#FFFFFF` | Elevated components with subtle borders |
| **Text Primary** | `slate-900` | `#0F172A` | High contrast headings & primary text |
| **Text Muted** | `slate-500` | `#64748B` | Subheadings, timestamps, secondary labels |
| **Borders** | `slate-200` | `#E2E8F0` | Clean structural outlines |

### Spacing & Elevation
* **Base Unit:** 4px / 8px grid (`p-2`, `p-4`, `p-6`, `p-8`).
* **Radius:** Consistent rounded cards (`rounded-xl` or `rounded-2xl` for containers, `rounded-lg` for buttons/inputs).
* **Elevation:** Minimal flat shadows (`shadow-sm` on rest, `shadow-md` on hover, `shadow-xl` for modals).

### Reusable UI Components
1. **Button:** `Primary` (Indigo filled), `Secondary` (Slate outline), `Danger` (Rose subtle), `Ghost` (Icon-only).
2. **Badge / Pill:** High-yield indicators, topic tags, difficulty badges (`bg-indigo-50 text-indigo-700`).
3. **Progress Bar:** Animated fill showing quiz progress and study set mastery percentage.
4. **Card Container:** White background, subtle border, smooth hover transitions.
5. **Modal / Drawer:** Backdrop blur (`backdrop-blur-sm bg-slate-900/40`) with focus-trapped content.

---

## 2. Screen-by-Screen Layout & Wireframes

### Screen 1: Dashboard / Home
* **Header:** StudySpark logo with spark icon, "New Study Set" CTA, and Quick Sample loader.
* **Hero / Quick Stats Strip:**
  * Total Study Sets Created
  * Quizzes Completed & Average Score
  * Days until nearest upcoming exam
* **Study Sets Grid:**
  * Cards showing Course Name, Topic, Date Created, Question count, and quick links to (Cheat Sheet / Quiz / Cards).
  * 3-dot action menu: Duplicate, Export Markdown, Delete.
* **Empty State:** Visual placeholder with pre-loaded demo buttons (e.g., *"Try Biology 101 Sample"*).

### Screen 2: Ingestion & Creation Modal / Drawer
* **Tabbed Input Switcher:**
  * **Tab A (File Upload):** Drag-and-drop zone for `.pdf` files up to 20MB with page count and size indicator.
  * **Tab B (Paste Text):** Multi-line auto-resizing text area for syllabus, lecture transcripts, or notes.
  * **Tab C (YouTube / Link):** URL input field for lecture video transcription processing.
* **Configuration Metadata:**
  * Course Name (e.g., "CS 101: Data Structures")
  * Exam Date (Date picker for countdown generation)
  * Target Focus (e.g., "Midterm Prep", "Finals Cram")
* **Action Footer:** Cancel button + Primary "Generate Study Set" button with animated spark icon.

### Screen 3: Study Workspace (Core Hub)
The workspace provides a top navigation bar with breadcrumbs and 4 dedicated tabs:

```
[ ← Back to Dashboard ]   CS 101: Binary Trees & Graphs   [ Export ] [ Delete ]
┌─────────────────────────────────────────────────────────────────────────────┐
│  [⚡ Cheat Sheet]     [❓ Practice Quiz]     [🗂 Flashcards]     [📅 Schedule]│
└─────────────────────────────────────────────────────────────────────────────┘
```

#### View A: High-Yield Cheat Sheet
* **Toolbar:** "Copy Text", "Print / Save PDF", "Search Concepts".
* **Layout:** 2-column or clean article view featuring:
  * *Key Principles & Definitions:* Card with highlighted bold terms.
  * *Formulas & Complexity:* Syntax-highlighted code blocks or KaTeX math expressions.
  * *Exam Traps (Warning Callouts):* Amber alert boxes highlighting common mistakes students make on exams.

#### View B: Interactive Quiz Runner
* **Top Status:** Question counter (e.g., `Question 4 of 10`) + Progress bar.
* **Question Card:** Clear, large question prompt with relevant code/formula snippet if needed.
* **Option Buttons:** 4 large clickable choices (`A`, `B`, `C`, `D`).
  * *Before selection:* Neutral hover state.
  * *After selection:* Instant feedback! Correct choice illuminates in emerald green with checkmark; wrong choice illuminates in rose red.
  * *Explanation Box:* Pops open immediately below options with a thorough breakdown:
    > **Explanation:** Option B is correct because quicksort's worst-case time is $O(n^2)$ when the pivot is always the smallest or largest element.
* **Navigation:** "Next Question" button activates after an answer is submitted.
* **Quiz Results Screen:** Radial score chart, pass/fail badge, breakdown of missed questions, and a "Retest Weak Points" button.

#### View C: Active Recall Flashcards
* **Deck Controls:** Card counter (`Card 3 / 15`), Shuffle button, Reset button.
* **Flashcard Element:**
  * Large centered card with smooth 3D flip animation.
  * Front: Question / Concept / Definition prompt.
  * Back: Explanation / Answer / Key formula.
  * Click card or tap `Spacebar` to flip.
* **Response Actions:**
  * Red button: *"Needs Review"* (press `←` key)
  * Green button: *"Got It"* (press `→` key)
* **Summary Banner:** Real-time count of mastered vs. learning cards.

#### View D: Exam Countdown & Daily Study Schedule
* **Header:** Countdown pill (e.g., *"4 Days Until Exam"*).
* **Schedule Timeline:** Grouped by days (e.g., "Day 1: Foundations", "Day 2: Algorithms", "Day 3: Practice & Edge Cases").
* **Interactive Checkbox Items:** Click to cross off tasks, with auto-saving to local storage.

---

## 3. Desktop vs. Mobile Layouts

### Desktop Layout ($\ge 1024\text{px}$)
* Full-width container (`max-w-6xl mx-auto px-6`).
* 3-column grid for dashboard study sets.
* Study workspace displays content with comfortable reading widths (65–75 characters per line).
* Sticky tab navigation on scroll.

### Mobile Layout ($< 768\text{px}$)
* Single-column vertical stack (`px-4`).
* Dashboard cards become full-width touch cards.
* Study workspace tabs switch to a horizontal swipeable pill bar or segmented control.
* Flashcards scale to 85vw width with full-width touch buttons for "Needs Review" / "Got It".
* Sticky bottom action bar for quiz next buttons to ensure easy thumb reachability.
* All touch targets maintain a minimum size of $48\times 48\text{px}$.

---

## 4. UI States & Edge Cases

| State | Visual Treatment | Microcopy / Action |
| :--- | :--- | :--- |
| **Loading (Ingestion)** | Animated pulsating spark icon + stepped progress bar | *"Reading slides... Extracting high-yield concepts... Drafting practice questions (Step 2/3)"* |
| **Loading (Skeleton)** | Shimmering gray wireframe blocks matching card shapes | Prevents layout shift while content renders |
| **Empty Dashboard** | Friendly spark illustration with two prominent action cards | *"You haven't added any study sets yet. Upload your first lecture slide deck or try a pre-loaded sample."* |
| **Error (Parsing)** | Rose alert banner with retry button | *"We couldn't extract text from this PDF. It may be password-protected or image-only. Try pasting the raw text instead."* |
| **Error (API/Quota)** | Amber warning toast with fallback mode | *"AI generation timed out. Falling back to local offline sample generator or try again in a few moments."* |
| **Success (Quiz Complete)**| Confetti burst animation + score celebration badge | *"Great job! You scored 80%. Review the 2 missed questions below to lock in an A."* |

---

## 5. Accessibility (a11y) Requirements

* **Contrast Compliance:** All text colors must adhere to WCAG 2.1 AA standards (minimum contrast ratio of 4.5:1 for standard text and 3:1 for large text).
* **Keyboard Navigation:**
  * `Tab` and `Shift+Tab` navigate all interactive elements in logical order.
  * Quiz options support number keys (`1`, `2`, `3`, `4`) and `Enter`.
  * Flashcards support `Space` to flip, `ArrowLeft` for review, and `ArrowRight` for mastered.
* **Screen Reader Support:**
  * Dynamic quiz feedback regions use `aria-live="polite"`.
  * Flip cards use `aria-expanded` and clear descriptive labels.
  * Form inputs have explicitly connected `<label>` tags with matching `htmlFor` attributes.
* **Reduced Motion:** All CSS transitions and animations must respect `@media (prefers-reduced-motion: reduce)`.

