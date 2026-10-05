import "dotenv/config";

import { runAgent } from "./agent.js";
import { json } from "zod";


async function main() {

    const answer =
        await runAgent(`
            Find where this project initializes
            the OpenAI client
        `);


    console.log(
        "\nFINAL ANSWER:"
    );

    if (typeof answer === "string") {
        console.log(answer);
    } else {
        const { OT, Tokens } = answer;

        console.log(OT);
        console.log(Tokens);
    }
}


main();







// import "dotenv/config";

// import OpenAI from "openai";
// import fs from "node:fs";
// import path from "node:path";


// const client = new OpenAI();


// // --------------------------------------------------
// // Repository boundaries
// // --------------------------------------------------

// const PROJECT_ROOT = process.cwd();

// const MAX_STEPS = 8;
// const MAX_FILE_SIZE = 50_000;
// const MAX_SEARCH_RESULTS = 20;


// // Directories we don't want the agent wasting time reading.
// const IGNORED_DIRECTORIES = new Set([
//     "node_modules",
//     ".git",
//     "dist",
//     "build"
// ]);


// // File types our simple search tool understands.
// const SEARCHABLE_EXTENSIONS = new Set([
//     ".ts",
//     ".tsx",
//     ".js",
//     ".jsx",
//     ".json",
//     ".md",
//     ".txt"
// ]);

// const BLOCKED_FILES = new Set([
//     ".env",
//     ".env.local",
//     ".env.development",
//     ".env.production"
// ]);

// // --------------------------------------------------
// // Safety helper
// // --------------------------------------------------

// function resolveProjectPath(relativePath: string) {

//     const resolvedPath = path.resolve(
//         PROJECT_ROOT,
//         relativePath
//     );

//     const relativeToRoot = path.relative(
//         PROJECT_ROOT,
//         resolvedPath
//     );

//     // Prevent things like:
//     //
//     // ../../Documents/passwords.txt
//     //
//     // from escaping our learning project.
//     if (
//         relativeToRoot.startsWith("..") ||
//         path.isAbsolute(relativeToRoot)
//     ) {
//         throw new Error(
//             "Path is outside the project directory."
//         );
//     }

//     return resolvedPath;
// }


// // --------------------------------------------------
// // Tool implementations
// // --------------------------------------------------

// function listFiles(relativePath: string) {

//     const fullPath =
//         resolveProjectPath(relativePath);

//     const entries = fs.readdirSync(
//         fullPath,
//         {
//             withFileTypes: true
//         }
//     );

//     return entries
//         .filter(
//             entry =>
//                 !IGNORED_DIRECTORIES.has(entry.name)
//         )
//         .map(entry => ({
//             name: entry.name,

//             type:
//                 entry.isDirectory()
//                     ? "directory"
//                     : "file"
//         }));
// }


// function readFile(relativePath: string) {

//     const fileName = path.basename(relativePath);

//     if (BLOCKED_FILES.has(fileName)) {
//         throw new Error(
//             `Access to ${fileName} is blocked.`
//         );
//     }


//     const fullPath =
//         resolveProjectPath(relativePath);

//     const stats =
//         fs.statSync(fullPath);

//     if (!stats.isFile()) {
//         throw new Error(
//             `${relativePath} is not a file.`
//         );
//     }

//     if (stats.size > MAX_FILE_SIZE) {
//         throw new Error(
//             `File is too large to read.`
//         );
//     }

//     return fs.readFileSync(
//         fullPath,
//         "utf-8"
//     );
// }


// function searchFiles(
//     relativePath: string,
//     query: string
// ) {

//     const results: {
//         path: string;
//         line: number;
//         text: string;
//     }[] = [];


//     function searchDirectory(
//         directoryPath: string
//     ) {

//         if (
//             results.length >=
//             MAX_SEARCH_RESULTS
//         ) {
//             return;
//         }


//         const entries =
//             fs.readdirSync(
//                 directoryPath,
//                 {
//                     withFileTypes: true
//                 }
//             );


//         for (const entry of entries) {

//             if (
//                 results.length >=
//                 MAX_SEARCH_RESULTS
//             ) {
//                 return;
//             }


//             if (
//                 IGNORED_DIRECTORIES.has(
//                     entry.name
//                 )
//             ) {
//                 continue;
//             }


//             const fullPath =
//                 path.join(
//                     directoryPath,
//                     entry.name
//                 );


//             if (entry.isDirectory()) {

//                 searchDirectory(fullPath);

//                 continue;
//             }


//             const extension =
//                 path.extname(
//                     entry.name
//                 );


//             if (
//                 !SEARCHABLE_EXTENSIONS.has(
//                     extension
//                 )
//             ) {
//                 continue;
//             }


//             const stats =
//                 fs.statSync(fullPath);


//             if (
//                 stats.size >
//                 MAX_FILE_SIZE
//             ) {
//                 continue;
//             }


//             const contents =
//                 fs.readFileSync(
//                     fullPath,
//                     "utf-8"
//                 );


//             const lines =
//                 contents.split("\n");


//             for (
//                 let i = 0;
//                 i < lines.length;
//                 i++
//             ) {

//                 if (
//                     lines[i]
//                         .toLowerCase()
//                         .includes(
//                             query.toLowerCase()
//                         )
//                 ) {

//                     results.push({

