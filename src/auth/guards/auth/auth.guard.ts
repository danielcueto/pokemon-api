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

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException('No estás autorizado perrito');
    }

    const base64Credentials: string = authHeader.split(' ')[1];
    const credentials: string = Buffer.from(
      base64Credentials,
      'base64',
    ).toString('ascii');

    const [username, password]: [string, string] = credentials.split(':') as [
      string,
      string,
    ];
    return this.authService.validateBasicAuth(username, password);
  }
}
