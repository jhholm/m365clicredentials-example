import {
  AzureCliCredential,
  ChainedTokenCredential,
  ManagedIdentityCredential,
} from '@azure/identity';

import { M365CliCredential } from '../library/m365cliCredential.js';
/*TODO: M365CliCredential to be implemented as a separate npm package */

const getAzureCredential = () => {
  return new ChainedTokenCredential(
    new ManagedIdentityCredential(),
    new AzureCliCredential() 
  );
};

const getM365Credential = () => {
  return new ChainedTokenCredential(
    new ManagedIdentityCredential(),
    new M365CliCredential()
  );
};

export { getAzureCredential, getM365Credential };
