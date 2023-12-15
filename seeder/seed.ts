import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient, Product } from '@prisma/client';
import * as dotenv from 'dotenv'


dotenv.config();
const prisma = new PrismaClient()

const createProsucts = async (quanlity:number)=>{
    const products:Product[] =[]
    for(let i = 0; i< quanlity; i++){
        const productName = faker.commerce.productName()
        const categoryName = faker.commerce.department()
        const product = await prisma.product.create({
            data: {
                name: productName,
                slug: faker.helpers.slugify(productName),
                description: faker.commerce.productDescription(),
                images:Array.from({length:faker.datatype.number({min:2,max:6})}).map(()=>faker.image.imageUrl()),
                
                category: {
                  create: {
                    name: categoryName,
                    slug: faker.helpers.slugify(categoryName),
                  }
                }
              }
        })
        
    }
    console.log(`Create ${products.length} products`)
}
async function main() {
    console.log('start seeding...')
    await createProsucts(30)
}
main()
.catch(e=> console.error(e))
.finally(async()=>{
    await prisma.$disconnect()
})