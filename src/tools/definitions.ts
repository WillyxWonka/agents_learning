export const tools = [

    {
        type: "function" as const,
        name: "list_files",
        description: "Lists files and directories inside a project directory.",
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
        description: "Searches project text files for a string and returns matching files, line numbers, and text.",
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
    }

];