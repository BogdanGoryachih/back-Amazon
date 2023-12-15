import { IsEmail, IsOptional, IsString } from "class-validator";

export class UserDto{
    @IsEmail()
    email: string

    @IsString()
    @IsOptional()
    password?: string

    @IsString()
    @IsOptional()
    avatarPath: string

    @IsString()
    @IsOptional()
    phone?:string

    @IsString()
    @IsOptional()
    name: string
}
