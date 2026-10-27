export declare const tools: ({
    type: "function";
    name: string;
    description: string;
    strict: boolean;
    parameters: {
        type: string;
        properties: {
            path: {
                type: string;
                description: string;
            };
            query?: never;
            startLine?: never;
            endLine?: never;
        };
        required: string[];
        additionalProperties: boolean;
    };
} | {
    type: "function";
    name: string;
    description: string;
    strict: boolean;
    parameters: {
        type: string;
        properties: {
            path: {
                type: string;
                description: string;
            };
            query: {
                type: string;
                description: string;
            };
            startLine?: never;
            endLine?: never;
        };
        required: string[];
        additionalProperties: boolean;
    };
} | {
    type: "function";
    name: string;
    description: string;
    strict: boolean;
    parameters: {
        type: string;
        properties: {
            query?: never;
            path?: never;
            startLine?: never;
            endLine?: never;
        };
        required: never[];
        additionalProperties: boolean;
    };
} | {
    type: "function";
    name: string;
    description: string;
    strict: boolean;
    parameters: {
        type: string;
        properties: {
            query?: never;
            path: {
                type: string;
                description: string;
            };
            startLine: {
                type: string;
                description: string;
            };
            endLine: {
                type: string;
                description: string;
            };
        };
        required: string[];
        additionalProperties: boolean;
    };
})[];
//# sourceMappingURL=definitions.d.ts.map