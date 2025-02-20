export interface Product {
  id: string;
  title: string;
  totalInventory: number;
  image: ShopifyImage | null;
  variants: {
    nodes: ProductVariant[];
  };
}

export interface ShopifyImage {
  url: string;
}

export interface ProductVariant {
  inventoryQuantity: number;
  title: string;
}

export interface ProductsResponse {
  products: {
    nodes: Product[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
}
