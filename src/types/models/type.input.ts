import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateTypeInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;
}

@InputType()
export class UpdateTypeInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;
}
