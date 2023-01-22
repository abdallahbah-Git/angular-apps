export interface Product {
  id: string;
  name: string;
  price: number;
  promotion: boolean;
}

export interface PageProducts {
  products: Product[];
  page : number;
  size : number;
  totalPages : number;
}
