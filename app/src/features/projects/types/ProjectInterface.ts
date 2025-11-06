export enum ProjectStatus {
    InProgress = "En cours",
    Completed = "Terminé",
    OnHold = "En attente",
}

export interface ProjectInterface {
    uuid: string;
    name: string;
    updatedAt: string;
    progress: number;
    status: ProjectStatus;
}