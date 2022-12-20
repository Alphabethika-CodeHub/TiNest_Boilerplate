import { Module } from '@nestjs/common';
import { GeneralConfigService } from './general_config.service';
import { GeneralConfigController } from './general_config.controller';

@Module({
  controllers: [GeneralConfigController],
  providers: [GeneralConfigService]
})
export class GeneralConfigModule {}
