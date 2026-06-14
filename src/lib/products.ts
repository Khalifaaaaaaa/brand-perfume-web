export type ProductStockStatus = "in-stock" | "low-stock" | "out-of-stock";

export interface InventoryProductRow {
  name: string;
  unit: string;
  stock: number;
}

export interface ProductProfile {
  scentFamily: string;
  category: string;
  subtext: string;
  description: string;
  notes: string[];
}

export interface Product {
  id: number;
  code: string;
  slug: string;
  name: string;
  price: string;
  priceValue: number;
  currency: "PHP";
  scentFamily: string;
  category: string;
  subtext: string;
  description: string;
  notes: string[];
  ingredients: string[];
  specifications: string[];
  image: string;
  hoverImage: string;
  stock: number;
  unit: string;
  stockStatus: ProductStockStatus;
  isAvailable: boolean;
  salesCount: number;
  isPlaceholderPrice: boolean;
  isPlaceholderContent: boolean;
  dataSource: "Excel inventory file";
}

export type Perfume = Product;

export const PRODUCT_DATA_NOTICE =
  "Product names, unit, and stock are from the uploaded Excel inventory file. Prices, categories, descriptions, notes, ingredients/specs, and images are temporary placeholders until official product details are provided.";

export const PLACEHOLDER_PRICE_NOTICE =
  "All prices are temporary placeholders because the uploaded Excel file did not include selling prices.";

export const DEFAULT_PLACEHOLDER_PRICE = 399;

