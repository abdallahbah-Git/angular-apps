import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable, of, throwError } from 'rxjs';
import { AppUser } from '../model/login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  users: AppUser[] = [];
  authenticatedUser!: AppUser;
  constructor() {
    this.users.push({
      userId: UUID.UUID(),
      username: 'user1',
      password: 'passwod',
      roles: ['USER'],
    });
    this.users.push({
      userId: UUID.UUID(),
      username: 'user2',
      password: '1234',
      roles: ['USER'],
    });
    this.users.push({
      userId: UUID.UUID(),
      username: 'admin',
      password: 'abd9',
      roles: ['USER', 'ADMIN'],
    });
  }

  // Vérification des informations fournies par l'utilisateur
  public login(username: string, password: string): Observable<AppUser> {
    let appUser = this.users.find((u) => u.username === username);
    if (!appUser) return throwError(new Error('User not found'));
    if (appUser.password !== password)
      return throwError(new Error('Wrong password'));
    return of(appUser);
  }

  // Authentifie l'utilisateur
  public authenticateUser(appUser: AppUser): Observable<boolean> {
    this.authenticatedUser = appUser;
    // Stock en local les informations de l'utilisateur
    localStorage.setItem(
      'authUser',
      JSON.stringify({
        username: appUser.username,
        roles: appUser.roles,
        jwt: 'JWT_TOKEN',
      })
    );
    return of(true);
  }

  // Verifie les roles
  public hasRole(role: string): boolean {
    return this.authenticatedUser!.roles.includes(role);
  }

  // Confirme l'authentification
  public isAuthenticated() {
    return this.authenticatedUser != undefined;
  }

  // Login / Logout
  public logout(): Observable<boolean> {
    this.authenticatedUser == undefined;
    localStorage.removeItem('authUser');
    return of(true);
  }
}
