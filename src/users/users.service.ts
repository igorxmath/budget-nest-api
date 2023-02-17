import { HttpException, Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { ApiService } from '../http/api.service';

type User = {
  id: number;
  name: string;
  tax: number;
};
@Injectable()
export class UsersService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly apiService: ApiService,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.apiService.fetchData(`${process.env.API_URL}/users`);
  }

  async findById(id: number): Promise<User> {
    const data = await this.findAll();
    const user = data.find((user: User) => user.id === id);
    if (user) {
      return user;
    } else {
      throw new HttpException('User not found', 404);
    }
  }

  async setBudget(
    id: number,
    productsId: Array<number>,
  ): Promise<{ total_price: number }> {
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

    return { total_price: roundedTotalPrice };
  }
}
