import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Controller('change-password')
export class ChangePasswordController {
    constructor(private authService: AuthService) {

    }

    @Post()
    create(@Body() credentials, @Res() response) {
        if (credentials && credentials.email && credentials.password && credentials.confirmPassword) {
            if (credentials.password !== credentials.confirmPassword) {
                response.status(HttpStatus.NOT_FOUND).json({ data: 'El password debe coincidir' });
            } else {

                this.authService
                    .changePassword(credentials)
                    .then((data) => response.status(HttpStatus.CREATED).json(data))
                    .catch((error) => response.status(HttpStatus.FORBIDDEN).json(error))
            }
        } else {
            response.status(HttpStatus.NOT_FOUND).json({ data: 'Email, contraseña y confirmacion de contraseña son requeridos' });
        }
    }
}

