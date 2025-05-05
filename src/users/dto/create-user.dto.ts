import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'The username of the user' })
  username: string;
  @IsNotEmpty()
  @ApiProperty({ description: 'The password of the user' })
  password: string;
}
