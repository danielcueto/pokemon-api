import { TypeOrmModule } from '@nestjs/typeorm';

import { Global, Module } from '@nestjs/common';

// client.query('select * from trainer', (err, res) => {
//   console.log(err);
//   console.log(res.rows);
// });

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT ?? '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || '123777',
        database: process.env.DB_DATABASE || 'pokemondb',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
