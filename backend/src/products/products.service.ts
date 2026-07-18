import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} was not found`);
    }

    return product;
  }

  create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        category: dto.category,
        wood: dto.wood,
        size: dto.size,
        managerLink: dto.managerLink,
        coverImage: dto.coverImage,
      },
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.product.delete({
      where: {
        id,
      },
    });

    return {
      status: 'ok',
      message: `Product with ID ${id} deleted`,
    };
  }
}
