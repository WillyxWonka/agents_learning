import OpenAI from "openai";

import { tools } from "./tools/definitions.js";
import { executeTool } from "./tools/dispatcher.js";

import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { saveHistory, getHistoryPath } from "./tools/chatHistory.js";
import fs from "node:fs";
import path from "node:path";


// Load .env from the agent's own project directory
config({
    path: fileURLToPath(new URL("../.env", import.meta.url))
});

//Load agent instructions from .md file
const INSTRUCTIONS_PATH = fileURLToPath(
  new URL("../src/AGENTS.md", import.meta.url)
);
const AGENT_INSTRUCTIONS = fs.existsSync(INSTRUCTIONS_PATH) ? fs.readFileSync(INSTRUCTIONS_PATH, "utf8") : "Let the user know that the instructions were not loaded correctly and that is all";

const client = new OpenAI();

const MAX_STEPS = 15;


/*
At every cycle, our program sends the model the accumulated context and available actions. 
The model performs another token-based inference and generates either a tool request or a final answer. 
The tool executes outside the model, its result is added to the context, and the model gets another chance 
to decide what to do next.
*/
export async function runAgent( goal: string , steps?: number ) {

    steps = steps ?? MAX_STEPS;
    
    /// TOKEN USAGE: Variables
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalCachedTokens = 0;
    
    function recordUsage() {
        totalInputTokens += response.usage?.input_tokens ?? 0;
        totalOutputTokens += response.usage?.output_tokens ?? 0;
        totalCachedTokens += response.usage ?.input_tokens_details ?.cached_tokens ?? 0;
    }
    /// TOKEN USAGE: HELPER END
    
    const historyPath = path.resolve(process.cwd(), "tweakedBotChatHistory/recent.md");
    const history = fs.existsSync(historyPath)  ? fs.readFileSync(historyPath, "utf8") : "";

    const recentHistory = history.slice(-12000); // <-- make this adjustable

    //FIRST PROMPT
    let response =
        await client.responses.create({

            model: "gpt-6-luna",
            reasoning: { effort: "none" },

            instructions:AGENT_INSTRUCTIONS,

            input: [ { role: "user", content: `Earlier conversation:\n${recentHistory}` }, { role: "user", content: goal } ],
            tools,
            tool_choice: "auto"
        });
        recordUsage();
    //FIRST PROMPT END


    //Loop for "max_steps" and reason through the problem with th toolsavailable"
    for(let step = 0; step < steps; step++){

        console.log( `\n--- AGENT STEP ${step + 1} ---` );

        const functionCalls = response.output.filter( item => item.type === "function_call" );

        if (functionCalls.length === 0) {
        const finalAnswer = response.output_text;
        const Tokens = { totalInputTokens, totalOutputTokens, totalCachedTokens, } 

          finishResponse(goal, finalAnswer, Tokens);

            return {
                OT: finalAnswer,
                Tokens
            };
        }

        const toolOutputs: Array<{ type: "function_call_output"; call_id: string; output: string; }> = [];

        for (const call of functionCalls) {
            
            console.log("--------------------------------");
            console.log( `MODEL REQUESTED: ${call.name}` );
            console.log( `ARGUMENTS: ${call.arguments}` );
            console.log("--------------------------------");
            
            try {

                const result = executeTool( call.name, call.arguments );

                console.log(
                    `TOOL RESULT: ${call.name} completed`
                );
               
                // this is a workaround for the fact that the model expects a string, but some tools return objects. 
                // it also save on token usage by not sending the entire object back to the model, but rather a stringified version of it.
                // i.e it wont add extra line spacing for a string
                const toolOutput = typeof result === "string" ? result : JSON.stringify(result);

                toolOutputs.push({
                    type: "function_call_output",
                    call_id: call.call_id,
                    output: toolOutput
                });

            }
            catch (error) {

                const message = error instanceof Error ? error.message : "Unknown error";

                toolOutputs.push({

                    type: "function_call_output",
                    call_id: call.call_id,
                    output: JSON.stringify({ error: message })

                });
            }
        }

        response = await client.responses.create({
            model: "gpt-6-luna",
            reasoning: { effort: "none" },
            instructions:AGENT_INSTRUCTIONS,
            previous_response_id: response.id,
            input: toolOutputs,
            tools,
            tool_choice: "auto"
        });
        
        recordUsage();
    }

    return `Agent exceeded ${steps} steps.`;
}

function finishResponse(goal: string, finalAnswer: string, tokens: object) {
    
    const historyPath = getHistoryPath()

    const needsHeader = !fs.existsSync(historyPath) || fs.statSync(historyPath).size === 0;

    const tokenDetails = tokens as {
        totalInputTokens: number;
        totalOutputTokens: number;
        totalCachedTokens: number;
    };

    const entry = [
"",
`# <span style="color: green;">~</span>start`,
"",
`### <strong><span style="color: #f2cc8f;">You:</span></strong>`,
`\`\`\`text 
${new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
})}

${goal.trim()}
\`\`\``,
`
><small><span style="color: #669bbc"><strong>Token usage:</strong></span> &nbsp;&nbsp;&nbsp; **Input:** ${tokenDetails.totalInputTokens} &nbsp;&nbsp; | &nbsp;&nbsp; **Output:** ${tokenDetails.totalOutputTokens} &nbsp;&nbsp; | &nbsp;&nbsp; **Cached:** ${tokenDetails.totalCachedTokens}</small>
`,
"",
`## <strong><span style="color: #f2cc8f;">TweakedBot:</span></strong>`,
finalAnswer.trim(),
"",

`# <span style="color: red;">~</span>end`,
""
].join("\n");

    const header = needsHeader
        ? "# TweakedBot — Conversation History\n"
        : "";

    saveHistory( header + entry);
}

//returns entire resonse object for debugging purposes
// console.log(
//     JSON.stringify(response, null, 2)
// );