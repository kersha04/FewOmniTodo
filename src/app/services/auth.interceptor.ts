import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState, selectAuthToken, selectIsLoggedIn } from '../reducers';
import { environment } from '../../environments/environment';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  isLoggedIn: boolean;
  token: string;
  constructor(store: Store<AppState>) {
    store.select(selectIsLoggedIn).subscribe((on) => this.isLoggedIn = on);
    store.select(selectAuthToken).subscribe(token => this.token = token);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // if the url is for the api and NOT for the the authUrl (auth/login) and they are logged in
    if (req.url !== environment.apiUrl + 'auth/token' && this.isLoggedIn && req.url.startsWith(environment.apiUrl)) {
      // then attach a new authorization header with the bearer token from the store to the request.
      // challenge: You are not allowed to change the request (the req variable in the params list).
      // you have to take that and create a whole new request.
      const newHeaders = req.headers.append('Authorization', 'Bearer ' + this.token);
      const authRequest = req.clone({ headers: newHeaders });
      // pass that new request
      return next.handle(authRequest);
    } else {
      // return the original one if it didn't meet the preconditions to the next interceptor.
      return next.handle(req);
    }

  }

}
