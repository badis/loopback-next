import {
  /* inject, Application, CoreBindings, */
  lifeCycleObserver, // The decorator
  LifeCycleObserver,
  inject,
  CoreBindings,
  Application, // The interface
} from '@loopback/core';
import { ProjectRepository } from '../repositories/project.repository';
import { TeamRepository } from '../repositories/team.repository';
import { UserRepository } from '../repositories/user.repository';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('')
export class SampleObserver implements LifeCycleObserver {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
    @inject('repositories.ProjectRepository') private projectRepo: ProjectRepository,
    @inject('repositories.TeamRepository') private teamRepo: TeamRepository,
    @inject('repositories.UserRepository') private userRepo: UserRepository,
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    // Add your logic for start
    await this.createUsers();
    await this.createProjects();
    await this.createTeams();
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }

  async createUsers(): Promise<void> {
    const users = [
      {id: 1, username: 'John', email: 'john@doe.com', password: 'opensesame'},
      {id: 2, username: 'Jane', email: 'jane@doe.com', password: 'opensesame'},
      {id: 3, username: 'Bob', email: 'bob@projects.com', password: 'opensesame'}
    ];

    for (const u of users) {
      const created = await this.userRepo.create(u);
      console.log(created);
    }
  }

  async createProjects(): Promise<void> {
    const projects = [
      {id: 1, name: 'project1', balance: 0, ownerId: 1},
      {id: 2, name: 'project2', balance: 0, ownerId: 2}
    ];

    for (const p of projects) {
      const created = await this.projectRepo.create(p);
      console.log(created);
    }
  }

  async createTeams(): Promise<void> {
    const teams = [
      {id: 1, ownerId: 1, memberIds: [1, 2]},
      {id: 2, ownerId: 2, memberIds: [2]},
    ];

    for (const t of teams) {
      const created = await this.teamRepo.create(t);
      console.log(created);
    }
  }
}
