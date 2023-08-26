import { IsNumber, IsNotEmpty } from 'class-validator';

export class WalletDto {
 
  
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  receiverId: number;
}
