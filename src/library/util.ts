/**
 * The Error.name value of an CredentialUnavailable
 */
const CredentialUnavailableErrorName = 'CredentialUnavailableError';

/**
 * This signifies that the credential that was tried in a chained credential
 * was not available to be used as the credential. Rather than treating this as
 * an error that should halt the chain, it's caught and the chain continues
 */
export class CredentialUnavailableError extends Error {
  constructor(message?: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = CredentialUnavailableErrorName;
  }
}

/**
 * Returns the resource out of a scope.
 * @internal
 */
export const getScopeResource = (scope: string): string => {
  return scope.replace(/\/.default$/, '');
};

/**
 * Formatting the success event on the credentials
 */
export function formatSuccess(scope: string | string[]): string {
  return `SUCCESS. Scopes: ${Array.isArray(scope) ? scope.join(", ") : scope}.`;
}

/**
 * Formatting the success event on the credentials
 */
export function formatError(scope: string | string[] | undefined, error: Error | string): string {
  let message = "ERROR.";
  if (scope?.length) {
    message += ` Scopes: ${Array.isArray(scope) ? scope.join(", ") : scope}.`;
  }
  return `${message} Error message: ${typeof error === "string" ? error : error.message}.`;
}

/**
 * A CredentialLogger is a logger declared at the credential's constructor, and used at any point in the credential.
 * It has all the properties of a CredentialLoggerInstance, plus other logger instances, one per method.
 */
export function credentialLogger(title: string, log: unknown = {}) {
  //TODO: Here be dragons, implement this later on
  return {
    getToken: {
      info: (msg: string) => console.log(msg)
    },
  }
}