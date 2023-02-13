import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Get()
  getAllProducts() {
    return this.productsService.findAll();
  }
  @Get(':id')
  getProductById(@Param('id') id: number) {
    return this.productsService.findById(id);
  }
}
