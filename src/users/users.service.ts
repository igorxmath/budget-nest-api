import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';

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
    return this.fetchData().then((data: User[]) =>
      data.find((user: User) => user.id === id),
    );
  }

  async setBudget(id: number, productsId: Array<number>) {
    const listOfProducts = await this.productsService.findAll();
    const user = await this.findById(id);
    const products = listOfProducts.filter((product) =>
      productsId.includes(product.id),
    );
    const total = products.reduce((acc, product) => acc + product.price, 0);
    const tax = total * (1 + user.tax / 100);
    const roundedTax = Math.round(tax * 100) / 100;
    return { total, tax: roundedTax };
  }

  private async fetchData(): Promise<User[]> {
    const response = await fetch(`${process.env.API_URL}/users`);
    return await response.json();
  }
}
