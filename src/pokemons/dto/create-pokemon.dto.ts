import {
  IsString,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsPositive,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePokemonDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of the Pokemon' })
  readonly name: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(100)
  @ApiProperty({ description: 'Level of the Pokemon' })
  readonly level: number;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'Type of the Pokemon' })
  readonly typeId: string;

  // @IsUUID()
  // @ApiProperty({ description: 'Trainer of the Pokemon' })
  // readonly trainerId: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'Attack power of the Pokemon' })
  readonly attack: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'Defense power of the Pokemon' })
  readonly defense: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ description: 'Speed of the Pokemon' })
  readonly speed: number;

  @IsBoolean()
  @ApiProperty({ description: 'Is the Pokemon legendary?' })
  readonly isLegendary: boolean;
}
