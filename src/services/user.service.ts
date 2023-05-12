import { DTO } from '../common'
import { STATUS_DB } from '../common/constants/status.db'
import { HttpException } from '../middlewares'
import { ErrorCodesApi } from '../middlewares/errors/error.constants'
import { UserModel } from '../schemas'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
class UserService {
  async register(userData: DTO.UserRegister): Promise<DTO.UserResponse> {
    const user = await UserModel.create({
      ...userData,
      password: await bcrypt.hash(userData.password, 10),
    }).then((ob) => ob.toObject())

    return { ...user, token: this.getAccessToken(user), password: undefined }
  }

  private getAccessToken(payload: any): string {
    const accessToken = jwt.sign(payload, process.env.SECRET_JWT as string, {
      expiresIn: '12h',
    })
    return accessToken
  }

  async login(user: DTO.UserLogin): Promise<DTO.UserResponse> {
    const exist = await UserModel.findOne({
      email: user.email,
      status: STATUS_DB.ACTIVE,
    })

      .lean()
      .exec()
    console.log(user.password)
    if (!exist)
      throw new HttpException('User not found', ErrorCodesApi.USER_NOT_FOUND)
    else if (!(await bcrypt.compare(user.password, exist.password)))
      throw new HttpException(
        'Password is error',
        ErrorCodesApi.USER_ERROR_VALUES
      )
    return {
      ...exist,
      password: undefined,
      token: this.getAccessToken(exist),
    }
  }

  async update(user: DTO.UserUpdate): Promise<DTO.UserResponse> {
    const exist = await UserModel.findOne({
      $or: [{ email: user.email }, { _id: user._id }],
    }).lean()

    if (!exist)
      throw new HttpException('User not found', ErrorCodesApi.USER_NOT_FOUND)

    const userUpdated = (await UserModel.findByIdAndUpdate(
      exist._id,
      { ...user },
      { new: true }
    )
      .select(['-password'])
      .lean()) as DTO.UserResponse

    return userUpdated
  }

  async delete(data: DTO.DeleteGeneral): Promise<DTO.DeleteGeneral> {
    const exist = await UserModel.findById(data._id).lean()

    if (!exist)
      throw new HttpException('User not found', ErrorCodesApi.USER_NOT_FOUND)

    await UserModel.findByIdAndUpdate(data._id, {
      status: STATUS_DB.ELIMINATED,
    })
    return data
  }
}

export default new UserService()
