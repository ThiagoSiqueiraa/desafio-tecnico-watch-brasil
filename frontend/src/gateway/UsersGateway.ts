import axios from 'axios'

export interface User {
  id: string
  name: string
  email: string
}

export default class UsersGateway {
  private baseUrl: string = 'http://localhost:3000'

  async create(input: { name: string; email: string; password: string }): Promise<User> {
    const { name, email, password } = input
    const response = await axios.post<User>(`${this.baseUrl}/users`, { name, email, password })

    return response.data
  }
}
