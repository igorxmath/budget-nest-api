import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray } from 'class-validator';

export class SetBudgetDto {
  @IsArray({ message: 'Products must be an array' })
  @ArrayMinSize(1, { message: 'Products array must not be empty' })
  @Type(() => Number)
  products_id: number[];
}
