import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '@/category/entities/category.entity';
import { CategoryFindOneParams } from '@/category/dto/find-one.params';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  private async findOneOrFail(id: string): Promise<Category> {
    const category = await this.categoryService.findOne(id);
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param() params: CategoryFindOneParams,
  ): Promise<Category | null> {
    const category = await this.findOneOrFail(params.id);
    return category;
  }

  @Patch(':id')
  async update(
    @Param() params: CategoryFindOneParams,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOneOrFail(params.id);
    return this.categoryService.update(category, updateCategoryDto);
  }

  @Delete(':id')
  async remove(
    @Param() params: CategoryFindOneParams,
  ): Promise<{ message: string }> {
    const category = await this.findOneOrFail(params.id);
    await this.categoryService.remove(category);
    return { message: `Category with id ${params.id} deleted successfully` };
  }
}
