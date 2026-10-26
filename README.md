AI Codebase Auditor & Developer Assistant

Overview

A read-only AI developer agent built with TypeScript, Node.js, and the OpenAI API. This project explores AI agent architecture, tool calling, and multi-step execution workflows through the development of a reusable codebase auditing and repository analysis tool.

The agent is designed to inspect local repositories, gather relevant source code context, and assist developers in identifying potential bugs, regressions, and implementation issues.

Rather than modifying project files, the agent focuses on read-only inspection and evidence-based analysis.

Features

AI-Driven Tool Execution: Uses an iterative agent loop to select tools, inspect results, and continue investigating a codebase.

Repository Exploration: Navigates project directories, reads source files, and searches for relevant code.

Git Integration: Inspects staged and unstaged changes to support code reviews.

Read-Only Design: Restricts agent tools to inspection operations without modifying repository files.

Execution Safeguards: Includes project-directory validation and resource limits to constrain filesystem operations.

Tech Stack

TypeScript

Node.js

OpenAI API

Git

Project Goals

The primary objective is to develop a reusable developer tool while gaining hands-on experience with AI agent orchestration and tool development.

Planned improvements include:

A command-line interface (CLI) for running the agent against different repositories.

An interactive ask workflow for natural-language questions about a codebase.

Additional safeguards for controlling agent execution and token usage.

Improved error handling, testing, and documentation.

Project Status

In Development

The initial codebase auditing workflow and core filesystem tools have been implemented. Development is ongoing to improve reliability, expand repository analysis capabilities, and introduce a reusable CLI interface.
