import { Prisma } from "@prisma/client";
import { returnCategoryObject } from "src/category/return-category.object";

export const productReturnObject: Prisma.ProductSelect={
    
    images:true,
    description:true,
    id:true,
    name:true,
    createdAT:true,
    slug:true,
    category:{select:returnCategoryObject}
}
export const productReturnObjectFullest:Prisma.ProductSelect = {
    ...productReturnObject,
    
}