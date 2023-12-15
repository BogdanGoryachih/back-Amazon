import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { productReturnObject, productReturnObjectFullest } from './return-product-object';
import { ProductDto } from './product.dto';
import { generateSlug } from 'src/utils/generete.slug';
import { GetAllProductDto } from './get-all.product.dto';
import { Prisma } from '@prisma/client';
import { EnumProductSort } from './get-all.product.dto';
import { PaginationService } from 'src/pagination/pagination.service';

@Injectable()
export class ProductService {
    constructor(private prisma:PrismaService , private paginationService: PaginationService){}
    async getAll(dto:GetAllProductDto){
       const {sort,seachTerm} = dto 
       const prismaSort:Prisma.ProductOrderByWithRelationInput [] = []

       if(sort === EnumProductSort.NEWST)
       prismaSort.push({createdAT: 'desc'})
       else if(sort === EnumProductSort.OLDEST)
       prismaSort.push({createdAT: 'asc'})
       else
       prismaSort.push({createdAT: 'desc'})

       const prismaSearchTermFilter:Prisma.ProductWhereInput = seachTerm?{
        OR:[
           {
            category:{
                name:{
                    contains:seachTerm,
                    mode: 'insensitive'
                }
            },
            name:{
                contains:seachTerm,
                mode: 'insensitive'
            },
            description:{
                contains:seachTerm,
                mode: 'insensitive'
            }
           } 
        ]
       }:{}
       const {skip,perPage} = this.paginationService.getPaginations(dto)
       const products = await this.prisma.product.findMany({
        where:prismaSearchTermFilter,
        orderBy: prismaSort,
        skip,
        take:perPage,
        select: productReturnObject
       })
       return {products, length: await this.prisma.product.count({ where:prismaSearchTermFilter})}
    }
    
    async byId(id:number  ){
        const product = await this.prisma.product.findUnique({
         where:{
            id
        },
        
        select:productReturnObjectFullest,
            
        
            
        
    })
    if(!product){
        throw new Error('product not found')
    }
    return product
    }
    async bySlug(slug:string ){
        const product = await this.prisma.product.findUnique({
         where:{

            slug
        },
        
        select: productReturnObject
            
        
    })
        if(!product){
            throw new NotFoundException('category not found')
        }
        return product
    }

    async byCategory(categorySlug:string ){
        const products= await this.prisma.product.findMany({
         where:{
            category:{
                slug:categorySlug
            }
        },
        
        select: productReturnObjectFullest
            
        
    })
        if(!products){
            throw new NotFoundException('category not found')
        }
        return products
    }
    async getSimilar(id:number){
        const currentProduct = await this.byId(id)
        if(!currentProduct)
        throw new NotFoundException('current product not found')

        const products = await this.prisma.product.findMany({
            where:{
                category:{
                    name:currentProduct.category.name
                },
                NOT:{
                    id:currentProduct.id
                }
            },
            orderBy:{
                createdAT: 'desc'
            },
            select:productReturnObject
        })
        return products
    }
    
    

    async create (){
    const product = await this.prisma.product.create({
            data:{
                description: '',
                name: '',
                slug: ''
            }
        })
        return product.id
    }

    async update(id:number, dto:ProductDto){
         const {description,images,name,categoryId} = dto
         return this.prisma.product.update({
            where:{
                id
            },
            data:{
                description,
                images,
                name,
                slug:generateSlug(name),
                category:{
                    connect:{
                        id:categoryId
                    }
                }
            }
         })
        
    }
    async delete(id:number){
         
        return this.prisma.product.delete({
            where:{
                id
            },
            
        })
    }
}
