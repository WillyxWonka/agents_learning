import fs from "node:fs";
import path from "node:path";

const ALLOWED_HISTORY_FILES = new Set([
    "tweakedBotChatHistory/recent.md",
    "tweakedBotChatHistory/long.md"
]);
/**
 * manually called save file function 
 * @param filePath 
 * @param content 
 * @returns saved conversation log 
 */
export function saveHistory( filePath: string, content: string ) {
    if (!ALLOWED_HISTORY_FILES.has(filePath)) {
        throw new Error("Invalid history file path");
    }

    const fullPath = path.resolve(process.cwd(), filePath);

    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.appendFileSync(fullPath, content, "utf8");

}

/**
 * this function is used to write to the history file, which is used to maintain conversation history between the user and the agent. It is called at the end of the runAgent function to save the final answer and question to the history file.
 * @param filePath 
 * @param content 
 * @returns a string indicating that the history file was successfully written to.
 */
export function writeHistoryFile( filePath: string, content: string ) {
    
    if (!ALLOWED_HISTORY_FILES.has(filePath)) {
        throw new Error("Invalid history file path");
    }

    const fullPath = path.resolve(process.cwd(), filePath);

    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.appendFileSync(fullPath, content, "utf8");

    return `Successfully wrote history to ${filePath}`;
}