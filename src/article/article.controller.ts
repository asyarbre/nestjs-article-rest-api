import { ArticleService } from '@/article/article.service';
import { ArticleQueryDto } from '@/article/dto/article-query.dto';
import { createArticleDto } from '@/article/dto/create-article.dto';
import { FindOneParams } from '@/article/dto/find-one.params';
import { UpdateArticleDto } from '@/article/dto/update-article.dto';
import { Article } from '@/article/entities/article.entity';
import { Roles } from '@/auth/decolators/roles.decolator';
import { Role } from '@/auth/enum/role.enum';
import { AuthGuard } from '@/auth/guard/auth.guard';
import { RolesGuard } from '@/auth/guard/role.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseInterceptors,
  UploadedFile,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
  };
}

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
  async findAll(@Query() query: ArticleQueryDto) {
    return await this.articleService.findAllArticles(query);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('/user')
  async findAllByUser(
    @Request() req: AuthenticatedRequest,
    @Query() query: ArticleQueryDto,
  ) {
    return await this.articleService.getArticleByUser(req.user.id, query);
  }

  @Get(':id')
  async findOne(@Param() params: FindOneParams): Promise<Article> {
    return await this.findOneOrFail(params.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body() createArticleDto: createArticleDto,
  ): Promise<Article> {
    console.log(file);
    return await this.articleService.createArticle(
      req.user.id,
      createArticleDto,
      file,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @Put(':id')
  async update(
    @Request() req: AuthenticatedRequest,
    @Param() params: FindOneParams,
    @Body() updateArticleDto: UpdateArticleDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Article> {
    const article = await this.findOneOrFail(params.id);
    return await this.articleService.updateArticle(
      req.user.id,
      article,
      updateArticleDto,
      file,
    );
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(
    @Request() req: AuthenticatedRequest,
    @Param() params: FindOneParams,
  ): Promise<{ message: string }> {
    const article = await this.findOneOrFail(params.id);
    await this.articleService.deleteArticle(req.user.id, article);
    return { message: `Article with id ${params.id} deleted successfully` };
  }
}
