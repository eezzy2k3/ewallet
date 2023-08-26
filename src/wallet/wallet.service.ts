import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
const Flutterwave = require("flutterwave-node-v3") 
import { ConfigService } from '@nestjs/config';
import { WalletDto } from './dto/wallet.dto';

@Injectable()
export class WalletService {
    
    constructor(private prisma: PrismaService, private config:ConfigService){
    
    }

    async createWallet(userId:number){
        const wallet = await this.prisma.wallet.create({
            data:{
                userId
            }
        })
        return wallet
    }

    async getAllWallet(userId: number){
        const wallets = await this.prisma.wallet.findMany({
            where:{
                userId
            }
        })

        return wallets
    }

    async fundWallet(id:number,dto:any,email:string){
        const wallet = await this.prisma.wallet.findUnique({
            where:{
                id 
            }
        })
        const flutterwave = new Flutterwave(this.config.get("FLW_PUBLIC_KEY"),this.config.get("FLW_SECRET_KEY"))
        const payload =  {
            card_number: dto.card_number,
            cvv: dto.cvv,
            expiry_month: dto.expiry_month,
            expiry_year: dto.expiry_year,
            currency: "NGN",
            amount: dto.amount,
            redirect_url: "https://www.google.com",
            fullname: "test test",
            email,
            "enckey": this.config.get("FLW_ENCRYPTION_KEY"),
            "tx_ref": "test",
        
        }
        try {
            const response = await flutterwave.Charge.card(payload)
            //    console.log(response)
               if (response.meta.authorization.mode === 'pin') {
                    let payload2:any = payload
                    payload2.authorization = {
                        "mode": "pin",
                        "pin": 3310
                    }
                    const reCallCharge = await flutterwave.Charge.card(payload2)
            
                    const callValidate = await flutterwave.Charge.validate({
                        "otp": "12345",
                        "flw_ref": reCallCharge.data.flw_ref
                    })

                    if(callValidate.status === 'success') {
                        wallet.balance = wallet.balance + payload.amount
                        const updatedWallet = await this.prisma.wallet.update({
                            where: {
                              id
                            },
                            data: {
                              balance: wallet.balance,
                            },
                          });
                          return updatedWallet
                }else {
                    throw new BadRequestException("payment failed")
                 }
            }
                
        } catch (error) {
            throw error
        }
        
    }

    async transfer(dto:WalletDto,userId:number){
       try {
        const sender = await this.prisma.wallet.findFirst({
            where:{
                id:dto.id,
                userId
            }
        })

        if(!sender){
            throw new BadRequestException("this wallet does not eist")
        }

        const receiver = await this.prisma.wallet.findFirst({
            where:{
                id:dto.receiverId
            }
        })
            if(!receiver){
                throw new BadRequestException("this wallet does not eist")
            }
        if(sender.balance<dto.amount){
            throw new BadRequestException("insufficient balance")
        }

        const newSenderBalance = sender.balance - dto.amount;
        const newReceiverBalance = receiver.balance + dto.amount;

    

        await this.prisma.$transaction([
            this.prisma.wallet.update({ where: { id: dto.id }, data: { balance: newSenderBalance } }),
            this.prisma.wallet.update({ where: { id: dto.receiverId }, data: { balance: newReceiverBalance } }),
            // this.prisma.transaction.create({
            //   data: {
            //     amount: dto.amount,
            //     walletId: { connect: { id: dto.receiverId } },

            //   },
            // }),
          ]);
          return "transaction successful!"
       } catch (error) {
        throw error
       }
    }

    async balance(userId:number,id:number){
        try {
            const wallet = await this.prisma.wallet.findFirst({
                where:{
                    userId,
                    id
                
                }
            })
            if(!wallet){
                throw new BadRequestException("this wallet does not eist")
            }
            return wallet.balance  
        } catch (error) {
            throw error
        }
        
    }
}
