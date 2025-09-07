import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

export interface Project {
  id: number
  name: string
}

export default class ProjectGateway {
  private baseUrl: string = 'http://localhost:3000'

  async list(token: string, userId: number): Promise<Project[]> {
    const response = await axios.get<Project[]>(`${this.baseUrl}/projects?userId=${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  }

  async getById(id: number): Promise<Project> {
    const response = await axios.get<Project>(`${this.baseUrl}/projects/${id}`)
    return response.data
  }

  async create(title: string, token: string): Promise<Project> {
    const response = await axios.post<Project>(
      `${this.baseUrl}/projects`,
      { name: title },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
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
