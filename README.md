# TweakedBot - AI Codebase Auditor & Developer Assistant


## Inspiration 
TweakedBot started with a simple idea: I wanted an AI assistant that could answer quick questions about a project or homework assignment without requiring me to constantly copy and paste code into ChatGPT.

I often found myself explaining my project structure, sharing entire scripts, and hoping ChatGPT had enough context to give me an accurate answer. I realized that if I could build an agent capable of exploring my codebase directly, I could eliminate much of that repetitive work and get answers based on the actual state of my project.

I initially considered using existing tools like Claude Code or GitHub Copilot. However, I wanted something simpler and more focused on helping me understand my code rather than just writing or fixing it for me.

This project is also an opportunity for me to get hands-on experience with AI agent development, tool calling, and building practical developer tools from scratch.

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



## Installation & Setup

### Prerequisites
- Node.js and npm
- Git
- OpenAI API key

### 1. Clone & Install

```bash
git clone https://github.com/WillyxWonka/agents_learning.git
cd agents_learning
npm ci
```

### 2. Configure API Key

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_api_key_here
```

**Never commit your `.env` file to Git.** API usage is billed to the account associated with your key.

### 3. Build & Link CLI

```bash
npm run build
npm link
```

This registers `tweakedBot` as a command on your computer.

### 4. Usage

Navigate to any project directory and run:

```bash
cd path/to/your/project
tweakedBot "Explain this project"
```

Other examples:

```bash
tweakedBot "Review my current Git changes"
tweakedBot "Find and explain the DFS implementation"
tweakedBot "What tests exist in this project?"
```

### Updating

```bash
cd path/to/agents_learning
git pull
npm ci
npm run build
```

### Notes
- The agent is designed to be read-only.
- Requires an internet connection and OpenAI API credits.
- Run `npm link` separately on each computer.
- The CLI uses the current working directory as its project context.


# Example Output 

<details>
<summary>View full terminal output</summary>

```text
~/OneDrive/Desktop/Dev/agent-learning $ npm run dev -- "Explain this project"

> agent-learning@1.0.0 dev
> tsx src/index.ts Explain this project


--- AGENT STEP 1 ---
MODEL REQUESTED: list_files
ARGUMENTS: {"path":"."}
TOOL RESULT: list_files completed

--- AGENT STEP 2 ---
MODEL REQUESTED: read_file
ARGUMENTS: {"path":"package.json"}
TOOL RESULT: read_file completed
MODEL REQUESTED: read_file
ARGUMENTS: {"path":"README.md"}
TOOL RESULT: read_file completed
MODEL REQUESTED: list_files
ARGUMENTS: {"path":"src"}
TOOL RESULT: list_files completed

--- AGENT STEP 3 ---
MODEL REQUESTED: read_file
ARGUMENTS: {"path":"src/index.ts"}
TOOL RESULT: read_file completed
MODEL REQUESTED: read_file
ARGUMENTS: {"path":"src/agent.ts"}
TOOL RESULT: read_file completed
MODEL REQUESTED: list_files
ARGUMENTS: {"path":"src/tools"}
TOOL RESULT: list_files completed

--- AGENT STEP 4 ---
MODEL REQUESTED: read_file
ARGUMENTS: {"path":"src/tools/definitions.ts"}
TOOL RESULT: read_file completed
MODEL REQUESTED: read_file
ARGUMENTS: {"path":"src/tools/dispatcher.ts"}
TOOL RESULT: read_file completed
MODEL REQUESTED: read_file
ARGUMENTS: {"path":"src/tools/filesystem.ts"}
TOOL RESULT: read_file completed
MODEL REQUESTED: read_file
ARGUMENTS: {"path":"src/tools/git.ts"}
TOOL RESULT: read_file completed

--- AGENT STEP 5 ---

FINAL ANSWER:
This is a small **TypeScript command-line agent for exploring and reviewing a code repository**. Its README describes it as an experiment in building a reusable, read-only auditor.

### How it works

1. **Accepts a question on the command line.** `src/index.ts` joins the command-line arguments into a prompt, calls `runAgent`, and prints the answer and token-usage totals. If no prompt isprovided, it prints a usage message.
2. **Asks an OpenAI model what to do.** `src/agent.ts` sends the prompt, instructions, and available tools to the Responses API. The model can either answer directly or request tools. The agent executes requested tools, sends their results back, and repeats, with a limit of eight steps.
3. **Provides repository-inspection tools:**
   - List a directory’s immediate contents
   - Read a text file or a line range
   - Search supported text files for a literal phrase
   - Retrieve staged and unstaged Git diffs and untracked-file names

   `src/tools/dispatcher.ts` validates tool arguments with Zod and routes requests to the filesystem or Git implementations.

### Guardrails and limits

The filesystem tools resolve paths within the project root, skip common generated or sensitive directories and files, limit file reads to 50,000 bytes, and cap searches at 20 results. Rangereads are limited to 200 lines. The agent’s instructions also tell the model to treat repository contents as untrusted and to support claims with retrieved evidence.

### Running it

The package scripts define:

```bash
npm run dev -- "your question about the repository"
npm run typecheck
```

The app imports `dotenv/config` and constructs an OpenAI client, so it expects the relevant API credentials in the environment. There is no configured test suite: the `test` script currently exits with “no test specified.”

In short, it is an **LLM-driven, tool-using repository investigator**: the model decides what to inspect, while the TypeScript tools perform bounded, read-only file and Git queries.
<br/>
{
    <br/>
  inputTokens: 11896,<br/>
  outputTokens: 675,<br/>
  cachedTokens: 4041,<br/>
  totalTokens: 12571<br/>
}
</details>
