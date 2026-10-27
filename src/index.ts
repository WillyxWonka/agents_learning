#!/usr/bin/env node
import "dotenv/config";
import { runAgent } from "./agent.js";

async function main() {
    const prompt = process.argv.slice(2).join(" ").trim();

    if (!prompt) {
        console.error('Usage: tweakedBot "your question"');
        process.exitCode = 1;
        return;
    }

    const answer = await runAgent(prompt);

    console.log("\nFINAL ANSWER:");

    if (typeof answer === "string") {
        console.log(answer);
    } else {
        const { OT, Tokens } = answer;

        console.log(OT);
        console.log(Tokens);
    }
}

main().catch((error) => {
    console.error("Agent failed:", error);
    process.exitCode = 1;
});

// import "dotenv/config";

// import { runAgent } from "./agent.js";


// async function main() {

//     const answer =
//         /*expects a "goal" for the string */
//         await runAgent(`
//             Review my current Git changes.

//             Look for:
//             - bugs
//             - regressions
//             - unsafe behavior
//             - incorrect assumptions
//             - missing validation

//             Investigate related files when necessary.

//             Only report issues that you can support
//             with evidence from the repository.
//         `);


//     console.log( "\nFINAL ANSWER:" );

//     if (typeof answer === "string") {
//         console.log(answer);
//     } else {
//         const { OT, Tokens } = answer;

//         console.log(OT);
//         console.log(Tokens);
//     }
// }
// main();
