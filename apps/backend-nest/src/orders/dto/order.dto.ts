import { IsString, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsString() time: string;
  @IsString() adultNum: string;
  @IsString() childNum: string;
  @IsString() adultPrice: string;
  @IsString() totalMoney: string;
  @IsString() totalLow: string;
  @IsOptional() @IsString() phoneNumber?: string;
}

export class UpdateOrderDto {
  @IsString() _id: string;
  [key: string]: any;
}
