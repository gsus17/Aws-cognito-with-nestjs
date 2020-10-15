import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Controller('create-user')
export class CreateUserController {
    constructor(private authService: AuthService) {}

    @Post()
    create(@Body() credentials, @Res() response) {
        if (credentials && credentials.email && credentials.temporaryPass && credentials.confirmPassword) {
            if (credentials.temporaryPass !== credentials.confirmPassword) {
                response.status(HttpStatus.NOT_FOUND).json({ data: 'El password debe coincidir' });
            } else {

                this.authService
                    .createUser(credentials)
                    .then((data) => response.status(HttpStatus.CREATED).json(data))
                    .catch((error) => response.status(HttpStatus.FORBIDDEN).json(error))
            }
        } else {
            response.status(HttpStatus.NOT_FOUND).json({ data: 'Email, contraseña y confirmacion de contraseña son requeridos' });
        }
    }
}
