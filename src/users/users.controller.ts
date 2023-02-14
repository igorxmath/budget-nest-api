import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Post(':id/budget')
  getUserBudget(
    @Param('id') id: number,
    @Body() { products_id }: { products_id: Array<number> },
  ) {
    return this.usersService.setBudget(id, products_id);
  }
}
