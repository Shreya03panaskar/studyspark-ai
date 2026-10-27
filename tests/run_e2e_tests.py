"""
StudySpark Automated E2E & Quality Assurance Test Suite
Tests data integrity, storage persistence, quiz execution, answer validation,
score calculation, explanations, revision bank, and live UI DOM rendering
using Headless Chrome.
"""

import subprocess
import os
import sys
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
CHROME_EXE = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

def run_headless_chrome(file_path):
    file_url = 'file:///' + file_path.replace('\\', '/')
    cmd = [
        CHROME_EXE,
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--allow-file-access-from-files',
        '--virtual-time-budget=5000',
        '--dump-dom',
        file_url
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
    return res.stdout

def run_tests():
    print("=" * 65)
    print("  StudySpark Automated Quality Assurance & Verification Suite")
    print("=" * 65)

    # 1. Run Core Logic & Persistence Test Harness
    harness_path = os.path.join(ROOT_DIR, 'tests', 'test_harness.html')
    dom = run_headless_chrome(harness_path)

    marker_start = '<pre id="test-results">'
    marker_end = '</pre>'

    if marker_start not in dom:
        print("[FAIL]: Could not locate test results in headless Chrome output.")
        print("DOM output snippet:", dom[:500])
        return False

    raw_json = dom.split(marker_start)[1].split(marker_end)[0].strip()
    try:
        results = json.loads(raw_json)
    except Exception as e:
        print(f"[FAIL]: Could not parse test results JSON: {e}")
        print("Raw text:", raw_json)
        return False

    passed = 0
    failed = 0

    print(f"\n--- Section 1: Logic, State & Persistence Tests ({len(results)} assertions) ---")
    for r in results:
        status = "[PASS]" if r['passed'] else "[FAIL]"
        print(f"{status} {r['test']}: {r['details']}")
        if r['passed']:
            passed += 1
        else:
            failed += 1

    # 2. Run UI DOM & Layout Verification on index.html
    print(f"\n--- Section 2: UI DOM & Layout Verification ---")
    index_path = os.path.join(ROOT_DIR, 'index.html')
    ui_dom = run_headless_chrome(index_path)

    ui_checks = [
        ("App Mounts Inside #app Container", '<div id="app"><aside class="sidebar' in ui_dom or 'id="app-sidebar"' in ui_dom),
        ("Brand Identity Rendered", 'StudySpark' in ui_dom and 'College' in ui_dom),
        ("Navigation Items Present", 'data-nav="dashboard"' in ui_dom and 'data-nav="quiz"' in ui_dom and 'data-nav="revision"' in ui_dom),
        ("Theme Toggle Present", 'id="theme-toggle-btn"' in ui_dom),
        ("Daily Learning Goal Banner Present", 'Daily Goal' in ui_dom),
        ("Subject Cards Rendered (Java, HTML/CSS, Networks)", 'Java Programming' in ui_dom and 'HTML &amp; CSS' in ui_dom and 'Computer Networks' in ui_dom),
        ("Streak Counter Present", 'Day Streak' in ui_dom or 'Day' in ui_dom),
        ("Accessible ARIA Roles Applied", 'role="main"' in ui_dom and 'aria-label="Main Navigation"' in ui_dom)
    ]

    for name, condition in ui_checks:
        status = "[PASS]" if condition else "[FAIL]"
        print(f"{status} UI Check: {name}")
        if condition:
            passed += 1
        else:
            failed += 1

    total = len(results) + len(ui_checks)
    print("\n" + "=" * 65)
    print(f"  Test Execution Complete: {passed}/{total} Passed, {failed} Failed.")
    print("=" * 65)

    return failed == 0

if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)

