import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, Action, on } from '@ngrx/store';
import * as actions from '../actions/todo-item.actions';
export interface TodoEntity {
  id: string;
  name: string;
  dueDate?: string;
  project?: string;
  completed: boolean;
}

export interface TodosState extends EntityState<TodoEntity> {

}

export const adapter = createEntityAdapter<TodoEntity>();

const initialState = adapter.getInitialState();


const reducerFunction = createReducer(
  initialState,
  // on(actions.todoItemAddedSuccessfully, (state, action) => {
  //   return adapter.updateOne({
  //     id: action.oldId,
  //     changes: {
  //       id: action.payload.id
  //     }
  //   }, state);
  // }),
  on(actions.todoItemAddedSuccessfully, (state, action) => {
    const tempState = adapter.removeOne(action.oldId, state);
    return adapter.addOne(action.payload, tempState);
  }),
  on(actions.todoItemAddFailure, (s, a) => adapter.removeOne(a.payload.id, s)),
  on(actions.todoItemAdded, (state, action) => adapter.addOne(action.payload, state)),
  on(actions.todoItemMarkedComplete, actions.todoItemMarkedIncomplete,
    (state, action) => adapter.updateOne({
      id: action.item.id,
      changes: {
        completed: !action.item.completed
      }
    }, state)
  ),
  on(actions.loadTodosSucceeded, (state, action) => adapter.setAll(action.payload, state))
);

export function reducer(state: TodosState = initialState, action: Action): TodosState {
  return reducerFunction(state, action);
}



