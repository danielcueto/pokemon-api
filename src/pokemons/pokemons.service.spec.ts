import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsService } from './pokemons.service';
import { Repository } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Type } from '../types/entities/type.entity';
import { Trainer } from '../trainers/entities/trainer.entity';
import { TypesService } from '../types/types.service';
import { TrainersService } from '../trainers/trainers.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  merge: jest.fn(),
  delete: jest.fn(),
});

describe('PokemonsService', () => {
  let service: PokemonsService;
  let pokemonRepository: MockRepository<Pokemon>;
  let typesService: TypesService;
  let trainersService: TrainersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonsService,
        {
          provide: getRepositoryToken(Pokemon),
          useFactory: createMockRepository,
        },
        {
          provide: TypesService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: TrainersService,
          useValue: {
            getById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PokemonsService>(PokemonsService);
    pokemonRepository = module.get<MockRepository<Pokemon>>(
      getRepositoryToken(Pokemon),
    );
    typesService = module.get<TypesService>(TypesService);
    trainersService = module.get<TrainersService>(TrainersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of pokemons', async () => {
      const expectedPokemons = [
        {
          id: 'uuid1',
          name: 'Pikachu',
          level: 25,
          type: { id: 'type1', name: 'Electric' },
          trainer: { id: 'trainer1', name: 'Ash' },
          attack: 55,
          defense: 40,
          speed: 90,
          isLegendary: false,
          typeId: 'type1',
        },
        {
          id: 'uuid2',
          name: 'Charizard',
          level: 36,
          type: { id: 'type2', name: 'Fire' },
          trainer: { id: 'trainer1', name: 'Ash' },
          attack: 84,
          defense: 78,
          speed: 100,
          isLegendary: false,
          typeId: 'type2',
        },
      ];

      pokemonRepository.find.mockResolvedValue(expectedPokemons as Pokemon[]);

      const result = await service.getAll();

      expect(pokemonRepository.find).toHaveBeenCalledWith({
        relations: ['trainer'],
      });
      expect(result).toEqual(expectedPokemons);
    });
  });

  describe('getById', () => {
    it('should return a pokemon when it exists', async () => {
      const id = 'uuid1';
      const expectedPokemon = {
        id,
        name: 'Pikachu',
        level: 25,
        type: { id: 'type1', name: 'Electric' },
        trainer: { id: 'trainer1', name: 'Ash' },
        attack: 55,
        defense: 40,
        speed: 90,
        isLegendary: false,
        typeId: 'type1',
      };

      pokemonRepository.findOne.mockResolvedValue(expectedPokemon as Pokemon);

      const result = await service.getById(id);

      expect(pokemonRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['trainer'],
      });
      expect(result).toEqual(expectedPokemon);
    });

    it('should throw NotFoundException when pokemon does not exist', async () => {
      const id = 'non-existent-id';

      pokemonRepository.findOne.mockResolvedValue(null);

      await expect(service.getById(id)).rejects.toThrow(NotFoundException);
      expect(pokemonRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['trainer'],
      });
    });
  });

  describe('create', () => {
    it('should create a pokemon', async () => {
      const typeId = 'type-id';
      const type = {
        id: typeId,
        name: 'Electric',
      };
      const createPokemonDto: CreatePokemonDto = {
        name: 'Pikachu',
        level: 25,
        typeId,
        attack: 55,
        defense: 40,
        speed: 90,
        isLegendary: false,
      };
      const expectedPokemon = {
        id: 'uuid',
        ...createPokemonDto,
        type,
        trainer: null,
      };

      jest.spyOn(typesService, 'findOne').mockResolvedValue(type as Type);
      pokemonRepository.create.mockReturnValue(expectedPokemon as Pokemon);
      pokemonRepository.save.mockResolvedValue(expectedPokemon as Pokemon);

      const result = await service.create(createPokemonDto);

      expect(typesService.findOne).toHaveBeenCalledWith(typeId);
      expect(pokemonRepository.create).toHaveBeenCalledWith({
        ...createPokemonDto,
        type,
      });
      expect(pokemonRepository.save).toHaveBeenCalledWith(expectedPokemon);
      expect(result).toEqual(expectedPokemon);
    });

    it('should throw NotFoundException when type does not exist', async () => {
      const typeId = 'non-existent-type-id';
      const createPokemonDto: CreatePokemonDto = {
        name: 'Pikachu',
        level: 25,
        typeId,
        attack: 55,
        defense: 40,
        speed: 90,
        isLegendary: false,
      };

      jest.spyOn(typesService, 'findOne').mockResolvedValue(null);

      await expect(service.create(createPokemonDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(typesService.findOne).toHaveBeenCalledWith(typeId);
    });
  });

  describe('delete', () => {
    it('should delete a pokemon when it is wild', async () => {
      const id = 'uuid';
      const pokemon = {
        id,
        name: 'Pikachu',
        level: 25,
        trainer: null,
      };

      jest.spyOn(service, 'getById').mockResolvedValue(pokemon as Pokemon);
      pokemonRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await service.delete(id);

      expect(service.getById).toHaveBeenCalledWith(id);
      expect(pokemonRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw BadRequestException when pokemon is captured', async () => {
      const id = 'uuid';
      const pokemon = {
        id,
        name: 'Pikachu',
        level: 25,
        trainer: { id: 'trainer-id', name: 'Ash' },
      };

      jest.spyOn(service, 'getById').mockResolvedValue(pokemon as Pokemon);

      await expect(service.delete(id)).rejects.toThrow(BadRequestException);
      expect(service.getById).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when pokemon does not exist', async () => {
      const id = 'non-existent-id';

      jest.spyOn(service, 'getById').mockRejectedValue(new NotFoundException());

      await expect(service.delete(id)).rejects.toThrow(NotFoundException);
      expect(service.getById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a pokemon', async () => {
      const id = 'uuid';
      const updatePokemonDto: UpdatePokemonDto = { level: 26 };
      const existingPokemon = {
        id,
        name: 'Pikachu',
        level: 25,
        trainer: null,
        attack: 55,
        defense: 40,
        speed: 90,
        isLegendary: false,
        typeId: 'type-id',
      };
      const updatedPokemon = {
        ...existingPokemon,
        level: 26,
      };

      jest
        .spyOn(service, 'getById')
        .mockResolvedValue(existingPokemon as Pokemon);
      pokemonRepository.merge.mockReturnValue(updatedPokemon as Pokemon);
      pokemonRepository.save.mockResolvedValue(updatedPokemon as Pokemon);

      const result = await service.update(id, updatePokemonDto);

      expect(service.getById).toHaveBeenCalledWith(id);
      expect(pokemonRepository.merge).toHaveBeenCalledWith(
        existingPokemon,
        updatePokemonDto,
      );
      expect(pokemonRepository.save).toHaveBeenCalledWith(updatedPokemon);
      expect(result).toEqual(updatedPokemon);
    });

    it('should throw BadRequestException when trying to change the type', async () => {
      const id = 'uuid';
      const updatePokemonDto: UpdatePokemonDto = { typeId: 'new-type-id' };

      await expect(service.update(id, updatePokemonDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException when pokemon does not exist', async () => {
      const id = 'non-existent-id';
      const updatePokemonDto: UpdatePokemonDto = { level: 26 };

      jest.spyOn(service, 'getById').mockRejectedValue(new NotFoundException());

      await expect(service.update(id, updatePokemonDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('capture', () => {
    it('should capture a pokemon', async () => {
      const pokemonId = 'pokemon-id';
      const trainerId = 'trainer-id';
      const pokemon = {
        id: pokemonId,
        name: 'Pikachu',
        level: 25,
        trainer: null,
      };
      const trainer = {
        id: trainerId,
        name: 'Ash',
      };
      const capturedPokemon = {
        ...pokemon,
        trainer,
      };

      jest.spyOn(service, 'getById').mockResolvedValue(pokemon as Pokemon);
      jest
        .spyOn(trainersService, 'getById')
        .mockResolvedValue(trainer as Trainer);
      pokemonRepository.save.mockResolvedValue(capturedPokemon as Pokemon);

      const result = await service.capture(pokemonId, trainerId);

      expect(service.getById).toHaveBeenCalledWith(pokemonId);
      expect(trainersService.getById).toHaveBeenCalledWith(trainerId);
      expect(pokemonRepository.save).toHaveBeenCalledWith({
        ...pokemon,
        trainer,
      });
      expect(result).toEqual(capturedPokemon);
    });

    it('should throw BadRequestException when pokemon is already captured', async () => {
      const pokemonId = 'pokemon-id';
      const trainerId = 'trainer-id';
      const pokemon = {
        id: pokemonId,
        name: 'Pikachu',
        level: 25,
        trainer: { id: 'other-trainer-id', name: 'Misty' },
      };

      jest.spyOn(service, 'getById').mockResolvedValue(pokemon as Pokemon);

      await expect(service.capture(pokemonId, trainerId)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.getById).toHaveBeenCalledWith(pokemonId);
    });

    it('should throw NotFoundException when trainer does not exist', async () => {
      const pokemonId = 'pokemon-id';
      const trainerId = 'non-existent-trainer-id';
      const pokemon = {
        id: pokemonId,
        name: 'Pikachu',
        level: 25,
        trainer: null,
      };

      jest.spyOn(service, 'getById').mockResolvedValue(pokemon as Pokemon);
      jest
        .spyOn(trainersService, 'getById')
        .mockRejectedValue(new NotFoundException());

      await expect(service.capture(pokemonId, trainerId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.getById).toHaveBeenCalledWith(pokemonId);
      expect(trainersService.getById).toHaveBeenCalledWith(trainerId);
    });
  });

  describe('levelUp', () => {
    it('should level up a captured pokemon', async () => {
      const id = 'uuid';
      const pokemon = {
        id,
        name: 'Pikachu',
        level: 25,
        trainer: { id: 'trainer-id', name: 'Ash' },
      };
      const leveledUpPokemon = {
        ...pokemon,
        level: 26,
      };

      jest.spyOn(service, 'getById').mockResolvedValue(pokemon as Pokemon);
      pokemonRepository.save.mockResolvedValue(leveledUpPokemon as Pokemon);

      const result = await service.levelUp(id);

      expect(service.getById).toHaveBeenCalledWith(id);
      expect(pokemonRepository.save).toHaveBeenCalledWith({
        ...pokemon,
        level: 26,
      });
      expect(result).toEqual(leveledUpPokemon);
    });

    it('should throw BadRequestException when pokemon is not captured', async () => {
      const id = 'uuid';
      const pokemon = {
        id,
        name: 'Pikachu',
        level: 25,
        trainer: null,
      };

      jest.spyOn(service, 'getById').mockResolvedValue(pokemon as Pokemon);

      await expect(service.levelUp(id)).rejects.toThrow(BadRequestException);
      expect(service.getById).toHaveBeenCalledWith(id);
    });

    it('should throw BadRequestException when pokemon is already at max level', async () => {
      const id = 'uuid';
      const pokemon = {
        id,
        name: 'Pikachu',
        level: 100,
        trainer: { id: 'trainer-id', name: 'Ash' },
      };

      jest.spyOn(service, 'getById').mockResolvedValue(pokemon as Pokemon);

      await expect(service.levelUp(id)).rejects.toThrow(BadRequestException);
      expect(service.getById).toHaveBeenCalledWith(id);
    });
  });

  describe('release', () => {
    it('should release a captured pokemon', async () => {
      const id = 'uuid';
      const pokemon = {
        id,
        name: 'Pikachu',
        level: 25,
        trainer: { id: 'trainer-id', name: 'Ash' },
      };
      const releasedPokemon = {
        ...pokemon,
        trainer: null,
      };

      jest.spyOn(service, 'getById').mockResolvedValue(pokemon as Pokemon);
      pokemonRepository.save.mockResolvedValue(releasedPokemon as Pokemon);

      const result = await service.release(id);

      expect(service.getById).toHaveBeenCalledWith(id);
      expect(pokemonRepository.save).toHaveBeenCalledWith({
        ...pokemon,
        trainer: null,
      });
      expect(result).toEqual(releasedPokemon);
    });

    it('should throw BadRequestException when pokemon is already wild', async () => {
      const id = 'uuid';
      const pokemon = {
        id,
        name: 'Pikachu',
        level: 25,
        trainer: null,
      };

      jest.spyOn(service, 'getById').mockResolvedValue(pokemon as Pokemon);

      await expect(service.release(id)).rejects.toThrow(BadRequestException);
      expect(service.getById).toHaveBeenCalledWith(id);
    });
  });
});
