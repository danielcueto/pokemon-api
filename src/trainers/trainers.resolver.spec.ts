import { Test, TestingModule } from '@nestjs/testing';
import { TrainersResolver } from './trainers.resolver';

describe('TrainersResolver', () => {
  let resolver: TrainersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainersResolver],
    }).compile();

    resolver = module.get<TrainersResolver>(TrainersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
