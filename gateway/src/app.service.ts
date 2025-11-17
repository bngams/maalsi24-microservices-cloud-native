import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('SERVICE_A') private readonly clientA: ClientProxy,
    @Inject('SERVICE_B') private readonly clientB: ClientProxy,
  ) {}

  async getHello(): Promise<string> {
    const resultA = await this.clientA.send({ cmd: 'helloA' }, '').toPromise();
    const resultB = await this.clientB.send({ cmd: 'helloB' }, '').toPromise();
    return `${resultA} <br/> ${resultB}`;
  }
}
