import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    generateInvoice(data: {
        clientId: string;
    }): Promise<{
        message: string;
        invoiceId: string;
    }>;
}
