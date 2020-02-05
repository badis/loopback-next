import { Provider, inject } from '@loopback/core';
import {
  Authorizer,
  AuthorizationContext,
  AuthorizationMetadata,
  AuthorizationRequest,
  AuthorizationDecision,
} from '@loopback/authorization';
import * as casbin from 'casbin';

// Class level authorizer
export class CasbinAuthorizationProvider implements Provider<Authorizer> {
  constructor(@inject('casbin.enforcer.factory') private enforcerFactory: (name: string) => casbin.Enforcer) { }

  /**
   * @returns authenticateFn
   */
  value(): Authorizer {
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<AuthorizationDecision> {
    const subject = this.getUserName(authorizationCtx.principals[0].id);
    const object = authorizationCtx.resourceId ?? metadata.resource ?? authorizationCtx.resource;

    const request: AuthorizationRequest = {
      subject,
      object,
      action: (metadata.scopes && metadata.scopes[0]) || 'execute',
    };

    const allowedRoles = metadata.allowedRoles;

    if (!allowedRoles) return AuthorizationDecision.ALLOW;
    if (allowedRoles.length < 1) return AuthorizationDecision.DENY;

    let allow: boolean = false;

    for (const role of allowedRoles) {
      const enforcer = await this.enforcerFactory(role);

      const allowed_by_role = await enforcer.enforce(
        request.subject,
        request.object,
        request.action,
      );
      // remove debug
      console.log(`role: ${role}, result: ${allowed_by_role}`);
      if (allowed_by_role) {
        allow = true;
        break;
      }
    }

    // remove debug
    console.log('result: ', allow);

    if (allow) return AuthorizationDecision.ALLOW;
    else if (allow === false) return AuthorizationDecision.DENY;
    return AuthorizationDecision.ABSTAIN;
  }

  // Generate the user name according to the naming convention
  // in casbin policy
  // A use's name would be `u${id}`
  getUserName(id: number): string {
    return `u${id}`;
  }
}
