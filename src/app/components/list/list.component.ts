import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TodoListItem } from 'src/app/models';
import { AppState, selectInboxItems, selectTodosForProject } from 'src/app/reducers';
import * as actions from '../../actions/todo-item.actions';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  list$: Observable<TodoListItem[]>;
  constructor(
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<ListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { filter: string, id: string }
  ) { }

  ngOnInit(): void {
    switch (this.data.filter) {
      case 'inbox': {
        this.list$ = this.store.select(selectInboxItems);
        break;
      }
      case 'project': {
        this.list$ = this.store.select(selectTodosForProject, { project: this.data.id });
      }
      default: {
        // this.close();
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  markComplete(item: TodoListItem): void {
    this.store.dispatch(actions.todoItemMarkedComplete({ item }));
  }

  markIncomplete(item: TodoListItem): void {
    this.store.dispatch(actions.todoItemMarkedIncomplete({ item }));
  }
}
