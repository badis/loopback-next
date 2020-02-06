import * as casbin from 'casbin';
import path from 'path';

export async function getCasbinEnforcerByName(
  name: string,
): Promise<casbin.Enforcer | undefined> {
  if (name === 'admin') return createAdminEnforcer();
  if (name === 'owner') return createOwnerEnforcer();
  if (name === 'team') return createTeamEnforcer();
  return undefined;
}

export async function createAdminEnforcer(): Promise<casbin.Enforcer> {
  const conf = path.resolve(__dirname, '../../fixtures/casbin/rbac_model.conf');
  const policy = path.resolve(
    __dirname,
    '../../fixtures/casbin/rbac_policy.admin.csv',
  );
  return casbin.newEnforcer(conf, policy);
}

export async function createOwnerEnforcer(): Promise<casbin.Enforcer> {
  const conf = path.resolve(__dirname, '../../fixtures/casbin/rbac_model.conf');
  const policy = path.resolve(
    __dirname,
    '../../fixtures/casbin/rbac_policy.owner.csv',
  );
  return casbin.newEnforcer(conf, policy);
}

export async function createTeamEnforcer(): Promise<casbin.Enforcer> {
  const conf = path.resolve(__dirname, '../../fixtures/casbin/rbac_model.conf');
  const policy = path.resolve(
    __dirname,
    '../../fixtures/casbin/rbac_policy.team_member.csv',
  );
  return casbin.newEnforcer(conf, policy);
}
