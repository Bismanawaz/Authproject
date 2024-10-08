import { BadGatewayException,
    BadRequestException,  
    Injectable, 
    InternalServerErrorException, 
    NotAcceptableException, 
    NotFoundException, 
    UnauthorizedException, 
  } from '@nestjs/common';
import { UserLoginDto } from 'src/dto/user-login.dto';
import { UserSignupDto } from 'src/dto/user-signup.dto';
import { UserUpdateDto } from 'src/dto/user-update.dto';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository:Repository<UserEntity>,
        private jwtService: JwtService,
      ){}

        async signup(userSignupDto: UserSignupDto): Promise<any> {
          const { email, password, username } = userSignupDto;
      
          const emailInUse = await this.userRepository.findOne({
            where: { email },
          });
      
          if (emailInUse) {
            throw new BadRequestException('Email is already in use');
          }
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = this.userRepository.create({
            email,
            username,
            password: hashedPassword,
          });
          await this.userRepository.save(newUser);
      
          const payload = { username: newUser.username, userid: newUser.userId };
      
          const token = this.jwtService.sign(payload);
          return {
            message: 'user successfully registerd',
            user: newUser,
            access_token: token,
          };
        }

      async login( userloginDto:UserLoginDto) : Promise<any> {
        const {username, password,email} = userloginDto;
        const user = await this.userRepository.findOne({
            where:{ email },
          });
        if (!user) {
          throw new NotAcceptableException('Invalid email or password');
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
          throw new UnauthorizedException('Invalid password');
        }

        const payload = { username: user.username,userId : String(user.userId)};
        const access_token = this.jwtService.sign(payload);
        const userId = user.userId
        return {
          userId,
          username,
          password,
          email,
          access_token
        };
      }
      async getAllUser(): Promise<UserEntity[]> {
        return await this.userRepository.find();
      }
      async updateUser(updateUserDto : UserUpdateDto): Promise<any>{
        let user = await this.userRepository.findOne({
          where:{ userId :updateUserDto.userId}
        });
        if(!user){
          throw new NotFoundException('User with ID ${updateUserDto.userid} not found');
        }
        user.username = updateUserDto.username || user.username;
        user.email = updateUserDto.email || user.email;
        user.updatedAt = new Date();
        await this.userRepository.save(user);
      // }
      //   catch (error) {
         
      //     console.error(error);
      if(!user)
          throw new InternalServerErrorException('An error occurred while updating the user');
        return{
          success:true,
          message : 'User updated successfully',
          data: user,
        };
      }
    async deleteUser(userId:string):Promise<any>{
      const result = await this.userRepository.delete(userId);

      if(result.affected){
        throw new NotFoundException('this user with Id ${userId} does not exist');
      }
      return{
        success:true,
        message : 'detele successfully',

      };
    }
  }


