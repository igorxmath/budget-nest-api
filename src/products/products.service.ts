import { Injectable } from '@nestjs/common';

type Product = {
  id: number;
  name: string;
  price: number;
};
@Injectable()
export class ProductsService {
  async findAll(): Promise<Product[]> {
    return await this.fetchData();
  }

  async findById(id: number): Promise<Product> {
    const data = await this.fetchData();
    return data.find((product: Product) => product.id === id);
  }

  private async fetchData(): Promise<Product[]> {
    const response = await fetch(
      'https://mockend.com/juunegreiros/BE-test-api/products',
    );
    return await response.json();
  }
}
