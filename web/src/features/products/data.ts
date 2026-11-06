export const products = [
  {
    slug: "banana-crunch",
    name: "Banana Crunch",
    category: "Fruit",
    tone: "banana",
    texture: "/brand/banana.webp",
    image: "/brand/banana-pack.webp",
    description:
      "A sweet, crunchy banana snack made with bananas and coconut oil.",
    ingredients: "Bananas, coconut oil",
    sizes: "100 g and 250 g",
  },
  {
    slug: "jackfruit-crunch",
    name: "Jackfruit Crunch",
    category: "Fruit",
    tone: "jackfruit",
    texture: "/brand/jackfruit.webp",
    image: "/brand/jackfruit-pack.webp",
    description:
      "A golden, crispy tropical snack with the natural sweetness of jackfruit.",
    ingredients: "Jackfruit, coconut oil",
    sizes: "100 g",
  },
  {
    slug: "apple-crunch",
    name: "Apple Crunch",
    category: "Fruit",
    tone: "apple",
    texture: "/brand/apple.webp",
    image: "/brand/apple-pack.webp",
    description: "A light, crisp green apple snack with a mild sour note.",
    ingredients: "Green apples, coconut oil",
    sizes: null,
  },
  {
    slug: "broccoli-crunch",
    name: "Broccoli Crunch",
    category: "Vegetable",
    tone: "broccoli",
    texture: "/brand/broccoli.webp",
    image: "/brand/broccoli-pack.webp",
    description: "A crispy, savory snack made with broccoli and coconut oil.",
    ingredients: "Broccoli, coconut oil",
    sizes: "100 g",
  },
] as const;

export type Product = (typeof products)[number];
