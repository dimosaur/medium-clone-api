import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'

import { AuthGuard } from '@app/user/guards/auth.guard'
import { User } from '@app/user/decorators/user.decorator'
import { UserEntity } from '@app/user/user.entity'
import { UserService } from '@app/user/user.service'
import { CreateUserDto } from '@app/user/dto/createUser.dto'
import { LoginDto } from '@app/user/dto/login.dto'
import { UpdateUserDto } from '@app/user/dto/updateUser.dto'
import { UserResponseInterface } from '@app/user/types/userResponse.interface'

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserDto)
    return this.userService.buildUserResponse(user)
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginDto: LoginDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginDto)
    return this.userService.buildUserResponse(user)
  }

  @Get('user')
  @UseGuards(AuthGuard)
  currentUser(@User() user: UserEntity): UserResponseInterface {
    return this.userService.buildUserResponse(user)
  }

  @Put('user')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Body('user') updateUserDto: UpdateUserDto,
    @User('id') userId: number,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(userId, updateUserDto)
    return this.userService.buildUserResponse(user)
  }
}
