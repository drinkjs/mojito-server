import { IsNotEmpty } from "ngulf/class-validator";

export class LoginDto {
  @IsNotEmpty()
  code!: string;

  @IsNotEmpty()
  from!: string;
  
  redirectUri?: string;
}