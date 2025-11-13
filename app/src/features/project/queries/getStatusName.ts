import { ProjectStatus } from "../types/ProjectInterface";

export const getStatusName = (status: string): string => {
    switch (status) {
        case ProjectStatus.InProgress:
            return 'En cours';
        case ProjectStatus.OnHold:
            return 'En attente';
        case ProjectStatus.Completed:
            return 'Terminé';
        default:
            throw new Error(`Unknown project status: ${status}`);
    }
};