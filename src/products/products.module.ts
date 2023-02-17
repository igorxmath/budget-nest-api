import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ApiService } from '../http/api.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ApiService],
  exports: [ProductsService],
})
export class ProductsModule {}
