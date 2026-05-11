import { PrismaClient } from '@prisma/client';
import { initialProducts } from './data.js';
export async function seed() {
  const client = new PrismaClient();
  console.log("🌱 Seeding data");
  for (const product of initialProducts) {
    await client.product.create({
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        stock: product.stock,
        slug: product.slug,
      },
    });
  }
  
  // TODO: Uncomment below once you set up Prisma and loaded data to your database

  // console.log("🌱 Seeding data");
  // await client.like.deleteMany();
  // await client.post.deleteMany();
  // for (const post of posts) {
  //   await client.post.create({
  //     data: {
  //       title: post.title,
  //       content: post.content,
  //       category: post.category,
  //       description: post.description,
  //       imageUrl: post.imageUrl,
  //       tags: post.tags
  //         .split(",")
  //         .map((p) => p.trim())
  //         .join(","),
  //       urlId: post.urlId,
  //       active: post.active,
  //       date: post.date,
  //       id: post.id,
  //       views: post.views,
  //     },
  //   });
  //   for (let i = 0; i < post.likes; i++) {
  //     await client.like.create({
  //       data: {
  //         postId: post.id,
  //         userIP: `192.168.100.${i}`,
  //       },
  //     });
  //   }
  // }
}
