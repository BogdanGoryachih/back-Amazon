import { UserService } from './user.service';
import { AuthDto } from 'src/auth/auth.dto';
import { Body, Controller, Get, HttpCode, Param, Patch, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { AuthService } from 'src/auth/auth.service';
import { RefreshTokenDto } from 'src/auth/dto/refresh-token.dto';
import { UserDto } from './user.dto';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

 
  @Get('profile')
  @Auth()
  async getProfile(@CurrentUser('id')id: number){
    return this.userService.byId(id)
  }
  
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('profile')
  async getNewTokens(@CurrentUser('id') id:number,@Body()dto:UserDto){
    return this.userService.updateProfile(id,dto)
  }

  
  @HttpCode(200)
  @Auth()
  @Patch('profile/favorites/:productId')
  async toggleFavorite
  (@Param('productId') productId:string , @CurrentUser('id') id:number){
    return this.userService.toggleFavorite(id,+productId)
  }
  

}
