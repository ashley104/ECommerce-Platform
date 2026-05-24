export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  active?: boolean;
}

export const initialProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    slug: 'wireless-headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    category: 'Electronics',
    stock: 25
  },
  {
    id: 2,
    name: 'Smart Watch',
    slug: 'smart-watch',
    description: 'Fitness tracker with heart rate monitor and GPS',
    price: 399.99,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    category: 'Electronics',
    stock: 15
  },
  {
    id: 3,
    name: 'Cotton T-Shirt',
    slug: 'cotton-t-shirt',
    description: 'Comfortable 100% organic cotton t-shirt',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    category: 'Clothing',
    stock: 50
  },
  {
    id: 4,
    name: 'Denim Jeans',
    slug: 'denim-jeans',
    description: 'Classic fit denim jeans with stretch fabric',
    price: 79.99,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    category: 'Clothing',
    stock: 30
  },
  {
    id: 5,
    name: 'Coffee Maker',
    slug: 'coffee-maker',
    description: 'Programmable coffee maker with thermal carafe',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400',
    category: 'Home',
    stock: 20
  },
  {
    id: 6,
    name: 'Yoga Mat',
    slug: 'yoga-mat',
    description: 'Non-slip exercise mat with carrying strap',
    price: 39.99,
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
    category: 'Sports',
    stock: 40
  },
  {
    id: 7,
    name: 'Laptop Stand',
    slug: 'laptop-stand',
    description: 'Adjustable aluminum laptop stand for ergonomic working',
    price: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
    category: 'Electronics',
    stock: 35
  },
  {
    id: 8,
    name: 'Running Shoes',
    slug: 'running-shoes',
    description: 'Lightweight running shoes with cushioned sole',
    price: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    category: 'Sports',
    stock: 22
  }
];

export type Post = {
  id: number;
  urlId: string;
  title: string;
  content: string;
  description: string;
  imageUrl: string;
  date: Date;
  category: string;
  views: number;
  likes: number;
  tags: string;
  active: boolean;
};

const content = `
  # Title 1

  Illo **sint voluptas**. Error voluptates culpa eligendi. 
  Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
  Sed exercitationem placeat consectetur nulla deserunt vel 
  iusto corrupti dicta laboris incididunt.

  ## Subtitle 1

  Illo sint *voluptas*. Error voluptates culpa eligendi. 
  Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
  Sed exercitationem placeat consectetur nulla deserunt vel 
  iusto corrupti dicta laboris incididunt.
`;

const description = `Illo sint voluptas. Error voluptates culpa eligendi. 
Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
Sed exercitationem placeat consectetur nulla deserunt vel 
iusto corrupti dicta laboris incididunt.`;

export const posts: Post[] = [
  {
    id: 1,
    title: "Boost your conversion rate",
    urlId: "boost-your-conversion-rate",
    description,
    content: content + " ... post1",
    imageUrl:
      "https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80",
    date: new Date("Apr 18, 2022"),
    category: "Node",
    tags: "Back-End,Databases",
    views: 320,
    likes: 3,
    active: true,
  },
  {
    id: 2,
    title: "Better front ends with Fatboy Slim",
    urlId: "better-front-ends-with-fatboy-slim",
    description: `Illo sint voluptas. Error voluptates culpa eligendi. 
       Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
       Sed exercitationem placeat consectetur nulla deserunt vel 
       iusto corrupti dicta laboris incididunt.`,
    content: content + " ... post2",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661342428515-5ca8cee4385a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3",
    date: new Date("Mar 16, 2020"),
    category: "React",
    tags: "Front-End,Optimisation",
    views: 10,
    likes: 1,
    active: true,
  },
  {
    id: 3,
    title: "No front end framework is the best",
    urlId: "no-front-end-framework-is-the-best",
    description: `Illo sint voluptas. Error voluptates culpa eligendi. 
       Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
       Sed exercitationem placeat consectetur nulla deserunt vel 
       iusto corrupti dicta laboris incididunt.`,
    content: content + " ... post3",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1661517706036-a48d5fc8f2f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    date: new Date("Dec 16, 2024"),
    category: "React",
    tags: "Front-End,Dev Tools",
    views: 22,
    likes: 2,
    active: true,
  },
  {
    id: 4,
    title: "Visual Basic is the future",
    urlId: "visual-basic-is-the-future",
    description: `Illo sint voluptas. Error voluptates culpa eligendi. 
       Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. 
       Sed exercitationem placeat consectetur nulla deserunt vel 
       iusto corrupti dicta laboris incididunt.`,
    content: content + " ... post4",
    imageUrl: "https://m.media-amazon.com/images/I/51NqEfmmBTL.jpg",
    date: new Date("Dec 16, 2012"),
    category: "React",
    tags: "Programming,Mainframes",
    views: 22,
    likes: 1,
    active: false,
  },
];