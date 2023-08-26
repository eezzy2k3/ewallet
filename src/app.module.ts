import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { TransactionModule } from './transaction/transaction.module';
import { WalletModule } from './wallet/wallet.module';



@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true
  }),
    AuthModule,
     UserModule, 
    PrismaModule, TransactionModule, WalletModule, 
    ]
})
export class AppModule {}
