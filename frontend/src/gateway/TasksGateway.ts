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

  async create(
    input: {
      title: string
      description?: string
      priority: string
      status: string
      dueDate: Date | null
      checklist: { title: string }[]
    },
    token: string,
  ): Promise<any> {
    const { title, description, priority, status, dueDate, checklist } = input
    const response = await axios.post<any>(
      `${this.baseUrl}/tasks`,
      {
        title,
        description,
        priority,
        status,
        dueDate,
        checklist,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  }
  
  async getById(id: number, token: string): Promise<any> {
    const response = await axios.get<any>(`${this.baseUrl}/tasks/getById/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  }

  async update(id: number, input: {
    title: string
    description?: string
    priority: string
    status: string
    dueDate: Date | null
    checklist: { title: string }[]
  }, token: string): Promise<any> {
    const response = await axios.put<any>(`${this.baseUrl}/tasks/${id}`, input, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  }
}
