import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { getSPFI } from '../common/sp.mjs';
import '@pnp/sp/webs/index.js';

export async function spTest(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const sp = getSPFI();
  const webData = await sp.web.select('Title', 'Url')();
  return { body: `The title of the web in URL ${webData.Url} is ${webData.Title}` };
}

app.http('spTest', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: spTest,
});
