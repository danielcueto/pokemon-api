import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GrpcUpdateTypeDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
  @IsString()
  @IsNotEmpty()
  name: string;
}
