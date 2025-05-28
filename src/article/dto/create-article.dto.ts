import { ArticleStatus } from '@/article/interface/article.interface';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class createArticleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;

  @IsNotEmpty()
  @ApiProperty({
    enum: ArticleStatus,
  })
  @IsEnum(ArticleStatus)
  status: ArticleStatus;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  categoryId: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'string',
    },
  })
  tags: string[];

  @IsOptional()
  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
  })
  image?: Express.Multer.File;
}
