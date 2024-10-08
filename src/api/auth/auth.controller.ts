import { Body, 
    Controller, 
    Delete, 
    Get,
    Param,
    Post,
    Put,
    UseGuards 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto } from 'src/dto/user-login.dto';
import{ UserSignupDto } from 'src/dto/user-signup.dto';
import { UserUpdateDto } from 'src/dto/user-update.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiParam, ApiResponse,ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor (private readonly authService:AuthService){}

    @Post('signup')
    @ApiResponse({ status: 201, description:'User successful register.'})
    @ApiResponse({status:400, description:'Bad Request'}) 

    async signup(@Body() userSignupDto: UserSignupDto): Promise<any> {
        return this.authService.signup(userSignupDto);
    }
    @Post('login')
    @ApiResponse({ status: 200, description:'Login successful.'})
    @ApiResponse({status:401, description:'Unauthorized'}) 

    async login(@Body() userloginDto:UserLoginDto): Promise<any>{
        return this.authService.login(userloginDto);
    }
    @Get('getAllUser')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'User profile fetched successfully.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async getAllUser():Promise<any>{
        return await this.authService.getAllUser();
    }
    @Put('/updateUser/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
     async updateUser(@Param('id') id : string, 
     @Body()updateUserDto:UserUpdateDto): Promise<any>{
            updateUserDto.userId = id;
        return this.authService.updateUser(updateUserDto);  
     }
    @Delete('/deleteUser/:id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiParam({
        name: 'id',
        description: 'Id of the user whose account you want to delete.',
      })
    async deleteUser(@Param('id') userId:string){
        return this.authService.deleteUser(userId);
    }

}
