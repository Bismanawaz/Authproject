import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './api/auth/auth.service';
import { AuthModule } from './api/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';     
import { UserEntity } from './entities/user.entity';
import { EntityModule } from './entities/entity.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { validate } from 'class-validator';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './api/auth/product/product.module';
import { ProductService } from './api/auth/product/product.service';
import { ProductController } from './api/auth/product/product.controller';
import { ProductEntity } from './entities/product.entity';


@Module({
  imports: [ 
    ConfigModule.forRoot({
      validate,
      expandVariables: true,
    }),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory : async(configService:ConfigService)=>({
        secret : configService.get<string>('jwt.secret'),
        signOptions:{
          expiresIn : configService.get<string>('jwt.expireIn'),
        },
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'abc123',
      database: 'postgres',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    EntityModule,
    PassportModule,
    ProductModule,
    
  ],
  controllers: [AppController, ProductController],
  providers: [AppService, AuthService, ProductService],
})
export class AppModule {}
