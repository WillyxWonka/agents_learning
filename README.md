# TweakedBot — AI Codebase Auditor & Developer Assistant

A lightweight, CLI-based AI developer assistant built with **TypeScript, Node.js, and the OpenAI Responses API**.

TweakedBot explores local repositories, answers development questions, reviews code, and maintains conversation history between sessions.

## Inspiration

TweakedBot started with a simple idea: I wanted an AI assistant that could answer quick questions about a project or homework assignment without constantly copying and pasting code into ChatGPT.

I often found myself explaining project structures, sharing entire scripts, and hoping ChatGPT had enough context to answer accurately.

Rather than relying entirely on existing coding assistants, I wanted to build something simpler and focused on **understanding code, not just generating it**.

This project is also an opportunity to explore AI agent architecture, tool calling, persistent memory, and practical developer tooling from scratch.

## Overview

TweakedBot is a reusable, primarily read-only developer assistant that operates within the current project directory.

It uses an iterative agent loop to investigate files, execute permitted tools, and answer questions using retrieved repository information.

The model decides which tools to request, while the TypeScript application handles tool execution, validation, and conversation logging.

**Codebase analysis is read-only.** The application writes local Markdown conversation-history files but does not provide general-purpose code modification tools.

## Features

### AI Agent & Repository Analysis
- Multi-step tool execution using the OpenAI Responses API.
- Natural-language questions through a global CLI.
- File exploration, reading, and keyword searching.
- Git diff inspection for code reviews and regression analysis.
- Source-code explanations and debugging assistance.

### Persistent Conversation History
- Automatically saves completed conversations to Markdown.
- Loads a bounded excerpt of recent history for subsequent CLI runs.
- Maintains project-specific context between sessions.
- Supports follow-up questions using previously saved context.

### Execution Safeguards
- Restricted filesystem tools and argument validation.
- File-size, line-range, and search-result limits.
- Configurable agent step limit (when enabled).
- Token-usage reporting, including cached input tokens.
- Read-only repository investigation, with designated history-file writes.

## Tech Stack

| Technology | Purpose |
|---|---|
| TypeScript | Agent orchestration and tool implementations |
| Node.js | CLI runtime and filesystem operations |
| OpenAI Responses API | Model inference and function calling |
| Zod | Tool argument validation |
| Git | Repository change inspection |
| Markdown | Local conversation history |

## How It Works

1. A user submits a question through the CLI.
2. TweakedBot loads recent conversation history when available.
3. The model receives the question, history context, instructions, and tool definitions.
4. The model requests tools as needed to investigate the repository.
5. TweakedBot executes the tools and returns their results to the model.
6. The process continues until the model produces a final answer or reaches the execution limit.
7. Completed conversations are saved locally for future sessions.

### Conversation Memory

Each project can maintain its own conversation history:

```text
your-project/
├── src/
├── package.json
└── tweakedBotChatHistory/
    └── recent.md
```

Recent exchanges are stored in Markdown and can be supplied to future model requests.

History is stored locally rather than relying solely on the API's response chain. This allows context to persist across independent CLI executions.

To manage context size, only a limited portion of recent history is provided. Older exchanges may not remain available indefinitely.

## Installation & Setup

### Prerequisites

- Node.js and npm
- Git
- OpenAI API key
- Internet connection

### 1. Clone & Install

```bash
git clone https://github.com/WillyxWonka/agents_learning.git
cd agents_learning
npm ci
```

### 2. Configure API Key

Create a `.env` file in TweakedBot's installation directory:

```env
OPENAI_API_KEY=your_api_key_here
```

**Never commit `.env` files or API credentials to Git.**

API usage is billed to the account associated with the provided key.

### 3. Build & Link CLI

```bash
npm run build
npm link
```

This registers the `tweakedBot` command globally on your local machine.

### 4. Usage

Navigate to a project directory:

```bash
cd path/to/your/project
tweakedBot "Explain this project"
```

Other examples:

```bash
tweakedBot "Review my current Git changes"
tweakedBot "Find and explain the DFS implementation"
tweakedBot "What tests exist in this project?"
tweakedBot "What were we working on previously?"
```

### Optional Step Limit

If supported by the current build, provide a number after the prompt to override the default execution-step limit:

```bash
tweakedBot "Review my current Git changes" 5
```

### Updating TweakedBot

From the TweakedBot installation directory:

```bash
git pull
npm ci
npm run build
```

Existing `npm link` installations normally use the rebuilt files without requiring another link operation. Run `npm link` separately on each new computer.

## Example Output

<details>
<summary>View sample agent execution</summary>

```text
--- AGENT STEP 1 ---
MODEL REQUESTED: list_files
ARGUMENTS: {"path":"src"}
TOOL RESULT: list_files completed

MODEL REQUESTED: read_file
ARGUMENTS: {"path":"package.json"}
TOOL RESULT: read_file completed

--- AGENT STEP 2 ---
MODEL REQUESTED: read_file
ARGUMENTS: {"path":"src/agent.ts"}
TOOL RESULT: read_file completed

--- AGENT STEP 3 ---

FINAL ANSWER:
This project implements a TypeScript-based CLI
developer assistant using the OpenAI Responses API.

The model selects tools to inspect the repository,
while the application executes those tools and
returns their results for further analysis.
```

*Abbreviated illustrative output. Actual tool calls and token usage vary by request.*

</details>

## Project Progress

- [x] Implement filesystem inspection tools.
- [x] Add Git change inspection.
- [x] Implement multi-step agent orchestration.
- [x] Develop a reusable CLI.
- [x] Support natural-language repository questions.
- [x] Track API token usage.
- [x] Implement local Markdown conversation history.
- [x] Automatically save completed exchanges.
- [ ] Make conversation History more robust and stable
- [ ] Add automatic history summarization and archival.
- [ ] Strengthen filesystem security and error recovery.
- [ ] Expand automated testing.
- [ ] Improve context retrieval and token efficiency.

## Project Status

**In Active Development**

TweakedBot currently supports repository inspection, natural-language questions, Git analysis, and persistent local conversation history.

Ongoing development focuses on improving memory management, execution reliability, security, and overall token efficiency.

## Notes & Limitations

- TweakedBot uses the current working directory as its project context <strong>`! THEREFORE BE SURE YOU ARE IN THE CORRECT DIRECTORY !`</strong>.
- Conversation history may contain user questions and model responses, including source-code excerpts.
- Consider adding `tweakedBotChatHistory/` to the target project's `.gitignore`.
- Repository content retrieved by tools may be transmitted to the configured OpenAI API.
- Memory is limited to the context explicitly loaded or retrieved for each run.
- The agent is intended for development assistance, not unattended code modification.