/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

@Controller('article')
export class ArticleController {
  @Get()
  findAll(): string {
    return 'This action returns all articles';
  }

  @Get(':id')
  findOne(@Param() params: any): string {
    return `This action returns a article with id: ${params.id}`;
  }

  @Post()
  create(): string {
    return 'This action adds a new article';
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
