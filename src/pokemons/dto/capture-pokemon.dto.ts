import { IsUUID } from 'class-validator';

export class CapturePokemonDto {
  @IsUUID()
  trainerId: string;
}
