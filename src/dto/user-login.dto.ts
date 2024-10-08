import{ IsEmail,IsNotEmpty,IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto{
    @ApiProperty({
        description:'The username of the user',
        example: 'Bisma',
    })

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    username:string;
  
}