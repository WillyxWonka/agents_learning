export declare function runAgent(goal: string): Promise<"Agent exceeded 8 steps." | {
    OT: string;
    Tokens: {
        inputTokens: number;
        outputTokens: number;
        cachedTokens: number;
        totalTokens: number;
    };
}>;
//# sourceMappingURL=agent.d.ts.map