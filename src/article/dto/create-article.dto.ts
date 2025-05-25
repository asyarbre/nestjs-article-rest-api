import { ArticleStatus } from '@/article/interface/article.interface';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class createArticleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsEnum(ArticleStatus)
  status: ArticleStatus;

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
}
