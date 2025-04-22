import { Test, TestingModule } from '@nestjs/testing';
import { TypesService } from './types.service';
import { Repository } from 'typeorm';
import { Type } from './entities/type.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  merge: jest.fn(),
  delete: jest.fn(),
});

describe('TypesService', () => {
  let service: TypesService;
  let typeRepository: MockRepository<Type>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypesService,
        {
          provide: getRepositoryToken(Type),
          useFactory: createMockRepository,
        },
      ],
    }).compile();

    service = module.get<TypesService>(TypesService);
    typeRepository = module.get<MockRepository<Type>>(getRepositoryToken(Type));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a type', async () => {
      const createTypeDto: CreateTypeDto = { name: 'Electric' };
      const expectedType = { id: 'uuid', name: 'Electric' };

      typeRepository.create.mockReturnValue(expectedType as Type);
      typeRepository.save.mockResolvedValue(expectedType as Type);

      const result = await service.create(createTypeDto);

      expect(typeRepository.create).toHaveBeenCalledWith(createTypeDto);
      expect(typeRepository.save).toHaveBeenCalledWith(expectedType);
      expect(result).toEqual(expectedType);
    });
  });

  describe('findAll', () => {
    it('should return an array of types', async () => {
      const expectedTypes = [
        { id: 'uuid1', name: 'Fire' },
        { id: 'uuid2', name: 'Water' },
      ];

      typeRepository.find.mockResolvedValue(expectedTypes as Type[]);

      const result = await service.findAll();

      expect(typeRepository.find).toHaveBeenCalled();
      expect(result).toEqual(expectedTypes);
    });
  });

  describe('findOne', () => {
    it('should return a type when it exists', async () => {
      const id = 'some-id';
      const expectedType = { id, name: 'Fire' };

      typeRepository.findOneBy.mockResolvedValue(expectedType as Type);

      const result = await service.findOne(id);

      expect(typeRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(result).toEqual(expectedType);
    });

    it('should throw NotFoundException when type does not exist', async () => {
      const id = 'non-existent-id';

      typeRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
      expect(typeRepository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  describe('update', () => {
    it('should update a type when it exists', async () => {
      const id = 'some-id';
      const updateTypeDto: UpdateTypeDto = { name: 'Updated Fire' };
      const existingType = { id, name: 'Fire' };
      const updatedType = { id, name: 'Updated Fire' };

      jest.spyOn(service, 'findOne').mockResolvedValue(existingType as Type);
      typeRepository.merge.mockReturnValue(updatedType as Type);
      typeRepository.save.mockResolvedValue(updatedType as Type);

      const result = await service.update(id, updateTypeDto);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(typeRepository.merge).toHaveBeenCalledWith(
        existingType,
        updateTypeDto,
      );
      expect(typeRepository.save).toHaveBeenCalledWith(updatedType);
      expect(result).toEqual(updatedType);
    });

    it('should throw NotFoundException when type does not exist', async () => {
      const id = 'non-existent-id';
      const updateTypeDto: UpdateTypeDto = { name: 'Updated Fire' };

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.update(id, updateTypeDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('remove', () => {
    it('should delete a type', async () => {
      const id = 'some-id';

      typeRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      await service.remove(id);

      expect(typeRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
