import { Prisma } from "@prisma/client";

export const returnUserOject:Prisma.UserSelect ={
        id:true,
        email:true,
        avatarPath:true,
        password:false,
        phone:true,
}