import { Test, TestingModule } from '@nestjs/testing';
import { TypesGrpcController } from './types-grpc.controller';

describe('TypesGrpcController', () => {
  let controller: TypesGrpcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypesGrpcController],
    }).compile();

    controller = module.get<TypesGrpcController>(TypesGrpcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
