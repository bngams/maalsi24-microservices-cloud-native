import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices/decorators/message-pattern.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get() <= c'était pas en HTTP
  // On utilise microservice NEST avec communication TCP
  // =>MessagePattern pour écouter les messages entrants
  @MessagePattern({ cmd: 'helloA' })
  getHello(): string {
    return this.appService.getHello();
  }
}
