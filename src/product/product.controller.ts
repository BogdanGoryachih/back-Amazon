import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetAllProductDto } from './get-all.product.dto';
import { Auth } from 'src/auth/decorators/auth.decorators';
import { ProductDto } from './product.dto';

@Controller('products')
export class ProductController{
  constructor(private readonly productSevise:ProductService){}
    @UsePipes(new ValidationPipe())
    @Get()
    async getAll(@Query() queryDto:GetAllProductDto){
      return this.productSevise.getAll(queryDto)
    }

    @Get('similar/:id')
    async getSimilar(@Param('id') id:string){
      return this.productSevise.getSimilar(+id)
    }
    @Get('by-slug/:id')
    async getProductBySlug(@Param('id') slug:string){
      return this.productSevise.bySlug(slug)
    }
//     @Get('by-slug/:id')
// async getProductBySlug(@Param('id') slug: string) {
//   return this.productService.bySlug(slug);
// }

    
    
    @Get('by-category/:categorySlug')
    async getproductByCategory(@Param('categorySlug')categorySlug:string){
      return this.productSevise.byCategory(categorySlug)
    }
    
    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Auth()
    @Post()
    async createProduct(){
      return this.productSevise.create()
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Put(':id')
    @Auth()
    async updateProduct(@Param('id') id:string, @Body() dto:ProductDto){
      return this.productSevise.update(+id,dto)
    }
    @HttpCode(200)
    @Delete(':id')
    @Auth()
    async deleteProduct(@Param('id') id:string){
      return this.productSevise.delete(+id)
    }
    @Get(':id')
    @Auth()
    async getProduct(@Param('id') id:string){
      return this.productSevise.byId(+id)
    }
}
