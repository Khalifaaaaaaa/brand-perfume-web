export interface Perfume {
  id: number;
  name: string;
  price: string;
  scentFamily: string;
  image: string;
  hoverImage: string;
}

export const perfumes: Perfume[] = [
  {
    id: 1,
    name: "Hala-Hala Bloom",
    price: "1,250",
    scentFamily: "Fresh Floral",
    image: "/perfumes/p1.png",
    hoverImage: "/perfumes/ps1.png",
  },
  {
    id: 2,
    name: "Guimaras Nectar",
    price: "1,450",
    scentFamily: "Sweet Fruity",
    image: "/perfumes/p2.png",
    hoverImage: "/perfumes/ps2.png",
  },
  {
    id: 3,
    name: "Visayan Mist",
    price: "1,100",
    scentFamily: "Aquatic",
    image: "/perfumes/p3.png",
    hoverImage: "/perfumes/ps3.png",
  },
  {
    id: 4,
    name: "Baclayon Oud",
    price: "1,850",
    scentFamily: "Woody Spicy",
    image: "/perfumes/p4.png",
    hoverImage: "/perfumes/ps4.png",
  },
];