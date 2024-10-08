import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/dto/create-product.dto';
import { UpdateProductDto } from 'src/dto/update-product.dto';
import { ProductEntity } from 'src/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private productRepository :Repository<ProductEntity>,

    ){}

    findAll():Promise<ProductEntity[]>{
        return this.productRepository.find();
    }


    findOne(id:string):Promise<ProductEntity>{
        return this.productRepository.findOneBy({id});
    }


   async create(createProductDto:CreateProductDto, userId:string):Promise<ProductEntity>{
        const{price,name, description}=createProductDto;
        const product = this.productRepository.create({
            price:price,
            name:name,
            description: description,
            userId : userId
        });
        return this.productRepository.save(product);
    }

    async update(id:string,updateProductDto:UpdateProductDto): Promise<ProductEntity>{
        await this.productRepository.update(id,updateProductDto);
        return this.findOne(id);
    }
    
    async remove(id:string) :Promise<void>{
        await this.productRepository.delete(id);
    }

   /* async getProductsByUserId(userId:string): Promise<ProductEntity[]>{    
        return await this.productRepository.find({
            where: {userId},
        });
    }*/
        async getProductsByUserId(userId: string): Promise<ProductEntity[]> {
            console.log('Fetching products for userId:', userId); // Logging for debugging
            return this.productRepository.find({
                where: { userId: userId },  // userId should be a string (if column type is VARCHAR)
            });
        }
        
}
