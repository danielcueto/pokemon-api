import { Controller, Get } from '@nestjs/common';
import { PokemonsService } from '../services/pokemons.service';

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Get()
  getAllPokemons() {}
}
