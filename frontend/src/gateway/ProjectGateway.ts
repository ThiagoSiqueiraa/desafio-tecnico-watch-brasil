import axios from 'axios'

export interface Project {
  id: number
  name: string
}

export default class ProjectGateway {
  private baseUrl: string = 'http://localhost:3000'

  async list(): Promise<Project[]> {
    const response = await axios.get<Project[]>(`${this.baseUrl}/projects?userId=1`)
    return response.data
  }

  async getById(id: number): Promise<Project> {
    const response = await axios.get<Project>(`${this.baseUrl}/projects/${id}`)
    return response.data
  }

  async create(title: string): Promise<Project> {
    const response = await axios.post<Project>(`${this.baseUrl}/projects`, { name: title })
    return response.data
  }

  async update(id: number, project: Partial<Project>): Promise<Project> {
    const response = await axios.put<Project>(`${this.baseUrl}/projects/${id}`, project)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${this.baseUrl}/projects/${id}`)
  }
}