export const rawInventoryProducts: InventoryProductRow[] = [
  { name: "ABSOLUTELY STUNNING", unit: "PC", stock: 19 },
  { name: "ADDICT TO LIFE/I DON'T CARE", unit: "PC", stock: 24 },
  { name: "ADDICT W", unit: "PC", stock: 9 },
  { name: "AFENTIKO/HUGO BOSS", unit: "PC", stock: 2 },
  { name: "ARMANI AQUA/SAVE ME A DATE", unit: "PC", stock: 329 },
  { name: "AVENTUS", unit: "PC", stock: 67 },
  { name: "BARE VANILLA", unit: "PC", stock: 3 },
  { name: "BARE VANILLA DECADENT", unit: "PC", stock: 4 },
  { name: "BE ENCHANTED", unit: "PC", stock: 73 },
  { name: "BENETTON HOT GOLD", unit: "PC", stock: 137 },
  { name: "BLACK ORCHID", unit: "PC", stock: 42 },
  { name: "BLEU", unit: "PC", stock: 85 },
  { name: "BLOOMING BOQUET", unit: "PC", stock: 87 },
  { name: "BOMBSHELL", unit: "PC", stock: 715 },
  { name: "BOMBSHELL INTENSE", unit: "PC", stock: 18 },
  { name: "BOMBSHELL SEDUCTION", unit: "PC", stock: 117 },
  { name: "BRIGHT CRYSTAL", unit: "PC", stock: 9 },
  { name: "BRITNEY FANTASY", unit: "PC", stock: 333 },
  { name: "BULGARI AQUA", unit: "PC", stock: 93 },
  { name: "BURBERRY HER/FLORELIA", unit: "PC", stock: 5 },
  { name: "BURBERRY LONDON/HOUSE SUMMER", unit: "PC", stock: 41 },
  { name: "BURBERRY WEEKEND FOR WOMEN", unit: "PC", stock: 108 },
  { name: "CARRIBEAN BLUE", unit: "PC", stock: 119 },
  { name: "CARRIED AWAY", unit: "PC", stock: 39 },
  { name: "CERTIFIED BACHELOR", unit: "PC", stock: 18 },
  { name: "CHAMPAGNE AND HONEY", unit: "PC", stock: 10 },
  { name: "CHANEL NO. 5", unit: "PC", stock: 157 },
  { name: "CICERO/BULGARI POUR HOMME 1996", unit: "PC", stock: 17 },
  { name: "CITRINE/WEEKEND MEN", unit: "PC", stock: 217 },
  { name: "CLINIQUE HAPPY MEN", unit: "PC", stock: 344 },
  { name: "CLINIQUE HAPPY WOMEN", unit: "PC", stock: 346 },
  { name: "COOL WATER FOR MEN", unit: "PC", stock: 85 },
  { name: "COOL WATER FOR WOMEN", unit: "PC", stock: 16 },
  { name: "COTTON BLOSSOM", unit: "PC", stock: 45 },
  { name: "DESIRE", unit: "PC", stock: 10 },
  { name: "ECLAT D ARPEGE MEN", unit: "PC", stock: 2 },
  { name: "EGOISTE PLATINUM", unit: "PC", stock: 6 },
  { name: "ETERNITY WOMEN", unit: "PC", stock: 139 },
  { name: "FALLING INTO YOU/L' INTERDIT", unit: "PC", stock: 48 },
  { name: "FOR HER", unit: "PC", stock: 17 },
  { name: "GARDEN ROSE", unit: "PC", stock: 18 },
  { name: "GUILTY/BAVARIA", unit: "PC", stock: 123 },
  { name: "INFINITY/ETERNITY MEN", unit: "PC", stock: 369 },
  { name: "INVICTUS (CITRUS AND LEMON)", unit: "PC", stock: 33 },
  { name: "JAFAR - EROS", unit: "PC", stock: 77 },
  { name: "LACOSTE RED", unit: "PC", stock: 23 },
  { name: "LACOSTE WHITE", unit: "PC", stock: 13 },
  { name: "LADY MILLION LUCKY", unit: "PC", stock: 75 },
  { name: "LIGHTE BLUE - WOMEN", unit: "PC", stock: 77 },
  { name: "LILY BUTTERFLY", unit: "PC", stock: 1 },
  { name: "LOVE & HATE MEN", unit: "PC", stock: 105 },
  { name: "LOVE & HATE WOMEN", unit: "PC", stock: 37 },
  { name: "LOVE SPELL", unit: "PC", stock: 223 },
  { name: "LOVESPELL DECADENT", unit: "PC", stock: 56 },
  { name: "MAN NEXT TO YOU/POLO RED", unit: "PC", stock: 7 },
  { name: "MELON DEW", unit: "PC", stock: 12 },
  { name: "MS. FABULOUS", unit: "PC", stock: 9 },
  { name: "MY JADE/MY BURBERRY", unit: "PC", stock: 257 },
  { name: "MY WAY", unit: "PC", stock: 6 },
  { name: "NECTARINE BLOSSOM", unit: "PC", stock: 178 },
  { name: "NUT BLANCHE", unit: "PC", stock: 12 },
  { name: "POINT BLANK-CK ONE", unit: "PC", stock: 215 },
  { name: "POLO BLUE", unit: "PC", stock: 33 },
  { name: "REBEL", unit: "PC", stock: 24 },
  { name: "ROMANTIC WISH", unit: "PC", stock: 61 },
  { name: "SAUVAGE", unit: "PC", stock: 34 },
  { name: "SEDUCTION", unit: "PC", stock: 9 },
  { name: "SILVER MOUNTAIN WATER", unit: "PC", stock: 94 },
  { name: "TAYLOR SWIFT", unit: "PC", stock: 13 },
  { name: "THE BOY NEXT DOOR/BOSS ORANGE", unit: "PC", stock: 17 },
  { name: "THE GIRL NEXT DOOR", unit: "PC", stock: 11 },
  { name: "UN JARDINE SUR LE TOIT", unit: "PC", stock: 120 },
  { name: "VEILED EMPRESS", unit: "PC", stock: 13 },
  { name: "WHITE CITRUS", unit: "PC", stock: 26 },
  { name: "WINTER IN KASHMIR/TRESOR", unit: "PC", stock: 144 },
  { name: "WINTERSCAPE", unit: "PC", stock: 3 },
  { name: "WOMAN NEXT TO YOU/POISON 1985", unit: "PC", stock: 37 },
];

