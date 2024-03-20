export {};

declare global {
  type JobType = {
    employer: string;
    id: string;
    title: string;
    description: string;
    qualifications: string;
    location: string;
    salaryFrom: number;
    salaryTo: number;
    siteURL: string;
    applied: boolean;
    timestamp: number;
    applicationCount: number;
  };
}
