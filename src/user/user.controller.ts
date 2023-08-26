import { Controller,Post,HttpStatus,Body, Get, UseGuards, HttpCode} from '@nestjs/common';
import { Request } from 'express'
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
    constructor(private userService : UserService){}
   
    @Post("signup")
    async createAccount(@Body() dto:UserDto){
    
        const response = await this.userService.createUser(dto)

        return response
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard("jwt"))
    @Get("getme")
   async getMe(@GetUser() user:User, @GetUser("email") email:string){
        return user
    }

}
