import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CategoryFindOneParams {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
}