//                         path:
//                             path
//                                 .relative(
//                                     PROJECT_ROOT,
//                                     fullPath
//                                 )
//                                 .replaceAll(
//                                     "\\",
//                                     "/"
//                                 ),

//                         line: i + 1,

//                         text:
//                             lines[i].trim()
//                     });


//                     if (
//                         results.length >=
//                         MAX_SEARCH_RESULTS
//                     ) {
//                         return;
//                     }
//                 }
//             }
//         }
//     }


//     const startPath =
//         resolveProjectPath(
//             relativePath
//         );


//     searchDirectory(startPath);


//     return results;
// }


// // --------------------------------------------------
// // Tools exposed to the MODEL
// // --------------------------------------------------

// const tools = [

//     {
//         type: "function" as const,

//         name: "list_files",

//         description:
//             "Lists files and directories inside a project directory.",

//         strict: true,

//         parameters: {

//             type: "object",

//             properties: {

//                 path: {
//                     type: "string",
//                     description:
//                         'Project-relative directory path. Use "." for the project root.'
//                 }

//             },

//             required: ["path"],

//             additionalProperties: false
//         }
//     },


//     {
//         type: "function" as const,

//         name: "read_file",

//         description:
//             "Reads the text contents of a project file.",

//         strict: true,

//         parameters: {

//             type: "object",

//             properties: {

//                 path: {
//                     type: "string",
//                     description:
//                         "Project-relative path of the file to read."
//                 }

//             },

//             required: ["path"],

//             additionalProperties: false
//         }
//     },


//     {
//         type: "function" as const,

//         name: "search_files",

//         description:
//             "Searches project text files for a string and returns matching files, line numbers, and text.",

//         strict: true,

//         parameters: {

//             type: "object",

//             properties: {

//                 path: {
//                     type: "string",
//                     description:
//                         'Directory to search. Use "." to search the whole project.'
//                 },

//                 query: {
//                     type: "string",
//                     description:
//                         "Text to search for."
//                 }

//             },

//             required: [
//                 "path",
//                 "query"
//             ],

//             additionalProperties: false
//         }
//     }

// ];


// // --------------------------------------------------
// // Tool dispatcher
// // --------------------------------------------------

// function executeTool(
//     toolName: string,
//     rawArguments: string
// ) {

//     const args =
//         JSON.parse(rawArguments);


//     switch (toolName) {

//         case "list_files":

//             return listFiles(
//                 args.path
//             );


//         case "read_file":

//             return readFile(
//                 args.path
//             );


//         case "search_files":

//             return searchFiles(
//                 args.path,
//                 args.query
//             );


//         default:

//             throw new Error(
//                 `Unknown tool: ${toolName}`
//             );
//     }
// }


// // --------------------------------------------------
// // Agent
// // --------------------------------------------------

// async function main() {

//     let response =
//         await client.responses.create({

//             model: "gpt-6-luna",

//             reasoning: {
//                 effort: "none"
//             },

//             input: `
//                 Find where this project initializes
//                 the OpenAI client.

//                 Inspect the repository yourself and
//                 explain what the relevant code does.

//                 Do not guess.
//             `,

//             tools,

//             tool_choice: "auto"
//         });


//     for (
//         let step = 0;
//         step < MAX_STEPS;
//         step++
//     ) {

//         console.log(
//             `\n--- AGENT STEP ${step + 1} ---`
//         );


//         const functionCalls =
//             response.output.filter(
//                 item =>
//                     item.type ===
//                     "function_call"
//             );


//         if (
//             functionCalls.length === 0
//         ) {

//             console.log(
//                 "\nFINAL ANSWER:"
//             );

//             console.log(
//                 response.output_text
//             );

//             return;
//         }


//         const toolOutputs: Array<{
//             type: "function_call_output";
//             call_id: string;
//             output: string;
//         }> = [];


//         for (
//             const call of functionCalls
//         ) {

//             console.log(
//                 `MODEL REQUESTED: ${call.name}`
//             );

//             console.log(
//                 `ARGUMENTS: ${call.arguments}`
//             );


//             try {

//                 const result =
//                     executeTool(
//                         call.name,
//                         call.arguments
//                     );


//                 console.log(
//                     "TOOL RESULT:"
//                 );

//                 console.dir(
//                     result,
//                     {
//                         depth: null
//                     }
//                 );


//                 toolOutputs.push({

//                     type:
//                         "function_call_output",

//                     call_id:
//                         call.call_id,

//                     output:
//                         JSON.stringify(
//                             result
//                         )
//                 });

//             }
//             catch (error) {

//                 const message =
//                     error instanceof Error
//                         ? error.message
//                         : "Unknown tool error";


//                 toolOutputs.push({

//                     type:
//                         "function_call_output",

//                     call_id:
//                         call.call_id,

//                     output:
//                         JSON.stringify({
//                             error: message
//                         })
//                 });
//             }
//         }


//         response =
//             await client.responses.create({

//                 model: "gpt-6-luna",

//                 reasoning: {
//                     effort: "none"
//                 },

//                 previous_response_id:
//                     response.id,

//                 input:
//                     toolOutputs,

//                 tools,

//                 tool_choice:
//                     "auto"
//             });
//     }


//     console.log(
//         `\nAgent stopped after ${MAX_STEPS} steps.`
//     );
// }


// main();