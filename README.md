# TweakedBot — AI Codebase Auditor & Developer Assistant

A lightweight, CLI-based AI developer assistant built with **TypeScript, Node.js, and the OpenAI Responses API**.

TweakedBot explores local repositories, answers development questions, reviews code, and maintains conversation history between sessions.



# Inspiration
```
TweakedBot started with a simple idea: I wanted an AI assistant that could answer quick questions about a project or homework assignment without constantly copying and pasting code into ChatGPT.

I often found myself explaining project structures, sharing entire scripts, and hoping ChatGPT had enough context to answer accurately.

Rather than relying entirely on existing coding assistants, I wanted to build something simpler and focused on understanding code, not just generating it.

This project is also an opportunity to explore AI agent architecture, tool calling, persistent memory, and practical developer tooling from scratch.
```

## Example Output

<details>
<summary>View sample agent execution</summary>

# <span style="color: green;">~</span>start

### <strong><span style="color: #f2cc8f;">You:</span></strong>
```text 
Nov 18, 2026, 7:04 AM

Say hello to the github README TweakedBot!
```

><small><span style="color: #669bbc"><strong>Token usage:</strong></span> &nbsp;&nbsp;&nbsp; **Input:** 17152 &nbsp;&nbsp; | &nbsp;&nbsp; **Output:** 90 &nbsp;&nbsp; | &nbsp;&nbsp; **Cached:** 4535</small>


## <strong><span style="color: #f2cc8f;">TweakedBot:</span></strong>
Hello, GitHub README! 👋

# <span style="color: red;">~</span>end
</details>


## Overview

```
TweakedBot is a reusable, primarily read-only developer assistant that operates within the current project directory.
It uses an iterative agent loop to investigate files, execute permitted tools, and answer questions using retrieved repository information.

The model decides which tools to request, while the TypeScript application handles tool execution, validation, and conversation logging.

**Codebase analysis is read-only.** The application writes local Markdown conversation-history files but does not provide general-purpose code modification tools.
```

## Features

### AI Agent & Repository Analysis
- Multi-step tool execution using the OpenAI Responses API.
- Natural-language questions through a global CLI.
- File exploration, reading, and keyword searching.
- Git diff inspection for code reviews and regression analysis.
- Source-code explanations and debugging assistance.

### Persistent Conversation History
- Automatically saves completed conversations to Markdown.
- Loads a bounded (<em>12000 lines of the chat history</em>) excerpt of recent history for subsequent CLI runs.
- Supports follow-up questions using previously saved context.

### Execution Safeguards
- BE SURE YOU ARE IN THE CORRECT PROJECT BEFORE YOU RUN THE CLI! OTHERWISE A CHATHISTORY FOLDER WILL GENERATE AT THE ROOT OF THAT FOLDER. (<em>you can delete it, its just a hassle</em>)
- Restricted filesystem tools and argument validation.
- File-size, line-range, and search-result limits.
- Configurable agent step limit (when enabled).
- Token-usage reporting, including cached input tokens.
- Read-only repository investigation.


## How It Works

1. A user submits a question through the CLI.
2. TweakedBot loads recent conversation history when available.
3. The model receives the question, history context, instructions, and tool definitions.
4. The model requests tools as needed to investigate the repository.
5. TweakedBot executes the tools and returns their results to the model.
6. The process continues until the model produces a final answer or reaches the execution limit.
7. Completed conversations are saved locally for future sessions.

## Conversation Memory

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

# Installation & Setup

### Prerequisites:

- Node.js and npm
- Git
- <strong style="color: red">OpenAI API key <--- </strong>
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


## Project Progress

- [x] Implement filesystem inspection tools.
- [x] Add Git change inspection.
- [x] Implement multi-step agent orchestration.
- [x] Develop a reusable CLI.
- [x] Support natural-language repository questions.
- [x] Track API token usage.
- [x] Implement local Markdown conversation history.
- [x] Automatically save completed exchanges.
- [ ] add option to increase history context from 12000 lines to a user input value
- [ ] Make conversation History more robust and stable
- [ ] Add automatic history summarization and archival.
- [ ] Strengthen filesystem security and error recovery.
- [ ] Improve context retrieval and token efficiency.

## Project Status

Ongoing development focuses on improving memory management, execution reliability, <strong>security</strong>, and overall token efficiency.

## Notes & Limitations

- TweakedBot uses the current working directory as its project context <strong>`!THEREFORE BE SURE YOU ARE IN THE CORRECT DIRECTORY!`</strong>.
- Definitely add `tweakedBotChatHistory/` to the target project's `.gitignore`.
- Memory is limited to the context of the recent.md file in the tweakedBotChatHistory folder
- The agent currently uses a low end model, but if you fork or clone feel free to swap the model to a more expensive one with your  openAI 