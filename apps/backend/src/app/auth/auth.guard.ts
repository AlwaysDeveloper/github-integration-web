import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';

declare module 'express' {
  export interface Request {
    user?: User;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Access token missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      const user = await this.userService.getUserById(payload.sub);
      if(!user) {
        throw new NotFoundException('User not found!');
      }

      request['user'] = user;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ');

    return type === 'Bearer' ? token : undefined;
  }
}