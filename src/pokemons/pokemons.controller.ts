import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { CapturePokemonDto } from './dto/capture-pokemon.dto';

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Get()
  getAll() {
    return this.pokemonsService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.pokemonsService.getById(id);
  }

  @Post()
  create(@Body() pokemonDto: CreatePokemonDto) {
    return this.pokemonsService.create(pokemonDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.pokemonsService.delete(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() pokemonDto: UpdatePokemonDto) {
    return this.pokemonsService.update(id, pokemonDto);
  }

  @Post(':id/capture')
  @HttpCode(HttpStatus.OK)
  capture(@Param('id') id: string, @Body() body: CapturePokemonDto) {
    return this.pokemonsService.capture(id, body.trainerId);
  }

  @Post(':id/level-up')
  levelUp(@Param('id') id: string) {
    return this.pokemonsService.levelUp(id);
  }

  @Post(':id/release')
  release(@Param('id') id: string) {
    return this.pokemonsService.release(id);
  }
}
