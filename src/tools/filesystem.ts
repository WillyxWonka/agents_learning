import fs from "node:fs";
import path from "node:path";


const PROJECT_ROOT = process.cwd();
const REAL_PROJECT_ROOT = fs.realpathSync(PROJECT_ROOT);

const MAX_FILE_SIZE = 50_000;
const MAX_SEARCH_RESULTS = 20;
const MAX_RANGE_LINES = 200;

const IGNORED_NAMES = new Set([
    "node_modules",
    ".git",
    "dist",
    "build",
    ".env",
    ".env.local",
    ".env.development",
    ".env.production"
]);

const SEARCHABLE_EXTENSIONS = new Set([
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".json",
    ".md",
    ".txt"
]);

function resolveProjectPath(relativePath: string) {

    const resolvedPath = path.resolve(PROJECT_ROOT, relativePath);

    const realPath = fs.realpathSync(resolvedPath);
    const realRelative = path.relative( REAL_PROJECT_ROOT, realPath );


    if ( realRelative === ".." || realRelative.startsWith( ".." + path.sep ) || path.isAbsolute(realRelative) ) {
        throw new Error( "Resolved path is outside the project directory." );
    }
    return realPath;
}

export function listFiles(relativePath: string) {

    const fullPath = resolveProjectPath(relativePath);

    const entries = fs.readdirSync(
            fullPath,
            {
                withFileTypes: true
            }
    );

    return entries
                .filter( entry => !IGNORED_NAMES.has(entry.name))
                .map(entry => ({
                    name: entry.name,
                    type: entry.isDirectory() ? "directory" : "file"
                })
    );
}

export function readFile(relativePath: string) {

    const fullPath = resolveProjectPath(relativePath);
    const stats = fs.lstatSync(fullPath);
    if (stats.isSymbolicLink()) {
        throw new Error( "Symbolic links are not allowed." );
    }
    if (!stats.isFile()) {
        throw new Error(
            `${relativePath} is not a file.`
        );
    }

    if (stats.size > MAX_FILE_SIZE) {
        throw new Error(
            "File is too large to read."
        );
    }

    return fs.readFileSync(
        fullPath,
        "utf-8"
    );
}

export function searchFiles(relativePath: string, query: string){

    const results: {
        path: string;
        line: number;
        text: string;
    }[] = [];

    const searchQuery = query.toLowerCase();

    function searchDirectory(directoryPath: string) {

        const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

        for (const entry of entries) {

            if (entry.isSymbolicLink()) {
                continue;
            }

            if (results.length >= MAX_SEARCH_RESULTS){
                return;
            }

            if (IGNORED_NAMES.has(entry.name)) {
                continue;
            }

            const fullPath = path.join( directoryPath, entry.name );

            if (entry.isDirectory()){

                searchDirectory(fullPath);

                continue;
            }

            const extension = path.extname(entry.name);

            if (!SEARCHABLE_EXTENSIONS.has( extension )) {
                continue;
            }

            const stats = fs.lstatSync(fullPath);
            if (stats.isSymbolicLink()) {
                throw new Error( "Symbolic links are not allowed." );
            }

            if (stats.size > MAX_FILE_SIZE){
                continue;
            }

            const contents = fs.readFileSync( fullPath, "utf-8" );            
            const lines = contents.split(/\r?\n/);

            for ( let i = 0; i < lines.length; i++ ) {

                const line = lines[i]; // required for typescript linter error for potentially undefined

                if (line === undefined) {
                    continue; 
                }
                
                if ( line.toLowerCase().includes(searchQuery)) {

                    results.push({
                        path: path.relative( PROJECT_ROOT, fullPath ).replaceAll( "\\", "/" ),
                        line: i + 1,
                        text: line.trim()
                    });
                }
                if ( results.length >= MAX_SEARCH_RESULTS ){
                    return;
                }
            }
        }
    }

    const startPath = resolveProjectPath( relativePath );

    searchDirectory(startPath);

    return results;
}



export function readFileRange( relativePath: string, startLine: number, endLine: number ) {
    const fullPath = resolveProjectPath(relativePath);
    const stats = fs.lstatSync(fullPath); //asks the filesystem: Give me metadata about this path.returns an fs.Stats object. That object contains information like: file size whether it's a file whether it's a directory timestamps other filesystem metadata

    if (stats.isSymbolicLink()) {
        throw new Error( "Symbolic links are not allowed." );
    }
    if (!stats.isFile()) {
        throw new Error( `${relativePath} is not a file.` );
    }
    if (stats.size > MAX_FILE_SIZE) { 
        throw new Error( "File is too large to read." ); 
    }

    const contents = fs.readFileSync( fullPath, "utf-8" );

    const lines = contents.split(/\r?\n/); // standard and effective for splitting text into lines,

    if ( !Number.isInteger(startLine) || !Number.isInteger(endLine) ) {
        throw new Error( "Line numbers must be integers." );
    }

    if ( startLine < 1 || endLine < startLine ) {
        throw new Error( "Invalid line range." );
    }


    if ( endLine - startLine + 1 > MAX_RANGE_LINES ) {
        throw new Error( `Cannot read more than ${MAX_RANGE_LINES} lines at once.` );
    }

    const safeStart = Math.max( 1, startLine );
    const safeEnd = Math.min( endLine, lines.length );

    if (safeStart > safeEnd) {
        throw new Error( "Invalid line range." );
    }


    return lines
        .slice( safeStart - 1, safeEnd )
        .map( (line, index) => `${safeStart + index}: ${line}` ) // Maps the lines to look like --> 20: function signIn() {}.... with the line numbers for effinciency
        .join("\n");
}