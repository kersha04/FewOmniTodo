import { createAction, props } from '@ngrx/store';

export const loginRequested = createAction(
  '[app] auth login requested',
  props<{ username: string; password: string }>()
);

export const loginSucceeded = createAction(
  '[app] auth login succeeded',
  props<{ username: string; token: string; }>()
);

export const loginFailed = createAction(
  '[app] auth login failed',
  props<{ reason: string }>()
);

export const logOutRequested = createAction(
  '[app] auth logout requested'
);

export const checkForCredentials = createAction(
  '[app] auth check for credentials'
);
