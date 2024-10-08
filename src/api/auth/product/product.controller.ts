import { 
    BadRequestException,
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Post, 
    Put, 
    Req, 
    UseGuards 
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateProductDto } from 'src/dto/create-product.dto';
import { UpdateProductDto } from 'src/dto/update-product.dto';
import { Request } from 'express';
import { RequestWithUser } from 'src/interface/requestwithuser-interface';

@Controller('product')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ProductController {
    constructor(private readonly productService : ProductService){}

    @Get()
    findAll(){
        return this.productService.findAll();
    }
    @Get(':id')
    findOne(@Param('id') id:string){
        return this.productService.findOne(id);
    }
    // @Get('user-product')
    // getProductsByUserId (@Req()req: RequestWithUser){
    //     const userId = req.user.id;
    //     return this.productService.getProductsByUserId(userId);

    // }
   /* @Get('user-product')
    getProductsByUserId(@Req() req: RequestWithUser, ) {
    const userId = req.user.id;  // Assuming req.user.id is a number
     if (typeof userId !== 'string' && typeof userId !== 'number') {
        throw new BadRequestException('User ID must be a number or string');
    }
    const userIdString = userId.toString();

    console.log('Fetching products for userId:', userIdString); // Debugging log

    return this.productService.getProductsByUserId(userId); // Convert userId to string
}*/
    @Get('user-product')
    getProductsByUserId(@Req() req: RequestWithUser) {
    const userId = req.user.id; // This should be a string
    return this.productService.getProductsByUserId(userId);
}
  @Post('create/:id')
    create(@Body() createProductDto:CreateProductDto, @Param('id')userId :string){
        return this.productService.create(createProductDto,userId);
    }
    @Put(':id')
    update(@Param('id') id:string,@Body() updateProductDto :UpdateProductDto){
        return this.productService.update(id,updateProductDto);
    }
    @Delete(':id')
    @ApiParam({
        name: 'id',
        description: 'Id of the user whose account you want to delete.',
      })
    remove(@Param('id') id:string){
        return this.productService.remove(id);
    }

    
}
