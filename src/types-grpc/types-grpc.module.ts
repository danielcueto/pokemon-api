import { Module } from '@nestjs/common';
import { TypesGrpcController } from './types-grpc.controller';
import { TypesModule } from 'src/types/types.module';

@Module({
  imports: [TypesModule],
  controllers: [TypesGrpcController],
})
export class TypesGrpcModule {}
