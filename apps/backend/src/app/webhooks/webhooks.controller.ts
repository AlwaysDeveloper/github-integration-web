import { Body, Controller, Post, Req } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhookController {
  constructor(private readonly service: WebhooksService) {}

  @Post('/github')
  async webhookImcoming(
    @Req() req: Request,
    @Body() body: Record<string, unknown>,
  ) {
    await this.service.handleWebhookRequest(body);
    return {
      success: true,
    };
  }
}
