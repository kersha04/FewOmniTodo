import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { TodoCreate } from '../models';
import { TodoEntity } from '../reducers/todos.reducer';
@Injectable()
export class TodosDataService {

  readonly baseUrl = environment.apiUrl + 'todos/';

  constructor(private client: HttpClient) { }

  addTodo(todo: TodoEntity): Observable<TodoEntity> {
    const entity = {
      name: todo.name,
      project: todo.project,
      dueDate: todo.dueDate,
      completed: todo.completed
    } as TodoPostRequest;
    return this.client.post<TodoEntity>(this.baseUrl, entity);
  }

  getAllTodos(): Observable<TodoEntity[]> {
    return this.client.get<GetTodosResponse>(this.baseUrl)
      .pipe(
        map(response => response.data)
      );
  }
}

interface GetTodosResponse {
  data: TodoEntity[];
}

interface TodoPostRequest {
  name: string;
  project: string;
  dueDate: string;
  completed: boolean;
}
