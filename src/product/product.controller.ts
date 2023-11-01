import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductMSG } from 'src/common/constants';
import { PaginationDto } from 'src/common/dto/paginationDto';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(ProductMSG.CREATE)
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @MessagePattern(ProductMSG.FIND_ALL)
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productService.findAll(paginationDto);
  }

  @MessagePattern(ProductMSG.FIND_ONE)
  findOne(@Payload() id: string) {
    return this.productService.findOne(id);
  }

  @MessagePattern(ProductMSG.UPDATE)
  update(@Payload() payload: any) {
    return this.productService.update(payload.id, payload.updateProductDto);
  }

  @MessagePattern(ProductMSG.DELETE)
  remove(@Payload() id: string) {
    return this.productService.remove(id);
  }
}
