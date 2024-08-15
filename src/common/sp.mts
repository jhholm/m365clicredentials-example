import { spfi } from '@pnp/sp';
import { SPDefault } from '@pnp/nodejs';
import { AzureIdentity } from '@pnp/azidjsclient';
import { getM365Credential } from './auth.mjs';
import { SHAREPOINTSITEURL, SHAREPOINTTENANTURL } from './config.mjs';

const getSPFI = () => {
  const credential = getM365Credential();
  const sp = spfi(SHAREPOINTSITEURL).using(
    SPDefault(),
    AzureIdentity(credential, [`${SHAREPOINTTENANTURL}/.default`])
  );
  return sp;
};

export { getSPFI };