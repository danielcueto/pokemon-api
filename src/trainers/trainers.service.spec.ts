import { Test, TestingModule } from '@nestjs/testing';
import { TrainersService } from './trainers.service';
import { Repository } from 'typeorm';
import { Trainer } from './entities/trainer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';

type MockRepository<T extends ObjectLiteral = any> = {
  [K in keyof Repository<T>]: jest.Mock;
};
const createMockRepository = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  delete: jest.fn(),
});

describe('TrainersService', () => {
  let service: TrainersService;
  let trainerRepository: MockRepository<Trainer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainersService,
        {
          provide: getRepositoryToken(Trainer),
          useFactory: createMockRepository,
        },
      ],
    }).compile();

    service = module.get<TrainersService>(TrainersService);
    trainerRepository = module.get<MockRepository<Trainer>>(
      getRepositoryToken(Trainer),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of trainers', async () => {
      const expectedTrainers = [
        {
          id: 'uuid1',
          name: 'Ash',
          secondName: 'Ketchum',
          age: 10,
          region: 'Kanto',
          badges: 8,
        },
        {
          id: 'uuid2',
          name: 'Misty',
          secondName: 'Waterflower',
          age: 12,
          region: 'Kanto',
          badges: 1,
        },
      ];

      trainerRepository.find.mockResolvedValue(expectedTrainers as Trainer[]);

      const result = await service.getAll();

      expect(trainerRepository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedTrainers);
    });
  });

  describe('getById', () => {
    it('should return a trainer when it exists', async () => {
      const id = 'some-id';
      const expectedTrainer = {
        id,
        name: 'Ash',
        secondName: 'Ketchum',
        age: 10,
        region: 'Kanto',
        badges: 8,
      };

      trainerRepository.findOneBy.mockResolvedValue(expectedTrainer as Trainer);

      const result = await service.getById(id);

      expect(trainerRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(result).toEqual(expectedTrainer);
    });

    it('should throw NotFoundException when trainer does not exist', async () => {
      const id = 'non-existent-id';

      trainerRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getById(id)).rejects.toThrow(NotFoundException);
      expect(trainerRepository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  describe('create', () => {
    it('should create a trainer', async () => {
      const createTrainerDto: CreateTrainerDto = {
        name: 'Ash',
        secondName: 'Ketchum',
        age: 10,
        region: 'Kanto',
        badges: 8,
      };

      const expectedTrainer = {
        id: 'uuid',
        ...createTrainerDto,
      };

      trainerRepository.create.mockReturnValue(expectedTrainer as Trainer);
      trainerRepository.save.mockResolvedValue(expectedTrainer as Trainer);

      const result = await service.create(createTrainerDto);

      expect(trainerRepository.create).toHaveBeenCalledWith(createTrainerDto);
      expect(trainerRepository.save).toHaveBeenCalledWith(expectedTrainer);
      expect(result).toEqual(expectedTrainer);
    });
  });

  describe('update', () => {
    it('should update a trainer when it exists', async () => {
      const id = 'some-id';
      const updateTrainerDto: UpdateTrainerDto = { badges: 10 };
      const existingTrainer = {
        id,
        name: 'Ash',
        secondName: 'Ketchum',
        age: 10,
        region: 'Kanto',
        badges: 8,
      };
      const updatedTrainer = {
        ...existingTrainer,
        badges: 10,
      };

      jest
        .spyOn(service, 'getById')
        .mockResolvedValue(existingTrainer as Trainer);
      trainerRepository.merge.mockReturnValue(updatedTrainer as Trainer);
      trainerRepository.save.mockResolvedValue(updatedTrainer as Trainer);

      const result = await service.update(id, updateTrainerDto);

      expect(service.getById).toHaveBeenCalledWith(id);
      expect(trainerRepository.merge).toHaveBeenCalledWith(
        existingTrainer,
        updateTrainerDto,
      );
      expect(trainerRepository.save).toHaveBeenCalledWith(updatedTrainer);
      expect(result).toEqual(updatedTrainer);
    });

    it('should throw NotFoundException when trainer does not exist', async () => {
      const id = 'non-existent-id';
      const updateTrainerDto: UpdateTrainerDto = { badges: 10 };

      jest.spyOn(service, 'getById').mockRejectedValue(new NotFoundException());

      await expect(service.update(id, updateTrainerDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.getById).toHaveBeenCalledWith(id);
    });
  });

  describe('delete', () => {
    it('should delete a trainer', async () => {
      const id = 'some-id';

      trainerRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await service.delete(id);

      expect(trainerRepository.delete).toHaveBeenCalledWith(id);
    });
  });

  describe('getPokemonsByTrainerId', () => {
    it('should return pokemons when trainer exists', async () => {
      const id = 'some-id';
      const pokemons = [
        { id: 'pokemon1', name: 'Pikachu', level: 25 },
        { id: 'pokemon2', name: 'Charizard', level: 36 },
      ];
      const trainer = {
        id,
        name: 'Ash',
        pokemons,
      };

      trainerRepository.findOne.mockResolvedValue(trainer as any);

      const result = await service.getPokemonsByTrainerId(id);

      expect(trainerRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['pokemons'],
      });
      expect(result).toEqual(pokemons);
    });

    it('should throw NotFoundException when trainer does not exist', async () => {
      const id = 'non-existent-id';

      trainerRepository.findOne.mockResolvedValue(null);

      await expect(service.getPokemonsByTrainerId(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(trainerRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['pokemons'],
      });
    });
  });
});
