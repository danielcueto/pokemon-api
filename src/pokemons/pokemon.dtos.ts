import {
  IsString,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreatePokemonDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly type: string;

  @IsNumber()
  @IsPositive()
  readonly level: number;

  @IsString()
  readonly trainer: string;

  @IsNumber()
  @IsPositive()
  readonly attack: number;

  @IsNumber()
  @IsPositive()
  readonly defense: number;

  @IsNumber()
  @IsPositive()
  readonly speed: number;

  @IsBoolean()
  readonly isLegendary: boolean;
}

export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {}
