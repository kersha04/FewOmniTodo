import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState, selectIsLoggedIn } from 'src/app/reducers';
import { logOutRequested } from 'src/app/actions/auth.actions';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  isHandset$: Observable<boolean>;

  isLoggedIn$: Observable<boolean>;


  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.store.select(selectIsLoggedIn);
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  logOut(): void {
    this.store.dispatch(logOutRequested());
  }
}
