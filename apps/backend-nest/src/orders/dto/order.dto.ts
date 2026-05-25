import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsString() time: string;
  @IsString() platform: string;
  @IsString() payWay: string;
  @IsString() depositePayWay: string;
  @IsNumber() adultNum: number;
  @IsNumber() childNum: number;
  @IsNumber() accidentNum: number;
  @IsNumber() deposite: number;
  @IsNumber() totalMoney: number;
  @IsString() isReback: string;
  @IsString() ifFinish: string;
  @IsOptional() @IsString() saler?: string;
  @IsOptional() @IsString() phoneNumber?: string;
  @IsOptional() @IsString() remark?: string;
}

export class UpdateOrderDto {
  @IsString() _id: string;
  [key: string]: any;
}
