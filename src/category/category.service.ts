import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '@/category/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly CategoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = await this.CategoryRepository.save(createCategoryDto);
    return newCategory;
  }

  async findAll(): Promise<Category[]> {
    return await this.CategoryRepository.find();
  }

  async findOne(id: string): Promise<Category | null> {
    return await this.CategoryRepository.findOne({
      where: { id },
    });
  }

  async update(
    category: Category,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const updatedCategory = Object.assign(category, updateCategoryDto);
    return await this.CategoryRepository.save(updatedCategory);
  }

  async remove(category: Category): Promise<string> {
    await this.CategoryRepository.delete(category.id);
    return category.id;
  }
}
