import { HttpException, Injectable } from '@nestjs/common';

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
    const product = data.find((product: Product) => product.id === id);
    if (product) {
      return product;
    } else {
      throw new HttpException('Product not found', 404);
    }
  }

  private async fetchData(): Promise<Product[]> {
    try {
      const response = await fetch(`${process.env.API_URL}/products`);
      if (!response.ok) {
        throw new HttpException(response.statusText, response.status);
      }
      return await response.json();
    } catch (error) {
      throw new HttpException('fetch failed', 500);
    }
  }
}
