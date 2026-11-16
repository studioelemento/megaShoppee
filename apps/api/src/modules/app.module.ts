import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health.controller';
import { AdminController, CatalogController, VendorApplicationsController } from './catalog.controller';
import { PrismaService } from './prisma.service';
import { AdminApiKeyGuard } from './admin-api-key.guard';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [HealthController, CatalogController, VendorApplicationsController, AdminController],
  providers: [PrismaService, AdminApiKeyGuard],
})
export class AppModule {}
