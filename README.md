
# AI Codebase Auditor & Developer Assistant

## Overview

A read-only AI developer agent built with **TypeScript, Node.js, and the OpenAI API**.

This project explores **AI agent architecture, tool calling, and multi-step execution workflows** through the development of a reusable codebase auditing and repository analysis tool.

The agent is designed to inspect local repositories, gather relevant source code context, and assist developers in identifying potential bugs, regressions, and implementation issues.

> **Note:** The agent is designed for read-only analysis. It does not intentionally modify project files.

## Features

- **AI-Driven Tool Execution**
  - Uses an iterative agent loop to select tools, inspect results, and continue investigating a codebase.

- **Repository Exploration**
  - Navigates project directories.
  - Reads source files and specific line ranges.
  - Searches files for relevant code and keywords.

- **Git Integration**
  - Inspects staged and unstaged changes.
  - Supports code reviews and regression analysis.

- **Read-Only Design**
  - Restricts available tools to inspection operations.
  - Does not provide file modification tools.

- **Execution Safeguards**
  - Validates paths against the configured project directory.
  - Limits file sizes and search results to reduce unnecessary resource consumption.

## Tech Stack

- **Language:** TypeScript
- **Runtime:** Node.js
- **AI Integration:** OpenAI API
- **Version Control:** Git

## Project Goals

The primary objective is to develop a reusable developer tool while gaining hands-on experience with AI agent orchestration, tool development, and safe filesystem access.

### Planned Improvements

- [ ] Develop a reusable command-line interface (CLI).
- [ ] Implement an interactive `ask` workflow for natural-language repository questions.
- [ ] Add execution-step and token usage limits.
- [ ] Improve error handling and input validation.
- [ ] Expand automated testing and documentation.

## Project Status

**In Development**

The initial codebase auditing workflow and core filesystem tools have been implemented.

Current development focuses on improving reliability, expanding repository analysis capabilities, and introducing a reusable CLI interface.
