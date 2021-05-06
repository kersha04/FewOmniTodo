import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectEntity } from '../reducers/projects.reducer';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class ProjectsDataService { // the plural "Projects" is inspired by Drashti.

  private readonly baseUrl = environment.apiUrl + 'projects/';
  getAllProjects(): Observable<ProjectEntity[]> {
    return this.http.get<GetProjectsResponse>(this.baseUrl)
      .pipe(
        map(response => response.data)
      );
  }

  constructor(
    private http: HttpClient
  ) { }
}

export interface GetProjectsResponse {
  data: ProjectEntity[];
}
