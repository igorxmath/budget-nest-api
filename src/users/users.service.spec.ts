import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ProductsService } from '../products/products.service';
import { ConfigModule } from '@nestjs/config';
import { ApiService } from '../http/api.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let productsService: ProductsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [UsersService, ProductsService, ApiService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    productsService = module.get<ProductsService>(ProductsService);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: 1, name: 'Alice', tax: 10 },
        { id: 2, name: 'Bob', tax: 15 },
      ];
      jest.spyOn(usersService, 'findAll').mockResolvedValue(users);
      const result = await usersService.findAll();
      expect(Array.from(result)).toEqual(users);
    });
  });

  describe('findById', () => {
    it('should return a user with a matching ID', async () => {
      const user = await usersService.findById(1);
      expect(user.id).toEqual(1);
    });

    it('should throw an HTTP exception when a user is not found', async () => {
      await expect(usersService.findById(999)).rejects.toThrow(HttpException);
    });
  });

  describe('setBudget', () => {
    it("should calculate the total price of the products with the user's tax applied", async () => {
      jest.spyOn(productsService, 'findAll').mockResolvedValue([
        { id: 1, name: 'Product 1', price: 10 },
        { id: 2, name: 'Product 2', price: 20 },
      ]);

      const result = await usersService.setBudget(1, [1, 2]);

      expect(result.total_price).toBeCloseTo(53.7);
    });

    it('should throw an HTTP exception when a product is not found', async () => {
      jest
        .spyOn(productsService, 'findAll')
        .mockResolvedValue([{ id: 1, name: 'Product 1', price: 10 }]);

      await expect(usersService.setBudget(1, [1, 2])).rejects.toThrow(
        HttpException,
      );
    });
  });
});
