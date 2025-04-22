import { Test, TestingModule } from '@nestjs/testing';
import { TypesController } from './types.controller';
import { TypesService } from './types.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { NotFoundException } from '@nestjs/common';

describe('TypesController', () => {
  let controller: TypesController;
  let service: TypesService;

  // Mock del servicio TypesService
  const mockTypesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypesController],
      providers: [
        {
          provide: TypesService,
          useValue: mockTypesService,
        },
      ],
    }).compile();

    controller = module.get<TypesController>(TypesController);
    service = module.get<TypesService>(TypesService);

    // Reset del mock para cada test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new type', async () => {
      const createTypeDto: CreateTypeDto = {
        name: 'Electric',
      };
      const expectedResult = {
        id: 'uuid',
        name: 'Electric',
      };

      mockTypesService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createTypeDto);

      expect(service.create).toHaveBeenCalledWith(createTypeDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return an array of types', async () => {
      const expectedResult = [
        { id: '1', name: 'Fire' },
        { id: '2', name: 'Water' },
      ];

      mockTypesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a type by id', async () => {
      const id = '1';
      const expectedResult = { id, name: 'Fire' };

      mockTypesService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors from service', async () => {
      const id = 'non-existent-id';
      const error = new NotFoundException(`El tipo con el id ${id}, no existe`);

      mockTypesService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a type', async () => {
      const id = '1';
      const updateTypeDto: UpdateTypeDto = { name: 'Updated Fire' };
      const expectedResult = { id, name: 'Updated Fire' };

      mockTypesService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, updateTypeDto);

      expect(service.update).toHaveBeenCalledWith(id, updateTypeDto);
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors from service when updating', async () => {
      const id = 'non-existent-id';
      const updateTypeDto: UpdateTypeDto = { name: 'Invalid' };
      const error = new NotFoundException(`El tipo con el id ${id}, no existe`);

      mockTypesService.update.mockRejectedValue(error);

      await expect(controller.update(id, updateTypeDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(id, updateTypeDto);
    });
  });

  describe('remove', () => {
    it('should remove a type', async () => {
      const id = '1';

      mockTypesService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });
});
