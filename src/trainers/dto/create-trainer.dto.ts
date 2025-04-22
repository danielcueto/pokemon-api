import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrainerDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the Trainer' })
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'First name of the Trainer' })
  readonly secondName: string;

  @IsNumber()
  @IsPositive()
  @Min(10)
  @Max(120)
  @ApiProperty({ description: 'Age of the Trainer' })
  readonly age: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Region of the Trainer' })
  readonly region: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'Number of badges the Trainer has' })
  readonly badges: number;
}
