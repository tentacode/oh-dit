export enum ProjectStatus {
    InProgress = "in_progress",
    Completed = "completed",
    OnHold = "on_hold",
}

export interface ProjectInterface {
    uuid: string;
    name: string;
    updatedAt: string;
    progress: number;
    status: ProjectStatus;
    ruleSet: {
        uuid: string;
        name: string;
        version: string;
    };
}