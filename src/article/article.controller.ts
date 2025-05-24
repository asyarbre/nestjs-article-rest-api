/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ArticleService } from '@/article/article.service';
import { createArticleDto } from '@/article/dto/create-article.dto';
import { FindOneParams } from '@/article/dto/find-one.params';
import { IArticle } from '@/article/interface/article.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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
  findOne(@Param() params: FindOneParams): IArticle {
    return this.findOneOrFail(params.id);
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

  private findOneOrFail(id: string): IArticle {
    const artile = this.articleService.findOneByParams(id);
    if (!artile) {
      throw new NotFoundException();
    }

    return artile;
  }
}
