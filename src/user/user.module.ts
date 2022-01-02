import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'

import { AuthGuard } from '@app/user/guards/auth.guard'
import { UserController } from '@app/user/user.controller'
import { UserService } from '@app/user/user.service'
import { UserEntity } from '@app/user/user.entity'

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, AuthGuard],
  exports: [UserService],
})
export class UserModule {}
