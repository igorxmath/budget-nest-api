import { HttpException, Injectable } from '@nestjs/common';
import { ApiService } from '../http/api.service';

type Product = {
  id: number;
  name: string;
  price: number;
};
@Injectable()
export class ProductsService {
  constructor(private readonly apiService: ApiService) {}
  async findAll(): Promise<Product[]> {
    return await this.apiService.fetchData(`${process.env.API_URL}/products`);
  }

  async findById(id: number): Promise<Product> {
    const data = await this.findAll();
    const product = data.find((product: Product) => product.id === id);
    if (product) {
      return product;
    } else {
      throw new HttpException('Product not found', 404);
    }
  }
}