const productProfiles: Record<string, ProductProfile> = {
  floral: {
    scentFamily: "Floral",
    category: "Floral Eau de Parfum",
    subtext: "A soft floral profile with an elegant everyday trail.",
    description:
      "A graceful floral-inspired fragrance created for polished everyday wear, leaving a clean and feminine trail.",
    notes: ["Fresh petals", "Soft jasmine", "Clean musk"],
  },
  fruity: {
    scentFamily: "Fruity Floral",
    category: "Fruity Floral Eau de Parfum",
    subtext: "Bright fruit notes softened by delicate floral warmth.",
    description:
      "A playful fruity-floral scent with a sweet opening, a polished heart, and a smooth musky finish.",
    notes: ["Juicy berries", "Fresh blooms", "Soft vanilla musk"],
  },
  vanilla: {
    scentFamily: "Sweet Gourmand",
    category: "Gourmand Eau de Parfum",
    subtext: "Creamy sweetness with a soft, cozy finish.",
    description:
      "A warm gourmand fragrance with creamy sweetness and a comforting trail for casual, cozy days.",
    notes: ["Creamy vanilla", "Warm sugar", "Soft amber"],
  },
  fresh: {
    scentFamily: "Fresh Clean",
    category: "Fresh Eau de Parfum",
    subtext: "Clean, airy freshness for easy everyday wear.",
    description:
      "A clean fresh fragrance with an airy feel, made for effortless daily wear and a crisp finish.",
    notes: ["Clean citrus", "Fresh air accord", "White musk"],
  },
  aquatic: {
    scentFamily: "Aquatic Fresh",
    category: "Aquatic Eau de Parfum",
    subtext: "Cool watery freshness with a smooth clean dry down.",
    description:
      "A refreshing aquatic-inspired scent with a cool opening and a polished, clean woody base.",
    notes: ["Marine accord", "Cool citrus", "Clean woods"],
  },
  citrus: {
    scentFamily: "Citrus Fresh",
    category: "Citrus Eau de Parfum",
    subtext: "Sparkling citrus freshness with a clean finish.",
    description:
      "A bright citrus fragrance with sparkling freshness, ideal for warm days and clean everyday wear.",
    notes: ["Bergamot", "Fresh lemon", "White musk"],
  },
  woody: {
    scentFamily: "Woody Aromatic",
    category: "Woody Eau de Parfum",
    subtext: "Smooth woods with a refined aromatic character.",
    description:
      "A refined woody fragrance with aromatic brightness and a smooth, confident dry down.",
    notes: ["Aromatic herbs", "Cedarwood", "Soft musk"],
  },
  spicy: {
    scentFamily: "Amber Spicy",
    category: "Amber Spicy Eau de Parfum",
    subtext: "Warm spice and amber for a deeper evening trail.",
    description:
      "A warm spicy fragrance with depth and presence, designed for evenings and statement wear.",
    notes: ["Warm spice", "Amber", "Dark musk"],
  },
  romantic: {
    scentFamily: "Romantic Floral",
    category: "Romantic Eau de Parfum",
    subtext: "Soft, charming, and made for memorable moments.",
    description:
      "A romantic fragrance with gentle sweetness, floral charm, and a soft feminine trail.",
    notes: ["Blushing petals", "Sweet fruits", "Soft musk"],
  },
  luxury: {
    scentFamily: "Luxury Amber",
    category: "Signature Eau de Parfum",
    subtext: "Elegant warmth with a polished signature finish.",
    description:
      "A polished signature fragrance with an elegant balance of warmth, softness, and long-lasting presence.",
    notes: ["Soft florals", "Amber woods", "Velvet musk"],
  },
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const getProductStockStatus = (stock: number): ProductStockStatus => {
  if (stock <= 0) {
    return "out-of-stock";
  }

  if (stock <= 5) {
    return "low-stock";
  }

  return "in-stock";
};

const getProductProfile = (productName: string): ProductProfile => {
  const normalizedName = productName.toLowerCase();

  if (
    normalizedName.includes("vanilla") ||
    normalizedName.includes("sugar") ||
    normalizedName.includes("cake") ||
    normalizedName.includes("decadent") ||
    normalizedName.includes("bare")
  ) {
    return productProfiles.vanilla;
  }

  if (
    normalizedName.includes("aqua") ||
    normalizedName.includes("water") ||
    normalizedName.includes("rain") ||
    normalizedName.includes("mist") ||
    normalizedName.includes("ocean") ||
    normalizedName.includes("marine") ||
    normalizedName.includes("jardine")
  ) {
    return productProfiles.aquatic;
  }

  if (
    normalizedName.includes("citrus") ||
    normalizedName.includes("lemon") ||
    normalizedName.includes("orange") ||
    normalizedName.includes("happy") ||
    normalizedName.includes("fresh") ||
    normalizedName.includes("green") ||
    normalizedName.includes("cool")
  ) {
    return productProfiles.citrus;
  }

  if (
    normalizedName.includes("orchid") ||
    normalizedName.includes("bloom") ||
    normalizedName.includes("bouquet") ||
    normalizedName.includes("flower") ||
    normalizedName.includes("petal") ||
    normalizedName.includes("eclat") ||
    normalizedName.includes("peony") ||
    normalizedName.includes("jasmin")
  ) {
    return productProfiles.floral;
  }

  if (
    normalizedName.includes("bombshell") ||
    normalizedName.includes("spell") ||
    normalizedName.includes("pear") ||
    normalizedName.includes("berry") ||
    normalizedName.includes("nectar") ||
    normalizedName.includes("sweet") ||
    normalizedName.includes("paradise") ||
    normalizedName.includes("pink") ||
    normalizedName.includes("cherry") ||
    normalizedName.includes("taylor") ||
    normalizedName.includes("be enchanted")
  ) {
    return productProfiles.fruity;
  }

  if (
    normalizedName.includes("sauvage") ||
    normalizedName.includes("aventus") ||
    normalizedName.includes("boss") ||
    normalizedName.includes("legend") ||
    normalizedName.includes("mountain") ||
    normalizedName.includes("silver") ||
    normalizedName.includes("men") ||
    normalizedName.includes("man") ||
    normalizedName.includes("boy") ||
    normalizedName.includes("afentiko")
  ) {
    return productProfiles.woody;
  }

  if (
    normalizedName.includes("oud") ||
    normalizedName.includes("poison") ||
    normalizedName.includes("black") ||
    normalizedName.includes("crystal") ||
    normalizedName.includes("kashmir") ||
    normalizedName.includes("winter") ||
    normalizedName.includes("dark") ||
    normalizedName.includes("intense") ||
    normalizedName.includes("midnight")
  ) {
    return productProfiles.spicy;
  }

  if (
    normalizedName.includes("love") ||
    normalizedName.includes("girl") ||
    normalizedName.includes("woman") ||
    normalizedName.includes("empress") ||
    normalizedName.includes("stunning") ||
    normalizedName.includes("beautiful") ||
    normalizedName.includes("glow") ||
    normalizedName.includes("delight")
  ) {
    return productProfiles.romantic;
  }

  return productProfiles.luxury;
};

const createProduct = (item: InventoryProductRow, index: number): Product => {
  const id = index + 1;
  const profile = getProductProfile(item.name);
  const stockStatus = getProductStockStatus(item.stock);

  return {
    id,
    code: `SOV-${String(id).padStart(3, "0")}`,
    slug: slugify(item.name),
    name: item.name,
    price: String(DEFAULT_PLACEHOLDER_PRICE),
    priceValue: DEFAULT_PLACEHOLDER_PRICE,
    currency: "PHP",
    scentFamily: profile.scentFamily,
    category: profile.category,
    subtext: profile.subtext,
    description: `${profile.description} Final description and brand positioning can be refined once official product notes are available.`,
    notes: profile.notes,
    ingredients: ["Alcohol denat.", "Fragrance oil blend", "Aqua", "Colorant as applicable"],
    specifications: [
      `Unit: ${item.unit}`,
      "Product source: Excel inventory file",
      "Price, notes, category, and description are temporary placeholders",
    ],
    image: `/perfumes/p${(index % 4) + 1}.png`,
    hoverImage: `/perfumes/ps${(index % 4) + 1}.png`,
    stock: item.stock,
    unit: item.unit,
    stockStatus,
    isAvailable: item.stock > 0,
    salesCount: 0,
    isPlaceholderPrice: true,
    isPlaceholderContent: true,
    dataSource: "Excel inventory file",
  };
};

export const products: Product[] = rawInventoryProducts.map(createProduct);

export const perfumes: Perfume[] = products;

export const getAllProducts = (): Product[] => products;

export const getProductBySlug = (slug: string): Product | undefined =>
  products.find((product) => product.slug === slug);

export const getProductByCode = (code: string): Product | undefined =>
  products.find((product) => product.code.toLowerCase() === code.toLowerCase());

export const getProductsByCategory = (category: string): Product[] =>
  products.filter((product) => product.category.toLowerCase() === category.toLowerCase());

export const searchProducts = (query: string): Product[] => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return products;
  }

  return products.filter((product) => {
    const searchableText = [
      product.code,
      product.slug,
      product.name,
      product.scentFamily,
      product.category,
      product.subtext,
      product.description,
      product.notes.join(" "),
      product.ingredients.join(" "),
      product.specifications.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
};

export const getBestSellerSeedProducts = (limit = 12): Product[] =>
  [...products]
    .sort((firstProduct, secondProduct) => {
      if (secondProduct.salesCount !== firstProduct.salesCount) {
        return secondProduct.salesCount - firstProduct.salesCount;
      }

      return secondProduct.stock - firstProduct.stock;
    })
    .slice(0, limit);

export const getDiscoverySeedProducts = (limit = 12): Product[] =>
  [...products]
    .sort((firstProduct, secondProduct) => {
      if (firstProduct.salesCount !== secondProduct.salesCount) {
        return firstProduct.salesCount - secondProduct.salesCount;
      }

      return firstProduct.stock - secondProduct.stock;
    })
    .slice(0, limit);