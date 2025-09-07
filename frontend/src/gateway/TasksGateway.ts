import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

export interface Project {
  id: number
  name: string
}

export default class TasksGateway {
  private baseUrl: string = 'http://localhost:3000'

  async list(projectId: number, token: string): Promise<any[]> {
    const response = await axios.get<any[]>(`${this.baseUrl}/tasks/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  }
}
