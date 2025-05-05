import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers[
      'authorization'
    ] as string;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No estás autorizado perrito');
    }
    const token = authHeader.split(' ')[1];
    const isValid = await this.authService.validateToken(token);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido o no existe');
    }
    return true;
  }
}
