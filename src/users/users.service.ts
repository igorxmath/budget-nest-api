import { HttpException, Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

type User = {
  id: number;
  name: string;
  tax: number;
};
@Injectable()
export class UsersService {
  constructor(private readonly productsService: ProductsService) {}

  async findAll(): Promise<User[]> {
    return await this.fetchData();
  }

  async findById(id: number): Promise<User> {
    const data = await this.fetchData();
    const user = data.find((user: User) => user.id === id);
    if (user) {
      return user;
    } else {
      throw new HttpException('User not found', 404);
    }
  }

  async setBudget(id: number, productsId: Array<number>) {
    if (productsId.length === 0) {
      throw new HttpException('No products provided', 400);
    }

    const listOfProducts = await this.productsService.findAll();
    const user = await this.findById(id);

    const productsMap = new Map(
      listOfProducts.map((product) => [product.id, product]),
    );

    const products = productsId.map((id) => {
      const product = productsMap.get(id);
      if (!product) {
        throw new HttpException('Product not found', 404);
      }
      return product;
    });

    const totalPrice = products.reduce(
      (total, product) => total + product.price * (1 + user.tax / 100),
      0,
    );
    const roundedTotalPrice = Math.round(totalPrice * 100) / 100;

    return { totalPrice: roundedTotalPrice };
  }

  private async fetchData(): Promise<User[]> {
    try {
      const response = await fetch(`${process.env.API_URL}/users`);
      if (!response.ok) {
        throw new HttpException(response.statusText, response.status);
      }
      return await response.json();
    } catch (error) {
      throw new HttpException(error, 500);
    }
  }
}
