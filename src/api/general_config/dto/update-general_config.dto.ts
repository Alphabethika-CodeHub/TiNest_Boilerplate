import { PartialType } from '@nestjs/mapped-types';
import { CreateGeneralConfigDto } from './create-general_config.dto';

export class UpdateGeneralConfigDto extends PartialType(CreateGeneralConfigDto) {}
