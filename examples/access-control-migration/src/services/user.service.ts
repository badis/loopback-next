// Copyright IBM Corp. 2019. All Rights Reserved.
// Node module: @loopback/authentication
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {HttpErrors} from '@loopback/rest';
import {UserRepository} from '../repositories/user.repository';
import {User} from '../models/user.model';
import {UserService} from '@loopback/authentication';
import {UserProfile, securityId} from '@loopback/security';
import {repository} from '@loopback/repository';

export type Credentials = {
  email: string;
  password: string;
};

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const invalidCredentialsError = 'Invalid email or password.';

    const foundUser = await this.userRepository.findOne({
      where: {email: credentials.email},
    });
    if (!foundUser) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    // TBD: Hash password
    // TBD: extract Credentials into another model
    const passwordMatched = foundUser.password === credentials.password;

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized(invalidCredentialsError);
    }

    return foundUser;
  }

  convertToUserProfile(user: User): UserProfile {
    return {[securityId]: user.id.toString(), name: user.username, id: user.id, email: user.email};
  }
}