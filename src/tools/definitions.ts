export const tools = [

    {
        type: "function" as const,
        name: "list_files",
        description: "Lists one directory level of project files and directories. This tool is not recursive.",
        strict: true,

        parameters: {

            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: 'Project-relative directory path. Use "." for the project root.'
                }
            },
            required: ["path"],
            additionalProperties: false
        }
    },

    {
        type: "function" as const,
        name: "read_file",
        description: "Reads the text contents of a project file.",
        strict: true,

        parameters: {

            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: "Project-relative path of the file to read."
                }

            },
            required: ["path"],
            additionalProperties: false
        }
    },

    {
        type: "function" as const,
        name: "search_files",
        description: "Recursively performs a case-insensitive literal substring search through supported project text files and returns up to 20 matching lines.",
        strict: true,

        parameters: {

            type: "object",
            properties: {
                path: {
                    type: "string",
                    description: 'Directory to search. Use "." for the project root.'
                },
                query: {
                    type: "string",
                    description: "Text to search for."
                }

            },
            required: [ "path", "query" ],
            additionalProperties: false
        }
    },

    {
        type: "function" as const,
        name: "get_git_diff",
        description: "Returns staged and unstaged Git diffs and the names of untracked files. Use read_file or read_file_range if an untracked file needs review.",
        strict: true,

        parameters: {
            type: "object",
            properties: {},
            required: [],
            additionalProperties: false
        }
    },

    {
        type: "function" as const,
        name: "read_file_range",
        description: "Reads a specific inclusive range of up to 200 lines from a project text file. Prefer this over reading an entire large file when only a section is needed.",
        strict: true,

        parameters: {

            type: "object",
            properties: {

                path: {
                    type: "string",
                    description: "Project-relative path of the file."
                },
                startLine: {
                    type: "integer",
                    description: "First line to read, using 1-based line numbers."
                },
                endLine: {
                    type: "integer",
                    description: "Last line to read, inclusive."
                }

            },
            required: [
                "path",
                "startLine",
                "endLine"
            ],

            additionalProperties: false
        }
    }
];