
import { createAction, props } from '@ngrx/store';
import { TodoCreate } from '../models';
import { TodoEntity } from '../reducers/todos.reducer';

let fakeId = 1;
// "Initiator"
// name, dueDate?, project?

export const todoItemAdded = createAction(
  '[app] todo item added',
  ({ item }: { item: TodoCreate }) => ({
    payload: {
      ...item,
      completed: false,
      id: 'TEMP' + fakeId++
    } as TodoEntity
  })
);


export const todoItemAddedSuccessfully = createAction(
  '[app] todo item added successfully',
  props<{ payload: TodoEntity, oldId: string }>()
);

export const todoItemAddFailure = createAction(
  '[app] todo item add failed',
  props<{ payload: TodoEntity, message: string }>()
);

export const todoItemMarkedComplete = createAction(
  '[app] todo item marked completed',
  props<{ item: TodoEntity }>()
);

export const todoItemMarkedIncomplete = createAction(
  '[app] todo item marked incomplete',
  props<{ item: TodoEntity }>()
);

// initiator
export const loadTodos = createAction(
  '[app] load todos'
);

export const loadTodosSucceeded = createAction(
  '[app] loading todos succeeded',
  props<{ payload: TodoEntity[] }>()
);

export const loadTodosFailed = createAction(
  '[app] loading todos failed',
  props<{ errorMessage: string }>()
);
