import { createAction, props } from '@ngrx/store';
import { ProjectEntity } from '../reducers/projects.reducer';

export const loadProjects = createAction(
  '[app] load projects'
);

export const loadProjectsSucceeded = createAction(
  '[app] loading projects succeeded',
  props<{ payload: ProjectEntity[] }>()
);

export const loadingProjectsFailed = createAction(
  '[app] loading projects failed',
  props<{ errorMessage: string }>()
);
