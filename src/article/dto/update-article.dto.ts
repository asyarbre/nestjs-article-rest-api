import { createArticleDto } from '@/article/dto/create-article.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateArticleDto extends PartialType(createArticleDto) {}
