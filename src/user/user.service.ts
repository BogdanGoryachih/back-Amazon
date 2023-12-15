import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { returnUserOject } from './return-user.object';
import { Prisma } from '@prisma/client';
import { UserDto } from './user.dto';
import { hash } from 'argon2';


@Injectable()
export class UserService {
    constructor(private prisma:PrismaService  ){}
    async byId(id:number , selectObject:Prisma.UserSelect = {}){
        const user = await this.prisma.user.findUnique({
         where:{
            id
        },
        
        select:{
            ...returnUserOject,
            favorites:{
                select:{
                    id:true,
                    name:true,
                    images:true,
                    slug:true,
                    category:{
                        select:{
                            slug:true
                        }
                    }
                }
            },
            ...selectObject
        }
    })
    if(!user){
        throw new Error('user not found')
    }
    return user
    }
    async updateProfile(id:number, dto:UserDto){
        const isSamerUser = await this.prisma.user.findUnique({
            where:{email:dto.email}
        })
        if(isSamerUser && id === isSamerUser.id)
        throw new BadRequestException('Email Занят')
         
        const user = await this.byId(id)
        return this.prisma.user.update({
            where:{
                id
            },
            data:{
                email: dto.email,
                name: dto.name,
                avatarPath: dto.avatarPath,
                phone: dto.phone,
                password: dto.password? await hash(dto.password):user.password
            }
        })
    }
    async toggleFavorite(userId:number,productId:number){
        const user = await this.byId(userId)

        if(!user) throw new NotFoundException('user not found')
        
        const isExist = user.favorites.some(product => product.id === productId)
        await this.prisma.user.update({
            where:{
                id:user.id
            },
            data:{
                favorites:{
                    
                        [isExist ? 'disconnect':'connect']:{
                            id:productId
                        }
                    //4.56
                }
            }
        })
        return "success"
    }
    
}

