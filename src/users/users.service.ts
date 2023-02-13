import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  findAll() {
    return 'This action returns all users';
  }

  findById(id: number) {
    return `This action returns a #${id} user`;
  }

  setBudget(id: number, products: Array<number>) {
    return `This action sets a #${id} user's budget to ${products}`;
  }
}
