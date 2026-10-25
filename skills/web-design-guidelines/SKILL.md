---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

## How It Works

1. Read the guidelines from `command.md` in this skill's folder
2. Read the specified files (or prompt user for files/pattern)
3. Check against all rules in the fetched guidelines
4. Output findings in the terse `file:line` format

## Guidelines Source

The rules live in `command.md`, next to this file (`${CLAUDE_SKILL_DIR}/command.md`), pinned to vercel-labs/web-interface-guidelines@434b7f91364665f2f733b310ec54809bf8f37937. Read that file; do not fetch the rules from the network. It contains all the rules and output format instructions.

## Usage

When a user provides a file or pattern argument:
1. Read `command.md` from this skill's folder
2. Read the specified files
3. Apply all rules from `command.md`
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.
