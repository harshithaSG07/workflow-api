import * as projectRepository from "../repositories/project.repository";

interface CreateProjectInput {
  name: string;
  description?: string;
  userId: string;
}

interface UpdateProjectInput {
  name: string;
  description?: string | null;
}

export async function createProject(input: CreateProjectInput) {
  return projectRepository.createProject(input);
}

export async function getProjects(userId: string) {
  return projectRepository.getProjectsByUserId(userId);
}

export async function getProjectById(
  projectId: string,
  userId: string
) {
  return projectRepository.getProjectById(projectId, userId);
}

export async function updateProject(
  projectId: string,
  userId: string,
  input: UpdateProjectInput
) {
  return projectRepository.updateProject(projectId, userId, input);
}

export async function deleteProject(
  projectId: string,
  userId: string
) {
  return projectRepository.deleteProject(projectId, userId);
}