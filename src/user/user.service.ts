import { Injectable, ForbiddenException} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma }  from '@prisma/client'



@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: UserDto) {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 12);

      const createUser = await this.prisma.user.create({
        data: {
          ...dto,
          password: hashedPassword,
        },
      });
      delete createUser.password;
      return createUser;
    } catch (error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            if(error.code == "P2002"){
                throw new ForbiddenException(`email ${dto.email} already exist`)
            }
        }
        throw error
    } 
  }

}
