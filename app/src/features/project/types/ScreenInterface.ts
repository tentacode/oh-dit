export interface ScreenInterface {
  uuid: string;
  projectUuid: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  progress: number;
  complianceRate: number;
  isRoot: boolean;
  rank: number;
  issueCount: number;
  complianceCount: number;
}
