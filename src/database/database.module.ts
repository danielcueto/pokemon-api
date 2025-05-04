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
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        // password: 'password',
        password: '123777',
        database: 'pokemondb',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
