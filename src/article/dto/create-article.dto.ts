import { ArticleStatus } from '@/article/interface/article.interface';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

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
}
