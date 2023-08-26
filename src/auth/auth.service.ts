import { Injectable,ForbiddenException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { generatePassword } from './generate.password';
import sendMail from './sendmail';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService ){}

    async login(dto:AuthDto){
        try {
            const user = await this.prisma.user.findUnique({
                where:{
                    email:dto.email
                }
            })
            if(!user) throw new ForbiddenException("Invalid Credentials")
            const correctPassword = await bcrypt.compare(dto.password,user.password )
            if(!correctPassword) throw new ForbiddenException("Invalid Credentials")
            const token = await this.signToken(user.id,user.email)
            return {accessToken:token}
        } catch (error) {
            throw error
        }

    }

    async signToken(userId: number,email: string):Promise<string>{
        const payload = {
            sub:userId,
            email
        }

        const secret = this.config.get("JWT_SECRET")

       return  await this.jwt.sign(payload,{
            expiresIn: "15m",
            secret: secret
        })
    }

    async resetPassword(email:string){
        const user = await this.prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!user) throw new BadRequestException("This Account does not exist")

        const newPassword = generatePassword(9);

       
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        console.log(newPassword)

        
        const updateUser = await this.prisma.user.update({
            where:{
                email:user.email
            },
            data:{
                password:hashedPassword
            }
        })

        const message = `<h1>Password Reset</h1>
            <h2>Hello ${user.name}</h2>
            <p>New password : ${newPassword}</p>
            <p>Use the auto generated Password to log in and proceed to change it.Thank you</p>
            </div>`

            try{
                await sendMail({
                     email:user.email,
                     subject:"Password Reset",
                     message
                 })
             }catch(error){
                throw error
             }
             return "Password reset successful!"
    }
}
