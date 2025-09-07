import axios from 'axios'

export interface UserAuthenticated {
  id: number
  name: string
  email: string
  token: string
}

export interface UserInput {
  email: string
  password: string
}
export default class AuthGateway {
  private baseUrl: string = 'http://localhost:3000'

  async login(input: UserInput): Promise<UserAuthenticated> {
    console.log("oii")
    const { email, password } = input
    const response = await axios.post<UserAuthenticated>(`${this.baseUrl}/login`, {
      email,
      password,
    })

    return response.data
  }
}
