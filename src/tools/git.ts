import { execFileSync } from "node:child_process"; //child_process lets Node launch another program. // like call it in the console

const MAX_DIFF_SIZE = 50_000;

export function getGitDiff() {
    
    //returns git diffs --no-ext-diff -> "disallow external diff drivers and use Git's built-in diff engine instead"
    const unstaged = execFileSync( "git", [ "diff", "--no-ext-diff" ], { encoding: "utf-8" } );
    //retruns cached git diffs
    const staged = execFileSync( "git", [ "diff", "--cached", "--no-ext-diff" ], { encoding: "utf-8" } );

    /*  
    //git status --porclain returns "machine" code like this -- this is why the string parsing portion of the code looks for question marks ??
        M src/index.ts
        ?? src/newFile.ts
        ?? src/tools/helper.ts 

        the question marks means the script is untracked which is the status separation that the agent is being given to decide about
 */

    const status = execFileSync( "git", [ "status", "--porcelain" ], { encoding: "utf-8" } );

    const untrackedFiles = status
        .split("\n") 
        .filter(line => line.startsWith("??") ) 
        .map(line => line.slice(3).trim() );
        
    return {
        unstaged: truncateDiff(unstaged),
        staged: truncateDiff(staged),
        untrackedFiles
    };
}


function truncateDiff(diff: string) {

    if ( diff.length <= MAX_DIFF_SIZE ) {
        return diff;
    }

    return ( diff.slice( 0, MAX_DIFF_SIZE ) + "\n\n[DIFF TRUNCATED]" );
}