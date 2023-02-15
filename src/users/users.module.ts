import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProductsService } from '../products/products.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ProductsService],
})
export class UsersModule {}
