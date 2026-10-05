import OpenAI from "openai";

import { tools } from "./tools/definitions.js";
import { executeTool } from "./tools/dispatcher.js";


const client = new OpenAI();

const MAX_STEPS = 8;

/*
At every cycle, our program sends the model the accumulated context and available actions. 
The model performs another token-based inference and generates either a tool request or a final answer. 
The tool executes outside the model, its result is added to the context, and the model gets another chance 
to decide what to do next.
*/
export async function runAgent(
    goal: string
) {

    let response =
        await client.responses.create({

            model: "gpt-6-luna",

            reasoning: {
                effort: "none"
            },

            instructions: `
                You are a read-only repository investigator.

                Use the available tools to gather evidence
                before answering.

                Use as few tool calls as reasonably necessary.

                Once you have direct evidence sufficient to
                answer the user's question, stop investigating
                and answer.

                Never claim to have inspected code that you
                have not actually retrieved through a tool.
            `,

            input: goal,
            tools,
            tool_choice: "auto"
        });


    for(let step = 0; step < MAX_STEPS; step++){

        console.log( `\n--- AGENT STEP ${step + 1} ---` );

        const functionCalls = response.output.filter( item => item.type === "function_call" );

        if (functionCalls.length === 0){

            return {OT: response.output_text, Tokens: response.usage};
        }


        const toolOutputs: Array<{ type: "function_call_output"; call_id: string; output: string; }> = [];

        for (const call of functionCalls) {

            console.log( `MODEL REQUESTED: ${call.name}` );
            console.log( `ARGUMENTS: ${call.arguments}` );

            try {

                const result = executeTool( call.name, call.arguments );

                console.log(
                    `TOOL RESULT: ${call.name} completed`
                );
                //console.log( "TOOL RESULT:" );
                // console.dir(
                //     result,
                //     {
                //         depth: null
                //     }
                // );

                toolOutputs.push({

                    type: "function_call_output",
                    call_id: call.call_id,

                    output: JSON.stringify(result)
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

                reasoning: {
                    effort: "none"
                },

                previous_response_id: response.id,
                input: toolOutputs,
                tools,
                tool_choice: "auto"
            });
    }


    return `Agent exceeded ${MAX_STEPS} steps.`;
}