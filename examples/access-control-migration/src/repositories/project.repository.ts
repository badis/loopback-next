import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Project, ProjectRelations, User} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {UserRepository} from './user.repository';

export class ProjectRepository extends DefaultCrudRepository<
  Project,
  typeof Project.prototype.id,
  ProjectRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Project.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Project, dataSource);
    this.user = this.createBelongsToAccessorFor('owner', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}
