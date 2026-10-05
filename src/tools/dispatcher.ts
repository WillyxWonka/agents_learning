import { listFiles, readFile, searchFiles } from "./filesystem.js";

export function executeTool( toolName: string, rawArguments: string ) {

    const args = JSON.parse(rawArguments);

    switch (toolName) {

        case "list_files":
            return listFiles( args.path );
        
        case "read_file":
            return readFile( args.path );
        
        case "search_files":
            return searchFiles( args.path, args.query );

        default: throw new Error( `Unknown tool: ${toolName}` );
    }
}