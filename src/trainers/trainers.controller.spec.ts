import { Test, TestingModule } from '@nestjs/testing';
import { TrainersController } from './trainers.controller';
import { TrainersService } from './trainers.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { NotFoundException } from '@nestjs/common';

describe('TrainersController', () => {
  let controller: TrainersController;
  let service: TrainersService;

  // Mock del servicio TrainersService
  const mockTrainersService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    getPokemonsByTrainerId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainersController],
      providers: [
        {
          provide: TrainersService,
          useValue: mockTrainersService,
        },
      ],
    }).compile();

    controller = module.get<TrainersController>(TrainersController);
    service = module.get<TrainersService>(TrainersService);

    // Reset del mock para cada test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of trainers', async () => {
      const expectedTrainers = [
        {
          id: '1',
          name: 'Ash',
          secondName: 'Ketchum',
          age: 10,
          region: 'Kanto',
          badges: 8,
        },
        {
          id: '2',
          name: 'Misty',
          secondName: 'Waterflower',
          age: 12,
          region: 'Kanto',
          badges: 1,
        },
      ];

      mockTrainersService.getAll.mockResolvedValue(expectedTrainers);

      const result = await controller.getAll();

      expect(service.getAll).toHaveBeenCalled();
      expect(result).toEqual(expectedTrainers);
    });
  });

  describe('getById', () => {
    it('should return a trainer by id', async () => {
      const id = '1';
      const expectedTrainer = {
        id,
        name: 'Ash',
        secondName: 'Ketchum',
        age: 10,
        region: 'Kanto',
        badges: 8,
      };

      mockTrainersService.getById.mockResolvedValue(expectedTrainer);

      const result = await controller.getById(id);

      expect(service.getById).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedTrainer);
    });

    it('should handle errors from service', async () => {
      const id = 'non-existent-id';
      const error = new NotFoundException(
        `El trainer con el id ${id}, no existe`,
      );

      mockTrainersService.getById.mockRejectedValue(error);

      await expect(controller.getById(id)).rejects.toThrow(NotFoundException);
      expect(service.getById).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('should create a new trainer', async () => {
      const createTrainerDto: CreateTrainerDto = {
        name: 'Brock',
        secondName: 'Harrison',
        age: 15,
        region: 'Kanto',
        badges: 1,
      };
      const expectedTrainer = {
        id: 'uuid',
        ...createTrainerDto,
      };

      mockTrainersService.create.mockResolvedValue(expectedTrainer);

      const result = await controller.create(createTrainerDto);

      expect(service.create).toHaveBeenCalledWith(createTrainerDto);
      expect(result).toEqual(expectedTrainer);
    });
  });

  describe('update', () => {
    it('should update a trainer', async () => {
      const id = '1';
      const updateTrainerDto: UpdateTrainerDto = { badges: 10 };
      const expectedTrainer = {
        id,
        name: 'Ash',
        secondName: 'Ketchum',
        age: 10,
        region: 'Kanto',
        badges: 10,
      };

      mockTrainersService.update.mockResolvedValue(expectedTrainer);

      const result = await controller.update(id, updateTrainerDto);

      expect(service.update).toHaveBeenCalledWith(id, updateTrainerDto);
      expect(result).toEqual(expectedTrainer);
    });

    it('should handle errors from service when updating', async () => {
      const id = 'non-existent-id';
      const updateTrainerDto: UpdateTrainerDto = { badges: 10 };
      const error = new NotFoundException(
        `El trainer con el id ${id}, no existe`,
      );

      mockTrainersService.update.mockRejectedValue(error);

      await expect(controller.update(id, updateTrainerDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(id, updateTrainerDto);
    });
  });

  describe('delete', () => {
    it('should remove a trainer', async () => {
      const id = '1';

      mockTrainersService.delete.mockResolvedValue(undefined);

      const result = await controller.delete(id);

      expect(service.delete).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });

  describe('getPokemons', () => {
    it('should return pokemons of a trainer', async () => {
      const id = '1';
      const expectedPokemons = [
        { id: 'pokemon1', name: 'Pikachu', level: 25 },
        { id: 'pokemon2', name: 'Charizard', level: 36 },
      ];

      mockTrainersService.getPokemonsByTrainerId.mockResolvedValue(
        expectedPokemons,
      );

      const result = await controller.getPokemons(id);

      expect(service.getPokemonsByTrainerId).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedPokemons);
    });

    it('should handle errors when trainer does not exist', async () => {
      const id = 'non-existent-id';
      const error = new NotFoundException(
        `Entrenador con ID ${id} no encontrado`,
      );

      mockTrainersService.getPokemonsByTrainerId.mockRejectedValue(error);

      await expect(controller.getPokemons(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.getPokemonsByTrainerId).toHaveBeenCalledWith(id);
    });
  });
});
