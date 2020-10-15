import { Controller, Get, Res } from '@nestjs/common';
const config = require('../../../config.json');

@Controller('login-with-cognito')
export class LoginWithCognitoController {
    constructor() { }

    @Get()
    loginWithCognito(@Res() response) {
        // res.redirect('https://app.example.io');
        const url:string = `${config.cognito.amazonCognitoDomain}/signup?response_type=token&client_id=${config.cognito.appClientId}&redirect_uri=${config.cognito.loginRedirect}`
        response.status(200).redirect(url);
    }
}
