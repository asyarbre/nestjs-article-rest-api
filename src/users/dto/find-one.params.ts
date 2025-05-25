import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserFindOneParams {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
}
