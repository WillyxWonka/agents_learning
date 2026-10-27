export declare function executeTool(toolName: string, rawArguments: string): string | {
    name: string;
    type: string;
}[] | {
    path: string;
    line: number;
    text: string;
}[] | {
    unstaged: string;
    staged: string;
    untrackedFiles: string[];
};
//# sourceMappingURL=dispatcher.d.ts.map