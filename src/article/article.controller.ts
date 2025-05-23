/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ArticleService } from '@/article/article.service';
import { createArticleDto } from '@/article/dto/create-article.dto';
import { IArticle } from '@/article/interface/article.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
  @Get()
  findAll(): IArticle[] {
    return this.articleService.findAllArticles();
  }

  @Get(':id')
  findOne(@Param() params: any): string {
    return `This action returns a article with id: ${params.id}`;
  }

  @Post()
  create(@Body() createArticleDto: createArticleDto): IArticle {
    return this.articleService.createArticle(createArticleDto);
  }

  @Put(':id')
  update(@Param() params: any): string {
    return `This action updates a article with id: ${params.id}`;
  }

  @Delete(':id')
  remove(@Param() params: any): string {
    return `This action removes a article with id: ${params.id}`;
  }
}
