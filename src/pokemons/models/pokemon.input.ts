import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsBoolean,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreatePokemonInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(100)
  level: number;

  @Field(() => String)
  @IsUUID()
  typeId: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(100)
  attack: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(100)
  defense: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(100)
  speed: number;

  @Field(() => Boolean)
  @IsBoolean()
  isLegendary: boolean;
}

@InputType()
export class UpdatePokemonInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  level?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  attack?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  defense?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  speed?: number;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isLegendary?: boolean;
}

@InputType()
export class CapturePokemonInput {
  @Field(() => String)
  @IsUUID()
  trainerId: string;
}
