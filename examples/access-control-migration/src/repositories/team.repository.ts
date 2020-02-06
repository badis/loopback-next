import {DefaultCrudRepository} from '@loopback/repository';
import {Team, TeamRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TeamRepository extends DefaultCrudRepository<
  Team,
  typeof Team.prototype.id,
  TeamRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Team, dataSource);
  }
}
