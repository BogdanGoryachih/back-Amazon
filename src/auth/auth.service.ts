import { BadGatewayException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AuthDto } from './auth.dto';
import {faker, th} from "@faker-js/faker"
import { hash, verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';


// faker this fake data auth 
@Injectable()
export class AuthService {
    
    constructor(private prisma:PrismaService , private jwt:JwtService){}
// login 
    async login(dto:AuthDto){
        const user = await this.validateUser(dto)
        const tokens = await this.issueTokens(user.id)
        return{
            user:this.returnUserFields(user),
            ...tokens
        }
    }
// login

// getnewTokens
    async getNewTokens(refreshToken:string){
      
        const result = await this.jwt.verifyAsync(refreshToken)
        if(!result) throw new UnauthorizedException('invalid refresh token')

        const user= await this.prisma.user.findUnique({where:{
            id:result.id
        }})
        const tokens = await this.issueTokens(user.id)
        return{
            user:this.returnUserFields(user),
            ...tokens
        }
    }
// end tokens 
    async register(dto:AuthDto){
        const oldUser = await this.prisma.user.findUnique({
            where:{
                email:dto.email
            }
        })
        if(oldUser) throw new BadGatewayException('user alredy exists')

        const user = await this.prisma.user.create({
            data:{
                email:dto.email,
                name: faker.name.firstName(),
                avatarPath:faker.image.avatar(),
                phone:faker.phone.number('+380'),
                password: await hash(dto.password)
            }
        })

        const tokens = await this.issueTokens(user.id)
        return{
            user: this.returnUserFields(user),
            ...tokens
        }
    }
    private async issueTokens(userId: number){
        const data = {id:userId}
        const accessToken = this.jwt.sign(data,{
            expiresIn: '1h',

        })
        const refreshToken = this.jwt.sign(data,{
            expiresIn: '10d',
            
        })
        return {accessToken,refreshToken}
    }
    private returnUserFields(user:User){
        return{
            id:user.id,
            email:user.email
            
        }
    }
    private async validateUser (dto:AuthDto){
        const user = await this.prisma.user.findUnique({
            where:{
                email:dto.email
            }
        })
        if(!user) throw new NotFoundException('User not found')

        const isValid = await verify(user.password,dto.password)

        if(!isValid) throw new UnauthorizedException('Invalid password')

        return user
    }
}
