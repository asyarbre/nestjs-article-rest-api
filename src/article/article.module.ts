import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from '@/article/entities/article.entity';
import { StorageService } from '@/common/gcs/storage.service';
import { JwtModule } from '@nestjs/jwt';
import { Category } from '@/category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Category]), JwtModule],
  controllers: [ArticleController],
  providers: [ArticleService, StorageService],
})
export class ArticleModule {}
