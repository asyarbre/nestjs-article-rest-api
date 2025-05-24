import { ArticleService } from '@/article/article.service';
import { createArticleDto } from '@/article/dto/create-article.dto';
import { FindOneParams } from '@/article/dto/find-one.params';
import { UpdateArticleDto } from '@/article/dto/update-article.dto';
import { IArticle } from '@/article/interface/article.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
  update(
    @Param() params: FindOneParams,
    @Body() updateArticleDto: UpdateArticleDto,
  ): IArticle {
    const artile = this.findOneOrFail(params.id);
    return this.articleService.updateArticle(artile, updateArticleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param() params: FindOneParams): void {
    const artile = this.findOneOrFail(params.id);
    this.articleService.deleteArticle(artile);
  }

  private findOneOrFail(id: string): IArticle {
    const artile = this.articleService.findOneByParams(id);
    if (!artile) {
      throw new NotFoundException();
    }

    return artile;
  }
}
