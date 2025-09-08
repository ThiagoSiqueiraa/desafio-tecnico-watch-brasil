import axios from 'axios'

export interface UserAuthenticated {
  id: number
  name: string
  email: string
  token: string
}

export interface MeResponse {
  id: number
  name: string
  email: string
  currentProject?: {
    id: number
    name: string
  } | null
}

export interface UserInput {
  email: string
  password: string
}
export default class AuthGateway {
  private baseUrl: string = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  async login(input: UserInput): Promise<UserAuthenticated> {
    const { email, password } = input
    const response = await axios.post<UserAuthenticated>(`${this.baseUrl}/auth`, {
      email,
      password,
    })

    return response.data
  }

  async profile(token: string): Promise<MeResponse> {
    const response = await axios.get<MeResponse>(`${this.baseUrl}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  }

}
