import {
  AuthorizationContext,
  AuthorizationMetadata,
  AuthorizationDecision,
} from '@loopback/authorization';
import _ from 'lodash';

// Instance level authorizer
// This is a WORKAROUND to modify the authorization context
// It is not used for making a decision, so just returns ABSTAIN
export async function assignProjectInstanceId(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
) {
  // hard-coded for a collection of known endpoints
  // TBD(FEAT): We should support instance level context for object,
  // like project1, project2, project3
  // the current AuthrozationCtx is designed for class level object,
  // like projects
  const projectId = authorizationCtx.invocationContext.args[0];
  const resourceName = getResourceName(metadata.resource ?? authorizationCtx.resource, projectId);
  // resourceId will override the resource name from metadata
  authorizationCtx.resourceId = resourceName;
  return AuthorizationDecision.ABSTAIN;
}

// TBD: REFACTOR to a casbin util file
// Generate the resource name according to the naming convention
// in casbin policy
function getResourceName(resource: string, id?: number): string {
  // instance level name
  if (id) return `${resource}${id}`;
  // class level name
  return `${resource}*`;
}
