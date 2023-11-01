import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model, isValidObjectId } from 'mongoose';
import { PaginationDto } from 'src/common/dto/paginationDto';

@Injectable()
export class ProductService {
  constructor(
    // ? Patron Repositorio
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    createProductDto.status = true;
    try {
      const product = await this.productModel.create(createProductDto);
      return product;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 5, offset = 1 } = paginationDto;
    const pagination = (offset - 1) * limit;
    const termino = paginationDto.term;
    const regex = new RegExp(termino, 'i');

    const [total, products] = await Promise.all([
      this.productModel.countDocuments(),
      this.productModel
        .find()
        .limit(limit)
        .skip(pagination)
        .select('-__v')
        .or([{ name: regex }, { brad: regex }]),
      //.where({ name: termino.toLocaleLowerCase().trim() }),
    ]);
    const totalpages = Math.ceil((total * 1) / limit);
    const paginating = {
      before: offset - 1,
      current: offset,
      after: offset + 1,
      total,
      totalpages,
    };
    return { products, paginating };
  }

  async findOne(id: string) {
    let product: Product;

    if (!product && isValidObjectId(id)) {
      product = await this.productModel.findById(id);
    }

    if (!product) {
      throw new NotFoundException(
        `Product with id, name: ${id} it's not in the bd`,
      );
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    let product: Product;

    try {
      product = await this.productModel.findByIdAndUpdate(
        id,
        updateProductDto,
        {
          new: true,
        },
      );
      return product;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: string) {
    let product: Product;
    try {
      product = await this.productModel.findByIdAndUpdate(
        id,
        { status: false },
        {
          new: true,
        },
      );
      return product;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  private handleDBException(error: any) {
    console.log(error);
    //console.log(error.index, error.code, error.keyPattern);
    if (error.code === '11000') {
      throw new BadRequestException(
        `user created ${JSON.stringify(error.keyPattern)}`,
      );
    }
    //this.logger.error(error);
    throw new BadRequestException(
      `user created ${JSON.stringify(error.keyValue)}`,
    );
  }
}
