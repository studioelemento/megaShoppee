import {
  Body, ConflictException, Controller, Get, Param, Post, Query, UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { CreateVendorApplicationDto } from './create-vendor-application.dto';
import { AdminApiKeyGuard } from './admin-api-key.guard';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly db: PrismaService) {}

  @Get('categories') categories() {
    return this.db.category.findMany({
      where: { isActive: true }, orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, slug: true, parentId: true },
    });
  }

  @Get('products')
  products(@Query('q') q?: string, @Query('category') category?: string, @Query('take') take = '24') {
    const limit = Math.min(Math.max(Number(take) || 24, 1), 100);
    return this.db.product.findMany({
      where: {
        status: 'ACTIVE',
        ...(category ? { category: { slug: category } } : {}),
        ...(q ? { title: { contains: q } } : {}),
      },
      select: {
        id: true, title: true, slug: true, description: true, regularPrice: true,
        salePrice: true, stock: true, images: true, createdAt: true,
        vendor: { select: { name: true, storeSlug: true } },
        category: { select: { name: true, slug: true } },
      },
      take: limit, orderBy: { createdAt: 'desc' },
    });
  }

  @Get('products/:slug')
  product(@Param('slug') slug: string) {
    return this.db.product.findFirst({
      where: { slug, status: 'ACTIVE' },
      select: {
        id: true, title: true, slug: true, description: true, regularPrice: true,
        salePrice: true, stock: true, images: true, attributes: true, createdAt: true,
        vendor: { select: { name: true, storeSlug: true } },
        category: { select: { name: true, slug: true } },
        variations: { select: { id: true, sku: true, attributes: true, price: true, stock: true, imageUrl: true } },
        reviews: { where: { isVisible: true }, select: { id: true, rating: true, content: true, createdAt: true } },
      },
    });
  }
}

@Controller('vendor-applications')
export class VendorApplicationsController {
  constructor(private readonly db: PrismaService) {}

  @Post()
  async create(@Body() body: CreateVendorApplicationDto) {
    const slug = body.storeSlug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
    if (slug.length < 3) throw new ConflictException('Please provide a store name that produces a valid URL slug.');
    try {
      return await this.db.vendor.create({
        data: {
          name: body.name.trim(), storeSlug: slug, type: body.type,
          mobile: body.mobile, email: body.email,
          gstRegistered: body.gstRegistered ?? false,
          gstin: body.gstRegistered ? body.gstin : null,
          status: 'PENDING',
        },
        select: { id: true, name: true, storeSlug: true, status: true, createdAt: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('That store URL is already registered. Please choose another.');
      }
      throw error;
    }
  }
}

@Controller('admin')
@UseGuards(AdminApiKeyGuard)
export class AdminController {
  constructor(private readonly db: PrismaService) {}

  @Get('overview')
  async overview() {
    const [vendors, pendingVendors, products, pendingProducts, orders, tickets, customers] = await Promise.all([
      this.db.vendor.count(),
      this.db.vendor.count({ where: { status: 'PENDING' } }),
      this.db.product.count(),
      this.db.product.count({ where: { status: 'PENDING_APPROVAL' } }),
      this.db.order.count(),
      this.db.supportTicket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS', 'WAITING_ON_VENDOR', 'WAITING_ON_CUSTOMER'] } } }),
      this.db.customer.count(),
    ]);
    return { vendors, pendingVendors, products, pendingProducts, orders, openTickets: tickets, customers };
  }

  @Get('vendors')
  vendors(@Query('status') status?: string) {
    const allowed = ['PENDING', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED', 'SUSPENDED', 'TERMINATED'];
    return this.db.vendor.findMany({
      where: status && allowed.includes(status) ? { status: status as any } : {},
      select: { id: true, name: true, storeSlug: true, type: true, status: true, email: true, mobile: true, createdAt: true },
      orderBy: { createdAt: 'desc' }, take: 100,
    });
  }
}
