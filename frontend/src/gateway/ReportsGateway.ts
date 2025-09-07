import axios from 'axios'

export interface ReportsDTO {
  status: {
    pending: number
    in_progress: number
    completed: number
  }
  due: {
    overdue: number
    onTime: number
  }
}
export default class ReportsGateway {
  private baseUrl: string = 'http://localhost:3000'

  async get(projectId: number, token: string): Promise<ReportsDTO> {
    const response = await axios.get<ReportsDTO>(`${this.baseUrl}/reports?projectId=${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  }
}
