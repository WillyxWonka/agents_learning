import { listFiles, readFile, searchFiles, readFileRange } from "./filesystem.js";
import { getGitDiff } from "./git.js";
import { writeHistoryFile } from "./chatHistory.js";
import {z} from "zod";


const PathArgs = z.object({
        path: z.string() .min(1)
    }).strict();

const SearchFilesArgs = z.object({
        path: z.string() .min(1),
        query: z.string() .min(1)
    }).strict();

const ReadFileRangeArgs = z.object({
        path: z.string() .min(1),
        startLine: z.number() .int() .positive(),
        endLine: z.number() .int() .positive()
    }).strict();
const writeHistoryFileArgs = z.object({
        path: z.string() .min(1),
        content: z.string() .min(1),
    });
export function executeTool( toolName: string, rawArguments: string ) {

    const raw = JSON.parse(rawArguments);

    switch (toolName) {

        case "list_files":{
            const args = PathArgs.parse(raw);
            return listFiles( args.path );}
        
        case "read_file":{
            const args = PathArgs.parse(raw);
            return readFile( args.path );}
        
        case "search_files": {
            const args = SearchFilesArgs.parse(raw);
            return searchFiles( args.path, args.query );
        }

        case "get_git_diff":
            return getGitDiff();

        case "read_file_range":{

            const args = ReadFileRangeArgs.parse(raw);
            return readFileRange(
                args.path,
                args.startLine,
                args.endLine
            );
        }
        case "write_history_file":{
            const args = writeHistoryFileArgs.parse(raw);
            return writeHistoryFile(
                args.path,
                args.content
            );
        }

        default: 
            throw new Error( `Unknown tool: ${toolName}` );
    }
}

