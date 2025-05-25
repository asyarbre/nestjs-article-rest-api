import { Role } from '@/auth/enum/role.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
