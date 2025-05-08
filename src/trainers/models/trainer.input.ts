import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateTrainerInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  secondName: string;

  @Field(() => Int)
  @IsInt()
  @Min(10)
  @Max(100)
  age: number;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  region: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  @Max(8)
  badges: number;
}

@InputType()
export class UpdateTrainerInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  secondName?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(10)
  @Max(100)
  @IsOptional()
  age?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  region?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(0)
  @Max(8)
  @IsOptional()
  badges?: number;
}
