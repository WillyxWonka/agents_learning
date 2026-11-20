#!/usr/bin/env node
import "dotenv/config";

async function main() {
/* 
process.argv is an array of strings supplied by the shell. The first two entries are normally the Node executable and the script path, so slice(2) keeps only what the user typed. join(" ")
*/
const args = process.argv.slice(2);
console.log(args);

console.log("");
console.log(process.argv);

const stepsIndex = args.indexOf("--steps");

if (stepsIndex !== -1) {
    const steps = Number(args[stepsIndex + 1]);

    console.log("Steps:", steps);

}
}
await main();