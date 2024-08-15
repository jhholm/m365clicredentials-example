import { Client } from '@microsoft/microsoft-graph-client';
import { graphfi } from '@pnp/graph';
import { AzureIdentity } from '@pnp/azidjsclient';
import { GraphDefault } from '@pnp/nodejs';
import { getAzureCredential, getM365Credential } from './auth.mjs';

const getMicrosoftGraphClient = () => {
  const client = Client.init({
    authProvider: async (done) => {
      const credential = getAzureCredential();
      const token = await credential.getToken(
        'https://graph.microsoft.com/.default'
      );
      done(null, token.token);
    },
  });
  return client;
};

const getGraphFI = () => {
  const credential = getAzureCredential();
  const graph = graphfi().using(
    GraphDefault(),
    AzureIdentity(credential, ['https://graph.microsoft.com/.default'])
  );
  return graph;
};

export { getMicrosoftGraphClient, getGraphFI };
