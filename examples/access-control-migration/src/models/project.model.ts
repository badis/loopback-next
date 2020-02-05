import {Entity, model, property, belongsTo} from '@loopback/repository';
import {User} from './user.model';

@model({settings: {strict: false}})
export class Project extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  balance: number;

  @belongsTo(() => User)
  ownerId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Project>) {
    super(data);
  }
}

export interface ProjectRelations {
  // describe navigational properties here
}

export type ProjectWithRelations = Project & ProjectRelations;
