import type {
  AccessToken,
  //GetTokenOptions,
  TokenCredential,
} from '@azure/core-auth';
import { jwtDecode } from 'jwt-decode';

import * as child_process from 'child_process';

import {
  getScopeResource,
  CredentialUnavailableError,
  credentialLogger,
  formatError,
  formatSuccess,
} from './util.js';

/**
 * Mockable reference to the CLI credential cliCredentialFunctions
 * @internal
 */
const cliCredentialInternals = {
  /**
   * @internal
   */
  getSafeWorkingDir(): string {
    if (process.platform === 'win32') {
      if (!process.env.SystemRoot) {
        throw new Error(
          "M365 CLI credential expects a 'SystemRoot' environment variable"
        );
      }
      return process.env.SystemRoot;
    } else {
      return '/bin';
    }
  },

  /**
   * Gets the access token from M365 CLI
   * @param resource - The resource to use when getting the token
   * @internal
   */
  async getM365CliAccessToken(
    resource: string,
    timeout?: number
  ): Promise<{ stdout: string; stderr: string; error: Error | null }> {
    return new Promise((resolve, reject) => {
      try {
        child_process.execFile(
          'm365',
          ['util', 'accesstoken', 'get', '--resource', resource],
          {
            cwd: cliCredentialInternals.getSafeWorkingDir(),
            shell: true,
            timeout,
          },
          (error, stdout, stderr) => {
            resolve({ stdout: stdout, stderr: stderr, error });
          }
        );
      } catch (err: any) {
        reject(err);
      }
    });
  },
};

/* Left just for future reference, not actually implemented */
const logger = credentialLogger('m365CliCredential');

/**
 * This credential will use the currently logged-in user login information
 * via the M365 CLI ('m365') commandline tool.
 * To do so, it will read the user access token and expire time
 * with M365 CLI command "m365 util accesstoken get".
 */
export class M365CliCredential implements TokenCredential {
  private timeout: number;

  constructor() {
    this.timeout = 10000; //TODO: Harcoded for 10 seconds as getting token sometimes times out if not set
  }
  public async getToken(
    scopes: string | string[]
    //options: GetTokenOptions = {} //Options probably not needed
  ): Promise<AccessToken> {
    const scope = typeof scopes === 'string' ? scopes : scopes[0];
    try {
      const resource = getScopeResource(scope!);

      const obj = await cliCredentialInternals.getM365CliAccessToken(
        resource,
        this.timeout
      );

      /**
       * TODO: Implement isLoginError and isNotInstallError
       */
      const isLoginError = false;
      const isNotInstallError = false;

      if (isNotInstallError) {
        const error = new CredentialUnavailableError(
          "M365 CLI could not be found. Please visit https://pnp.github.io/cli-microsoft365 for installation instructions and then, once installed, authenticate to your m365 account using 'm365 login'."
        );
        logger.getToken.info(formatError(scopes, error));
        throw error;
      }
      if (isLoginError) {
        const error = new CredentialUnavailableError(
          "Please run 'm365 login' from a command prompt to authenticate before using this credential."
        );
        logger.getToken.info(formatError(scopes, error));
        throw error;
      }

      try {
        const responseData = obj.stdout;
        const response: AccessToken = this.parseRawResponse(responseData);
        logger.getToken.info(formatSuccess(scopes));
        return response;
      } catch (e: any) {
        if (obj.stderr) {
          throw new CredentialUnavailableError(obj.stderr);
        }
        throw e;
      }
    } catch (err: any) {
      const error =
        err.name === 'CredentialUnavailableError'
          ? err
          : new CredentialUnavailableError(
              (err as Error).message ||
                'Unknown error while trying to retrieve the access token'
            );
      logger.getToken.info(formatError(scopes, error));
      throw error;
    }
  }

  private parseRawResponse(rawResponse: string): AccessToken {
    const response: any = JSON.parse(rawResponse);
    const decodedJwt = jwtDecode(response);
    const token = response;

    const expiresOnTimestamp = decodedJwt.exp;
    if (expiresOnTimestamp && !isNaN(expiresOnTimestamp)) {
      return {
        token,
        expiresOnTimestamp,
      };
    }
    throw new CredentialUnavailableError(
      `Unexpected response from M365 CLI when getting token`
    );
  }
}
