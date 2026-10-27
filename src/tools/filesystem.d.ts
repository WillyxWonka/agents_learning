export declare function listFiles(relativePath: string): {
    name: string;
    type: string;
}[];
export declare function readFile(relativePath: string): string;
export declare function searchFiles(relativePath: string, query: string): {
    path: string;
    line: number;
    text: string;
}[];
export declare function readFileRange(relativePath: string, startLine: number, endLine: number): string;
//# sourceMappingURL=filesystem.d.ts.map