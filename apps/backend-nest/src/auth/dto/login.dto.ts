import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  inputName: string;

  @IsString()
  inputPassword: string;

  @IsString()
  powerId: string;
}
