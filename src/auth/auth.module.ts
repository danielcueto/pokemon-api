import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard } from './guards/auth/auth.guard';
import { AuthController } from './auth.controller';

@Global()
@Module({
  imports: [UsersModule],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
  controllers: [AuthController],
})
export class AuthModule {}
