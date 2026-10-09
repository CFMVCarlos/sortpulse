#!/usr/bin/env bash
set -e

MSG_FILE="$1"
if [ ! -f "$MSG_FILE" ]; then
    echo "Error: commit message file not found: $MSG_FILE" >&2
    exit 1
fi

# Read first line of commit message (ignoring comments)
FIRST_LINE=$(grep -v '^[[:space:]]*#' "$MSG_FILE" | head -n 1)

if [ -z "$FIRST_LINE" ]; then
    echo "❌ Error: Commit message cannot be empty." >&2
    exit 1
fi

# Allow merge, fixup, squash, revert commits automatically
if echo "$FIRST_LINE" | grep -qE '^(Merge |fixup! |squash! |Revert )'; then
    exit 0
fi

# Conventional Commit regex
# Format: <type>(<scope>)?: <description>
PATTERN='^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-zA-Z0-9_\-\./]+\))?(!)?: .+$'

if ! echo "$FIRST_LINE" | grep -qE "$PATTERN"; then
    echo "❌ Invalid commit message format!" >&2
    echo "--------------------------------------------------" >&2
    echo "Your commit message: \"$FIRST_LINE\"" >&2
    echo "--------------------------------------------------" >&2
    echo "Commit messages must follow the Conventional Commits specification:" >&2
    echo "  <type>(<scope>): <subject>" >&2
    echo "" >&2
    echo "Allowed types:" >&2
    echo "  feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert" >&2
    echo "" >&2
    echo "Examples:" >&2
    echo "  feat(sorter): add shell sort algorithm" >&2
    echo "  fix(ui): prevent canvas overflow on mobile screens" >&2
    echo "  docs: update README with complexity comparison table" >&2
    echo "  chore(deps): update npm packages" >&2
    echo "--------------------------------------------------" >&2
    exit 1
fi

# Validate subject length (max 72 chars recommended)
if [ ${#FIRST_LINE} -gt 100 ]; then
    echo "⚠️ Warning: Commit message header is longer than 100 characters (${#FIRST_LINE} chars)." >&2
fi

echo "✅ Commit message passed Conventional Commits validation."
exit 0
