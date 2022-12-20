import { Injectable } from '@nestjs/common';
import { CreateGeneralConfigDto } from './dto/create-general_config.dto';
import { UpdateGeneralConfigDto } from './dto/update-general_config.dto';

@Injectable()
export class GeneralConfigService {
  create(createGeneralConfigDto: CreateGeneralConfigDto) {
    return 'This action adds a new generalConfig';
  }

  findAll() {
    return `This action returns all generalConfig`;
  }

  findOne(id: number) {
    return `This action returns a #${id} generalConfig`;
  }

  update(id: number, updateGeneralConfigDto: UpdateGeneralConfigDto) {
    return `This action updates a #${id} generalConfig`;
  }

  remove(id: number) {
    return `This action removes a #${id} generalConfig`;
  }
}
