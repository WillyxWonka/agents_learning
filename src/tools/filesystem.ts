import fs from "node:fs";
import path from "node:path";


const PROJECT_ROOT = process.cwd();

const MAX_FILE_SIZE = 50_000;
const MAX_SEARCH_RESULTS = 20;

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

    const resolvedPath = path.resolve( PROJECT_ROOT, relativePath);
    const relativeToRoot = path.relative(PROJECT_ROOT, resolvedPath);

    if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)){
        throw new Error(
            "Path is outside the project directory."
        );
    }
    return resolvedPath;
}

function isBlocked(relativePath: string) {

    const fileName = path.basename(relativePath);
    return IGNORED_NAMES.has(fileName);
}

export function listFiles(relativePath: string) {

    const fullPath = resolveProjectPath(relativePath);

    const entries = fs.readdirSync(
            fullPath,
            {
                withFileTypes: true
            }
    );

    return entries.filter( entry => !IGNORED_NAMES.has(entry.name))
                  .map(entry => ({
                        name: entry.name,
                        type: entry.isDirectory() ? "directory" : "file"
                    })
    );
}

export function readFile(relativePath: string) {

    if (isBlocked(relativePath)) {
        throw new Error(
            `Access to ${relativePath} is blocked.`
        );
    }

    const fullPath = resolveProjectPath(relativePath);
    const stats = fs.statSync(fullPath);

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


    function searchDirectory(directoryPath: string) {

        const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

        for (const entry of entries) {

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

            const stats = fs.statSync(fullPath);

            if (stats.size > MAX_FILE_SIZE){
                continue;
            }

            const contents = fs.readFileSync( fullPath, "utf-8" );            
            const lines = contents.split("\n");

            for ( let i = 0; i < lines.length; i++ ) {

                const line = lines[i]; // required for typescript linter error for potentially undefined

                if (line === undefined) {
                    continue; 
                }
                
                if ( line.toLowerCase().includes(query.toLowerCase())) {

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