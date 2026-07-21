import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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
        wood: dto.wood || null,
        size: dto.size || null,
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

  async resolveImageUrl(rawUrl: string): Promise<{
    originalUrl: string;
    resolvedUrl: string;
  }> {
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(rawUrl);
    } catch {
      throw new BadRequestException('Image URL is invalid');
    }

    if (parsedUrl.protocol !== 'https:') {
      throw new BadRequestException('Only HTTPS image URLs are allowed');
    }

    const hostname = parsedUrl.hostname.toLowerCase();

    /*
     * Прямые ссылки на изображения и любые
     * другие HTTPS URL сохраняем без сетевого
     * запроса.
     */
    if (hostname !== 'ibb.co') {
      return {
        originalUrl: rawUrl,
        resolvedUrl: rawUrl,
      };
    }

    let response: Response;

    try {
      response = await fetch(rawUrl, {
        redirect: 'follow',
        headers: {
          Accept: 'text/html',
          'User-Agent': 'VERSTAK-Image-Resolver/1.0',
        },
        signal: AbortSignal.timeout(8000),
      });
    } catch {
      throw new BadRequestException('Failed to open the ibb.co page');
    }

    if (!response.ok) {
      throw new BadRequestException(`ibb.co returned HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type') ?? '';

    if (!contentType.includes('text/html')) {
      throw new BadRequestException('ibb.co did not return an HTML page');
    }

    const html = await response.text();

    const imageMatch =
      html.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      ) ??
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      );

    const resolvedUrl = imageMatch?.[1]?.replaceAll('&amp;', '&').trim();

    if (!resolvedUrl) {
      throw new BadRequestException(
        'Direct image URL was not found on the ibb.co page',
      );
    }

    let resolvedParsedUrl: URL;

    try {
      resolvedParsedUrl = new URL(resolvedUrl);
    } catch {
      throw new BadRequestException('ibb.co returned an invalid image URL');
    }

    if (resolvedParsedUrl.protocol !== 'https:') {
      throw new BadRequestException('Resolved image URL is not HTTPS');
    }

    return {
      originalUrl: rawUrl,
      resolvedUrl,
    };
  }
}
