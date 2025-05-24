import { ArticleService } from '@/article/article.service';
import { createArticleDto } from '@/article/dto/create-article.dto';
import { FindOneParams } from '@/article/dto/find-one.params';
import { UpdateArticleDto } from '@/article/dto/update-article.dto';
import { Article } from '@/article/entities/article.entity';
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

  private async findOneOrFail(id: string): Promise<Article> {
    const article = await this.articleService.findOneByParams(id);
    if (!article) {
      throw new NotFoundException(`Article with id ${id} not found`);
    }
    return article;
  }

  @Get()
  async findAll(): Promise<Article[]> {
    return await this.articleService.findAllArticles();
  }

  @Get(':id')
  async findOne(@Param() params: FindOneParams): Promise<Article> {
    return await this.findOneOrFail(params.id);
  }

  @Post()
  async create(@Body() createArticleDto: createArticleDto): Promise<Article> {
    return await this.articleService.createArticle(createArticleDto);
  }

  @Put(':id')
  async update(
    @Param() params: FindOneParams,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this.findOneOrFail(params.id);
    return await this.articleService.updateArticle(article, updateArticleDto);
  }

  @Delete(':id')
  async remove(@Param() params: FindOneParams): Promise<{ message: string }> {
    const article = await this.findOneOrFail(params.id);
    await this.articleService.deleteArticle(article);
    return { message: `Article with id ${params.id} deleted successfully` };
  }
}
