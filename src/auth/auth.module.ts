import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserController } from './create-user/create-user.controller';
import { LoginUserController } from './login-user/login-user.controller';
import { ChangePasswordController } from './change-password/change-password.controller';
import { LoginWithCognitoController } from './login-with-cognito/login-with-cognito.controller';

@Module({
  controllers: [CreateUserController, LoginUserController, ChangePasswordController, LoginWithCognitoController],
  providers: [AuthService]
})
export class AuthModule {}
