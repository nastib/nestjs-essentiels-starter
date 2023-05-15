import { Module } from '@nestjs/common';
import { appModuleOptions } from './common/app/appModuleOptions';

@Module(appModuleOptions)
export class AppModule {}
