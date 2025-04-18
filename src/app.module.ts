/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as Entities from './entities';
import { UsersModule } from './modules/users/users.module';
import { WorkoutModule } from './modules/workout/workout.module';
import { XlsxModule } from './modules/xlsx/xlsx.module';
import { join } from 'path';
import { MiddlewareConsumer, NestModule } from '@nestjs/common';

// Importe o middleware diretamente - não como um objeto
import { graphqlUploadExpress } from 'graphql-upload-minimal';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      sortSchema: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: Object.values(Entities),
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      synchronize: false,
      migrationsRun: true,
    }),
    UsersModule,
    WorkoutModule,
    XlsxModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        graphqlUploadExpress({
          maxFileSize: 10_000_000,
          maxFiles: 1,
        }) as any,
      )
      .forRoutes('graphql');
  }
}
