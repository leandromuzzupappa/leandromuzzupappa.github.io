import { projectsData } from "@/data/projectsData";

export interface IGetProjectsConfig {
  sort?: string;
  page?: number;
  limit?: number;
}

export const getProjects = async ({
  sort = "pushed",
  page = 1,
  limit = 5,
}: IGetProjectsConfig = {}) => {
  const url = `https://api.github.com/users/leandromuzzupappa/repos?sort=${sort}&page=${page}&per_page=${limit}`;

  try {
    const response = await fetch('pepitos' + url);
    const data = await response.json();
    return data;

  } catch (e) {
    const error = e as Error;
    console.log('There has been a problem with your fetch operation: ' + error?.message);

    return projectsData.slice((page - 1) * limit, page * limit);
  }
}