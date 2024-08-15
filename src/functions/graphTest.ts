import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { getGraphFI, getMicrosoftGraphClient } from '../common/graph.mjs';
import '@pnp/graph/users/index.js'

export async function graphTest(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const graph = await getGraphFI();
  const msClient = await getMicrosoftGraphClient();
  const mePnPJS = await graph.me();
  const meMSClient = await msClient.api("/me").get();
  return { body: `Hello ${mePnPJS.givenName}! You can be reached via email @ ${meMSClient.mail}` };
}

app.http('graphTest', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: graphTest,
});
