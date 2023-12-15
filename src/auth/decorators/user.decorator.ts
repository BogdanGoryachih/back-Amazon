import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from "@prisma/client";

export const CurrentUser = createParamDecorator(
    (data: keyof User, ctx:ExecutionContext)=>{
        const reqest = ctx.switchToHttp().getRequest()
        const user = reqest.user
        return data? user[data]:user
    }
)