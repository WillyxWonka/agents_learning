import OpenAI from "openai";
import { tools } from "./tools/definitions.js";
import { executeTool } from "./tools/dispatcher.js";
const client = new OpenAI();
const MAX_STEPS = 8;
const AGENT_INSTRUCTIONS = `
    You are a read-only coding assistant operating
    within the user's current project directory.

    - Answer the user's question directly.
    - Inspect project files when necessary.
    - Use available tools to gather evidence.
    - Do not modify files.
    - Do not access files outside the project root.
    - Avoid unnecessary tool calls.
    - If insufficient information exists, say so.
`;
/*
At every cycle, our program sends the model the accumulated context and available actions.
The model performs another token-based inference and generates either a tool request or a final answer.
The tool executes outside the model, its result is added to the context, and the model gets another chance
to decide what to do next.
*/
export async function runAgent(goal) {
    /// USAGE Variables
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalCachedTokens = 0;
    function recordUsage() {
        totalInputTokens += response.usage?.input_tokens ?? 0;
        totalOutputTokens += response.usage?.output_tokens ?? 0;
        totalCachedTokens += response.usage?.input_tokens_details?.cached_tokens ?? 0;
    }
    /// USAGE HELPER END
    //FIRST PROMPT
    let response = await client.responses.create({
        model: "gpt-6-luna",
        reasoning: { effort: "none" },
        instructions: AGENT_INSTRUCTIONS,
        input: goal,
        tools,
        tool_choice: "auto"
    });
    recordUsage();
    //FIRST PROMPT END
    //Loop for "max_steps" and reason through the problem with th toolsavailable"
    for (let step = 0; step < MAX_STEPS; step++) {
        console.log(`\n--- AGENT STEP ${step + 1} ---`);
        const functionCalls = response.output.filter(item => item.type === "function_call");
        if (functionCalls.length === 0) {
            return {
                OT: response.output_text,
                Tokens: {
                    inputTokens: totalInputTokens,
                    outputTokens: totalOutputTokens,
                    cachedTokens: totalCachedTokens,
                    totalTokens: totalInputTokens + totalOutputTokens
                }
            };
        }
        const toolOutputs = [];
        for (const call of functionCalls) {
            console.log(`MODEL REQUESTED: ${call.name}`);
            console.log(`ARGUMENTS: ${call.arguments}`);
            try {
                const result = executeTool(call.name, call.arguments);
                console.log(`TOOL RESULT: ${call.name} completed`);
                /*
                //alternative response here
                if (typeof result === "string") {
                    console.log( `TOOL RESULT: ${result.length} characters returned` );
                } else {
                    console.log("TOOL RESULT:");
                    console.dir( result, { depth: null } );
                }
                */
                //this saves on output tokens if the returned value is only a string 
                // and not an object, i.e it wont add extra line spacing for a string
                const toolOutput = typeof result === "string" ?
                    result :
                    JSON.stringify(result);
                toolOutputs.push({
                    type: "function_call_output",
                    call_id: call.call_id,
                    output: JSON.stringify(toolOutput)
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
            instructions: AGENT_INSTRUCTIONS,
            previous_response_id: response.id,
            input: toolOutputs,
            tools,
            tool_choice: "auto"
        });
        recordUsage();
    }
    return `Agent exceeded ${MAX_STEPS} steps.`;
}
//# sourceMappingURL=agent.js.map