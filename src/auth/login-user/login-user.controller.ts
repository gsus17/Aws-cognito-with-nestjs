import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Controller('login-user')
export class LoginUserController {
    constructor(private authService: AuthService) { }

    @Post()
    login(@Body() credentials, @Res() response) {
        if (credentials && credentials.email && credentials.password) {
            this.authService
                .login(credentials)
                .then((data) => response.status(HttpStatus.CREATED).json(data))
                .catch((error) => response.status(HttpStatus.FORBIDDEN).json(error))
        } else {
            response.status(HttpStatus.NOT_FOUND).json({ data: 'Email, contraseña y confirmacion de contraseña son requeridos' });
        }
    }
}
