import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto, UpdatePokemonDto } from './pokemon.dto';

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Get()
  getAll() {
    return this.pokemonsService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: string) {
    return this.pokemonsService.getById(+id);
  }

  @Post()
  create(@Body() pokemonDto: CreatePokemonDto) {
    return this.pokemonsService.create(pokemonDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: string) {
    return this.pokemonsService.delete(+id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() pokemonDto: UpdatePokemonDto,
  ) {
    return this.pokemonsService.update(+id, pokemonDto);
  }
}
