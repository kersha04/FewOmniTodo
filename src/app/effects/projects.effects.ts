import { Injectable } from '@angular/core';
// import { Actions } from '@ngrx/store-devtools/src/reducer'; // DANGIT WILLIAM! YOU DID THIS TO ME!!!
import { ProjectsDataService } from '../services/projects-data.service';
import * as actions from '../actions/project.actions';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class ProjectsEffects {

  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.loadProjects),
      switchMap(() => this.service.getAllProjects()
        .pipe(
          map(payload => actions.loadProjectsSucceeded({ payload })),
          catchError((err) => of(actions.loadingProjectsFailed({ errorMessage: 'Something went wrong loading projects' })))
        )

      )
    )
    , { dispatch: true });

  constructor(
    private actions$: Actions,
    private service: ProjectsDataService
  ) { }
}
