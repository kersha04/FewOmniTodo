import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Store } from '@ngrx/store';
import { TodoCreate } from 'src/app/models';
import { AppState } from 'src/app/reducers';
import * as actions from '../../actions/todo-item.actions';

@Component({
  selector: 'app-todo-entry',
  templateUrl: './todo-entry.component.html',
  styleUrls: ['./todo-entry.component.css']
})
export class TodoEntryComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private bottomSheetRef: MatBottomSheetRef<TodoEntryComponent>,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      project: [],
      dueDate: []
    });
  }

  submit(): void {
    if (this.form.valid) {

      const itemToAdd: TodoCreate = {
        name: this.form.get('name').value,
        project: this.form.get('project').value,
        dueDate: this.form.get('dueDate').value ? new Date(this.form.get('dueDate').value).toISOString() : null,
      };
      this.store.dispatch(actions.todoItemAdded({ item: itemToAdd }));
      this.bottomSheetRef.dismiss();
    }
  }

  cancel(): void {
    this.bottomSheetRef.dismiss();
  }
}
