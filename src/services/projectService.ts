import { ProjectCorridor } from '../types/project';
import { mockProjects } from '../data/mockProjects';

class ProjectService {
  private projects: ProjectCorridor[] = [...mockProjects];

  public async getAllProjects(): Promise<ProjectCorridor[]> {
    return [...this.projects];
  }

  public async getProjectById(id: string): Promise<ProjectCorridor | null> {
    const found = this.projects.find(p => p.id === id || p.code === id);
    return found ? { ...found } : null;
  }
}

export const projectService = new ProjectService();
