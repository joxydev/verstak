import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findPublished() {
    return this.prisma.product.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findPublishedById(id: number) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        isPublished: true,
      },
    });

    if (!product) {
      throw new NotFoundException(
        `Published product with ID ${id} was not found`,
      );
    }

    return product;
  }

  findAllForAdmin() {
    return this.prisma.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByIdForAdmin(id: number) {
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
        isPublished: dto.isPublished ?? false,
      },
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findByIdForAdmin(id);

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        title: dto.title,
        description: dto.description,
        price: dto.price,
        category: dto.category,
        wood: dto.wood,
        size: dto.size,
        managerLink: dto.managerLink,
        coverImage: dto.coverImage,
        isPublished: dto.isPublished,
      },
    });
  }

  async setPublication(id: number, isPublished: boolean) {
    await this.findByIdForAdmin(id);

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        isPublished,
      },
    });
  }

  async remove(id: number) {
    await this.findByIdForAdmin(id);

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
