export class UserResponse {
  _id: string
  userName: string
  email: string
  status: string
  roles: Array<string>
  password?: string
  token?: string
}
