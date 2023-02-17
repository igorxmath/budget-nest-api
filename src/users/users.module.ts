import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProductsService } from '../products/products.service';
import { ApiService } from '../http/api.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ProductsService, ApiService],
})
export class UsersModule {}
