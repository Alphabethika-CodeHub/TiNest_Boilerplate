import { Test, TestingModule } from '@nestjs/testing';
import { GeneralConfigController } from './general_config.controller';
import { GeneralConfigService } from './general_config.service';

describe('GeneralConfigController', () => {
  let controller: GeneralConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneralConfigController],
      providers: [GeneralConfigService],
    }).compile();

    controller = module.get<GeneralConfigController>(GeneralConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
