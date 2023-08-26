import { Controller,Post,Body,HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @HttpCode(HttpStatus.OK)
    @Post("login")
    async signin(@Body() dto:AuthDto){
        
        const response = await this.authService.login(dto)
        return response
    }
    @HttpCode(HttpStatus.OK)
    @Post("resetpassword")
    async resetPassword(@Body("email") email:string){
        
        const response = await this.authService.resetPassword(email)
        return {message:response}
    }

}
