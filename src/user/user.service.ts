import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { sign } from 'jsonwebtoken'
import { hash, compare } from 'bcrypt'

import { CreateUserDto } from '@app/user/dto/createUser.dto'
import { UserEntity } from '@app/user/user.entity'
import { UserResponseInterface } from '@app/user/types/userResponse.interface'
import { LoginDto } from '@app/user/dto/login.dto'
import { UpdateUserDto } from '@app/user/dto/updateUser.dto'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<UserEntity> {
    let user = new UserEntity()
    Object.assign(user, userDto)

    try {
      user = await this.userRepository.save(user)
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          'Username or Email are taken',
          HttpStatus.UNPROCESSABLE_ENTITY,
        )
      }
    }

    delete user.password
    return user
  }

  async login(loginDto: LoginDto): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: loginDto.email })
      .getOne()

    if (!user) {
      throw new HttpException(
        'Invalid credentials',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    const isPasswordCorrect = await compare(loginDto.password, user.password)

    if (!isPasswordCorrect) {
      throw new HttpException(
        'Invalid credentials',
        HttpStatus.UNPROCESSABLE_ENTITY,
      )
    }

    delete user.password
    return user
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    let user = await this.findById(id)
    Object.assign(user, updateUserDto)

    if (updateUserDto.password) {
      user.password = await hash(updateUserDto.password, 10)
    }

    try {
      user = await this.userRepository.save(user)
    } catch (error) {
      if (error.code === '23505') {
        throw new HttpException(
          'Username or Email are taken',
          HttpStatus.UNPROCESSABLE_ENTITY,
        )
      }
    }

    delete user.password
    return user
  }

  findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id)
  }

  generateJWT(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      this.configService.get('JWT_SECRET'),
    )
  }

  buildUserResponse(user: UserEntity): UserResponseInterface {
    return { user: { ...user, token: this.generateJWT(user) } }
  }
}
