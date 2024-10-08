import{ IsEmail,IsNotEmpty,IsNumber,IsPositive,IsString } from 'class-validator';

export class CreateProductDto{
    
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsNotEmpty()
    name:string;

    // @IsString()
    // userId: string;
  
}