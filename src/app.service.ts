import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  getHello(): string {
    return `Server Running 🚀 at http://localhost:${this.config.get<number>(
      'PORT',
    )}`;
  }
}
