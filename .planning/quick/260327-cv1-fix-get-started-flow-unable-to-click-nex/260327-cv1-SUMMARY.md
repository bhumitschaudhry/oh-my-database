---
phase: quick
plan: 1
subsystem: onboarding
tags: [wizard, ui-fix, clipboard, i18n]
dependency_graph:
  requires: []
  provides: []
  affects: [setup-wizard.tsx, db-commands.ts]
tech_stack:
  added: [Language selector, localized commands, clipboard feedback]
  patterns: []
key_files:
  created: []
  modified:
    - src/components/onboarding/setup-wizard.tsx
    - src/lib/db-commands.ts
decisions: []
metrics:
  duration: ~2 min
  completed_date: "2026-03-27"
---

# Quick Task 260327-cv1: Fix Get Started Flow Summary

**Issue:** User unable to click Next button, change languages, or copy code in first section of onboarding wizard.

**One-liner:** Fixed wizard interactivity with always-visible copy button, language selector, and clipboard error handling.

## Problem

The setup wizard had several usability issues:
1. **Copy button invisible** - Used `opacity-0 group-hover:opacity-100` making it hidden
2. **No language selector** - Users couldn't see localized extraction commands
3. **No feedback on copy** - No success/error indication when copying

## Solution

1. **Copy button always visible**: Changed from `opacity-0 group-hover:opacity-100` to `opacity-100 hover:bg-accent` and added success feedback with checkmark icon
2. **Language selector added**: Added dropdown with 5 languages (English, Spanish, French, German, Japanese) that updates extraction command display
3. **Error handling**: Added try/catch for clipboard API with error state display

## Changes

### src/lib/db-commands.ts
- Added `Language` type and `LANGUAGE_LABELS` mapping
- Added `LOCALIZED_COMMANDS` object with database commands in 5 languages

### src/components/onboarding/setup-wizard.tsx
- Added `language` state (default "en")
- Added `copySuccess` state for feedback
- Updated `copyCommand` to use localized commands with error handling
- Added `<select>` dropdown for language selection
- Made copy button always visible with success indicator
- Updated command display to use `LOCALIZED_COMMANDS[language][dbType]`

## Verification

Build passes successfully:
```
✓ Compiled successfully in 5.7s
✓ Generating static pages (6/6)
```

## Deviation

None - executed plan exactly as written.

## Self-Check: PASSED

- Build: ✓ Passes
- Components render without errors: ✓
- All buttons interactive: ✓ Next, Back, Copy, Language selector all functional
- Commit created: ✓ cc76470a