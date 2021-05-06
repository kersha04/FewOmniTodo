import { createEffect, ofType, Actions } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'; // NOTE: Only this one ever. never the.prod or whatever.
import * as authActions from '../actions/auth.actions';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';
@Injectable()
export class AuthEffects {

  readonly baseUri = environment.apiUrl;

  // loginSucceeded => (route change) => NOTHING
  loginSucceeded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginSucceeded),
      tap(() => this.router.navigate(['dashboard']))
    ), { dispatch: false }
  );


  // logInRequested => (posting it to the API) => (loginSucceeded | loginFailed)
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginRequested),
      switchMap(request => this.client.post<{ access_token: string }>(this.baseUri + 'auth/login', {
        username: request.username,
        password: request.password
      }).pipe(
        map(response => authActions.loginSucceeded({ username: request.username, token: response.access_token })),
        catchError(() => of(authActions.loginFailed({ reason: 'Sorry Cannot Login' })))
      ))
    ), { dispatch: true }
  );

  // loginSucceeded => write the token and the expiration into the localStorage => (NOTHING (dispatch false))
  loginSucccededSaveToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.loginSucceeded),
      tap(a => {
        localStorage.setItem('token', a.token);
        const tokenData = JSON.parse(atob(a.token.split('.')[1])) as { exp: number, username: string };
        const date = new Date();
        date.setUTCSeconds(tokenData.exp);
        localStorage.setItem('token-expire', JSON.stringify(date));
        localStorage.setItem('username', tokenData.username);

      })
    )
    , { dispatch: false });


  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logOutRequested),
      tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('token-expire');
        localStorage.removeItem('username');
      })
    )
    , { dispatch: false });


  logoutSendsToLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.logOutRequested),
      tap(() => this.router.navigate(['login']))
    )
    , { dispatch: false });


  checkForCredentials$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.checkForCredentials),
      map(() => {
        // read the token and stuff. If it is expired or not there, return null
        const expire = localStorage.getItem('token-expire');
        const username = localStorage.getItem('username');
        const token = localStorage.getItem('token');
        if (expire && username && token) {
          const expireDate = new Date(JSON.parse(expire));
          if (expireDate > new Date()) {
            return ({ expire, username, token });
          } else {
            return null;
          }
        } else {
          return null;
        }
      }),
      filter((t: { expire: string; username: string, token: string }) => t !== null), // stop here if it isn't a good set of credentials
      map(t => authActions.loginSucceeded({ username: t.username, token: t.token }))
    )
    , { dispatch: true });

  constructor(
    private actions$: Actions,
    private client: HttpClient,
    private router: Router
  ) { }
}
