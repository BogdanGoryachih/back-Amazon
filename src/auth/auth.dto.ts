import { IsEmail, IsString, MinLength } from "class-validator";

/*data transfer object this name ts  and install npm add class-validator from auth*/ 
export class AuthDto{
    @IsEmail()
    email:string

    @MinLength(6,{
        message: 'Пароль должен быть не менее 6 символов'
    })
    @IsString()
    password:string

    
}