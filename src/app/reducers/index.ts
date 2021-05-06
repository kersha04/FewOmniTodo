
import { ActionReducerMap, createSelector } from '@ngrx/store';
import * as fromTodos from './todos.reducer';
import * as models from '../models';
import * as fromProjects from './projects.reducer';
import * as fromAuth from './auth.reducer';

export interface AppState {
  todos: fromTodos.TodosState;
  projects: fromProjects.ProjectState;
  auth: fromAuth.AuthState;
}

export const reducers: ActionReducerMap<AppState> = {
  todos: fromTodos.reducer,
  projects: fromProjects.reducer,
  auth: fromAuth.reducer
};


// 1 - Feature Select (done, we aren't in a feature)

// 2. One per branch on the state (right now, we have one, called Todos)
const selectTodosBranch = (state: AppState) => state.todos;
const selectProjectsBranch = (state: AppState) => state.projects;
const selectAuthBranch = (state: AppState) => state.auth;

// 3. Any helpers (not usually exported)
const { selectAll: selectAllTodoArray } = fromTodos.adapter.getSelectors(selectTodosBranch);
const { selectAll: selectAllProjectArray } = fromProjects.adapter.getSelectors(selectProjectsBranch);


const selectTodoItemsListModel = createSelector(
  selectAllTodoArray,
  (todos) => todos.map(todo => {
    return {
      ...todo,
      isSaved: !todo.id.startsWith('TEMP')
    } as models.TodoListItem;
  })
);

// 4. What your components need.

export const selectInboxItems = createSelector(
  selectTodoItemsListModel,
  items => items.filter(item => !item.dueDate && !item.project)
);


export const selectNumberOfInboxItems = createSelector(
  selectInboxItems,
  items => items.length
);

export const selectProjectList = createSelector(
  selectAllProjectArray,
  selectTodoItemsListModel,
  (projects, todos) => {
    return projects.map(project => ({
      ...project,
      numberOfTodos: todos.filter(todo => todo.project === project.name).length
    } as models.ProjectListItem));
  });

// Given a project, reutrn a models.ProjectLitItem[] of those todos.
export const selectTodosForProject = createSelector(
  selectTodoItemsListModel,
  (todos, props: { project: string }) => {
    return todos.filter(todo => todo.project === props.project)
      .map(todo => todo as models.TodoListItem);
  }
);


export const selectIsLoggedIn = createSelector(
  selectAuthBranch,
  b => b.isLoggedIn
);

// s => s.auth.token
export const selectAuthToken = createSelector(
  selectAuthBranch,
  b => b.token
);
