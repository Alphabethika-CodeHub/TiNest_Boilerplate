import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GeneralConfigService } from './general_config.service';
import { CreateGeneralConfigDto } from './dto/create-general_config.dto';
import { UpdateGeneralConfigDto } from './dto/update-general_config.dto';

@Controller('general-config')
export class GeneralConfigController {
  constructor(private readonly generalConfigService: GeneralConfigService) {}

  @Post()
  create(@Body() createGeneralConfigDto: CreateGeneralConfigDto) {
    return this.generalConfigService.create(createGeneralConfigDto);
  }

  @Get()
  findAll() {
    return this.generalConfigService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.generalConfigService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGeneralConfigDto: UpdateGeneralConfigDto) {
    return this.generalConfigService.update(+id, updateGeneralConfigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.generalConfigService.remove(+id);
  }
}
