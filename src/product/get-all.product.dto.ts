import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/pagination/pagination.dto";

export enum EnumProductSort{
    NEWST = 'newest',
    OLDEST = 'oldest'
}
export class GetAllProductDto extends PaginationDto{
    @IsOptional()
    @IsEnum(EnumProductSort)
    sort?: EnumProductSort

    @IsOptional()
    @IsString()
    seachTerm?:string
}