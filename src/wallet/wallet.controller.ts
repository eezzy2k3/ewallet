import { Controller,Post,HttpStatus,Body, Get, UseGuards, HttpCode, Param, ParseIntPipe}  from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WalletService } from './wallet.service';
import { GetUser } from 'src/auth/decorator';

@Controller('wallet')
export class WalletController {
    constructor(private walletService:WalletService){}
   
    @UseGuards(AuthGuard("jwt"))
    @Post("create")
    async create(@GetUser("id") id:number){
        const response = await this.walletService.createWallet(id)
        return response

    }

    @UseGuards(AuthGuard("jwt"))
    @Get("wallets")
    async getwallets(@GetUser("id") id:number){
        const response = await this.walletService.getAllWallet(id)
        return response

    }

    @UseGuards(AuthGuard("jwt"))
    @Post("fund/:id")
    async fundWallet( @Param("id",ParseIntPipe) id:number,@Body() dto:any,@GetUser("email") email:string){
        const response = await this.walletService.fundWallet(id,dto,email)
        return response

    }

    @UseGuards(AuthGuard("jwt"))
    @Post("transfer")
    async transfer(@Body() dto:any){
        const response = await this.walletService.transfer(dto)
        return {message:response}

    }

    @UseGuards(AuthGuard("jwt"))
    @Get("balance")
    async getbalance(@GetUser("id") userId:number,@Body("id") id:number ){
        const response = await this.walletService.balance(userId,id)
        return {Balance:response}

    }
}
