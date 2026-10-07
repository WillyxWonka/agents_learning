import { execFileSync } from "node:child_process"; //child_process lets Node launch another program. // like call it in the console


const MAX_DIFF_SIZE = 50_000;

/*  
//git status --porclain returns "machine" code like this -- this is why the string parsing portion of the code looks for question marks ??
    M src/index.ts
    ?? src/newFile.ts
    ?? src/tools/helper.ts 
 */

export function getGitDiff() {

    const unstaged = execFileSync( "git", [ "diff", "--no-ext-diff" ], { encoding: "utf-8" } );
    const staged = execFileSync( "git", [ "diff", "--cached", "--no-ext-diff" ], { encoding: "utf-8" } );
    const result = ` UNSTAGED CHANGES: ${unstaged} STAGED CHANGES: ${staged} `.trim();

    if ( result.length > MAX_DIFF_SIZE ) {
        return ( result.slice( 0, MAX_DIFF_SIZE ) + "\n\n[DIFF TRUNCATED]" );
    }

    
    return result;
}