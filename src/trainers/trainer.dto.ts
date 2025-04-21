import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTrainerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the Trainer' })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'First name of the Trainer' })
  readonly second_name: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'Age of the Trainer' })
  readonly age: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email of the Trainer' })
  readonly region: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'Number of badges the Trainer has' })
  readonly badges: number;
}

export class UpdateTrainerDto extends PartialType(CreateTrainerDto) {}
