export interface ToolDefinition {
    name: string;
    description: string;
    isMutating: boolean;
    execute: (params: any) => Promise<string>;
}
export declare class AgentTools {
    static getTools(): Record<string, ToolDefinition>;
}
