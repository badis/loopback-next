import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {User, UserRelations, Team} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {TeamRepository} from './team.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {

  public readonly teams: HasManyRepositoryFactory<Team, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('TeamRepository') protected teamRepositoryGetter: Getter<TeamRepository>,
  ) {
    super(User, dataSource);
    this.teams = this.createHasManyRepositoryFactoryFor('teams', teamRepositoryGetter,);
    this.registerInclusionResolver('teams', this.teams.inclusionResolver);
  }
}
