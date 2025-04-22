import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsController } from './pokemons.controller';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { CapturePokemonDto } from './dto/capture-pokemon.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PokemonsController', () => {
  let controller: PokemonsController;
  let service: PokemonsService;

  const mockPokemonsService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    capture: jest.fn(),
    levelUp: jest.fn(),
    release: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonsController],
      providers: [
        {
          provide: PokemonsService,
          useValue: mockPokemonsService,
        },
      ],
    }).compile();

    controller = module.get<PokemonsController>(PokemonsController);
    service = module.get<PokemonsService>(PokemonsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of pokemons', async () => {
      const expectedPokemons = [
        {
          id: '1',
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
          id: '2',
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

      mockPokemonsService.getAll.mockResolvedValue(expectedPokemons);

      const result = await controller.getAll();

      expect(service.getAll).toHaveBeenCalled();
      expect(result).toEqual(expectedPokemons);
    });
  });

  describe('getById', () => {
    it('should return a pokemon by id', async () => {
      const id = '1';
      const expectedPokemon = {
        id,
        name: 'Pikachu',
        level: 25,
        type: { id: 'type1', name: 'Electric' },
      };

      mockPokemonsService.getById.mockResolvedValue(expectedPokemon);

      const result = await controller.getById(id);

      expect(service.getById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedPokemon);
    });

    it('should handle errors when pokemon does not exist', async () => {
      const id = 'non-existent-id';
      const error = new NotFoundException(
        `El Pokemon con el id: ${id}, no existe`,
      );

      mockPokemonsService.getById.mockRejectedValue(error);

      await expect(controller.getById(id)).rejects.toThrow(NotFoundException);
      expect(service.getById).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('should create a pokemon', async () => {
      const createPokemonDto: CreatePokemonDto = {
        name: 'Pikachu',
        level: 25,
        typeId: 'type-id',
        attack: 55,
        defense: 40,
        speed: 90,
        isLegendary: false,
      };
      const expectedPokemon = {
        id: 'uuid',
        ...createPokemonDto,
      };

      mockPokemonsService.create.mockResolvedValue(expectedPokemon);

      const result = await controller.create(createPokemonDto);

      expect(service.create).toHaveBeenCalledWith(createPokemonDto);
      expect(result).toEqual(expectedPokemon);
    });

    it('should handle errors when type does not exist', async () => {
      const createPokemonDto: CreatePokemonDto = {
        name: 'Pikachu',
        level: 25,
        typeId: 'non-existent-type-id',
        attack: 55,
        defense: 40,
        speed: 90,
        isLegendary: false,
      };
      const error = new NotFoundException(
        `El tipo con el id: ${createPokemonDto.typeId}, no existe`,
      );

      mockPokemonsService.create.mockRejectedValue(error);

      await expect(controller.create(createPokemonDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.create).toHaveBeenCalledWith(createPokemonDto);
    });
  });

  describe('update', () => {
    it('should update a pokemon', async () => {
      const id = '1';
      const updatePokemonDto: UpdatePokemonDto = { level: 26 };
      const expectedPokemon = {
        id,
        name: 'Pikachu',
        level: 26,
      };

      mockPokemonsService.update.mockResolvedValue(expectedPokemon);

      const result = await controller.update(id, updatePokemonDto);

      expect(service.update).toHaveBeenCalledWith(id, updatePokemonDto);
      expect(result).toEqual(expectedPokemon);
    });

    it('should handle errors when trying to change type', async () => {
      const id = '1';
      const updatePokemonDto: UpdatePokemonDto = { typeId: 'new-type-id' };
      const error = new BadRequestException(
        'No puedes modificar el tipo de un Pokemon',
      );

      mockPokemonsService.update.mockRejectedValue(error);

      await expect(controller.update(id, updatePokemonDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.update).toHaveBeenCalledWith(id, updatePokemonDto);
    });
  });

  describe('delete', () => {
    it('should delete a pokemon', async () => {
      const id = '1';

      mockPokemonsService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });

    it('should handle errors when pokemon is captured', async () => {
      const id = '1';
      const error = new BadRequestException(
        'No se puede eliminar un Pokémon capturado. Libéralo primero.',
      );

      mockPokemonsService.delete.mockRejectedValue(error);

      await expect(controller.delete(id)).rejects.toThrow(BadRequestException);
      expect(service.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('capture', () => {
    it('should capture a pokemon', async () => {
      const id = '1';
      const capturePokemonDto: CapturePokemonDto = { trainerId: 'trainer-id' };
      const expectedPokemon = {
        id,
        name: 'Pikachu',
        level: 25,
        trainer: { id: 'trainer-id', name: 'Ash' },
      };

      mockPokemonsService.capture.mockResolvedValue(expectedPokemon);

      const result = await controller.capture(id, capturePokemonDto);

      expect(service.capture).toHaveBeenCalledWith(
        id,
        capturePokemonDto.trainerId,
      );
      expect(result).toEqual(expectedPokemon);
    });

    it('should handle errors when pokemon is already captured', async () => {
      const id = '1';
      const capturePokemonDto: CapturePokemonDto = { trainerId: 'trainer-id' };
      const error = new BadRequestException('Este Pokémon ya está capturado.');

      mockPokemonsService.capture.mockRejectedValue(error);

      await expect(controller.capture(id, capturePokemonDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.capture).toHaveBeenCalledWith(
        id,
        capturePokemonDto.trainerId,
      );
    });
  });

  describe('levelUp', () => {
    it('should level up a pokemon', async () => {
      const id = '1';
      const expectedPokemon = {
        id,
        name: 'Pikachu',
        level: 26,
        trainer: { id: 'trainer-id', name: 'Ash' },
      };

      mockPokemonsService.levelUp.mockResolvedValue(expectedPokemon);

      const result = await controller.levelUp(id);

      expect(service.levelUp).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedPokemon);
    });

    it('should handle errors when pokemon is not captured', async () => {
      const id = '1';
      const error = new BadRequestException('El Pokémon no está capturado.');

      mockPokemonsService.levelUp.mockRejectedValue(error);

      await expect(controller.levelUp(id)).rejects.toThrow(BadRequestException);
      expect(service.levelUp).toHaveBeenCalledWith(id);
    });
  });

  describe('release', () => {
    it('should release a pokemon', async () => {
      const id = '1';
      const expectedPokemon = {
        id,
        name: 'Pikachu',
        level: 25,
        trainer: null,
      };

      mockPokemonsService.release.mockResolvedValue(expectedPokemon);

      const result = await controller.release(id);

      expect(service.release).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedPokemon);
    });

    it('should handle errors when pokemon is already wild', async () => {
      const id = '1';
      const error = new BadRequestException('Este Pokémon ya está salvaje.');

      mockPokemonsService.release.mockRejectedValue(error);

      await expect(controller.release(id)).rejects.toThrow(BadRequestException);
      expect(service.release).toHaveBeenCalledWith(id);
    });
  });
});
