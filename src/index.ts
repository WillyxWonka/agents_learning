import "dotenv/config";

import { runAgent } from "./agent.js";


async function main() {

    const answer =
        await runAgent(`
            Review my current Git changes.

            Look for:
            - bugs
            - regressions
            - unsafe behavior
            - incorrect assumptions
            - missing validation

            Investigate related files when necessary.

            Only report issues that you can support
            with evidence from the repository.
        `);


    console.log( "\nFINAL ANSWER:" );

    if (typeof answer === "string") {
        console.log(answer);
    } else {
        const { OT, Tokens } = answer;

        console.log(OT);
        console.log(Tokens);
    }
}
main();
