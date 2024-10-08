import { IsEmail, IsOptional, IsString } from "class-validator";

export class UserUpdateDto{

        @IsString()
        username:string;

        @IsEmail()
        email?: string;
    
        @IsString()
        password?:string; 
        
        @IsOptional()
        @IsString()
        userId?: string;
}