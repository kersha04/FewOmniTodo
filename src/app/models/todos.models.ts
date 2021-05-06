export interface TodoCreate {
  name: string;
  dueDate?: string;
  project?: string;
}


export interface TodoListItem {
  id: string;
  name: string;
  dueDate?: string;
  project?: string;
  completed: boolean;
  isSaved: boolean;
}
