import { Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Response } from 'express'
import { verify } from 'jsonwebtoken'

import { ExpressRequestInterface } from '@app/types/expressRequest.interface'
import { UserService } from '@app/user/user.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null
      return next()
    }

    const token = req.headers.authorization.split(' ')[1]

    try {
      const decode = verify(token, this.configService.get('JWT_SECRET'))
      req.user = await this.userService.findById(decode.id)
    } catch (e) {
      req.user = null
    }

    next()
  }
}
