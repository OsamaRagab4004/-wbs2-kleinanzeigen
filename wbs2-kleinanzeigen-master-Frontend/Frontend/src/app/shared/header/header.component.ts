import { Location } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, Subscription } from 'rxjs';
import { Kategorie } from 'src/app/enums/kategorie';
import { Zustaende } from 'src/app/enums/zustaende';
import { UserService } from 'src/app/services/user.service';
import { ExceptionHandler } from '../exception-handler';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private httpClient: HttpClient,
    private toasterService: ToastrService,
    private location: Location
  ) {}
  public user$ = this.userService.user$;
  public homeLink = '';
  public q: string = '';
  public category: string = '';
  public categories = Object.values(Kategorie);
  userSubscribe?: Subscription;
  paramsSubscribe?: Subscription;
  urlChangeSubscribe?: VoidFunction;
  ngOnInit(): void {
    this.urlChangeSubscribe = this.location.onUrlChange((url, state: any) => {
      if (state['zustand']) {
        this.toasterService.success(state.zustand);
      }
    });

    this.paramsSubscribe = this.route.queryParams.subscribe((params) => {
      this.category = params['category'];
      this.q = params['q'];
    });
    this.userSubscribe = this.user$.subscribe((user) => {
      if (user?.nutzerTyp) {
        this.homeLink = user.nutzerTyp.toLowerCase();
      } else {
        this.homeLink = 'user-panel';
      }
    });
  }
  ngOnDestroy(): void {
    this.userSubscribe?.unsubscribe();
    this.paramsSubscribe?.unsubscribe();
    if (this.urlChangeSubscribe) {
      this.urlChangeSubscribe();
    }
  }

  setCategory(category: string) {
    this.category = category;
  }

  async handleLogoutConfirm() {
    try {
      const res = this.httpClient.post(
        'http://localhost:3000/auth/abmelden',
        null,
        { withCredentials: true }
      );
      await firstValueFrom(res);
      await this.userService.retrieveUser();
      this.router.navigate(['/'], { state: { zustand: Zustaende.ABGEMELDET } });
    } catch (e) {
        ExceptionHandler.handleError(e, this.toasterService)
    }
  }
  async search() {
    this.router.navigate(['/products'], {
      queryParams: {
        q: this.q,
        category: this.category,
        minPreis: undefined,
        maxPreis: undefined,
      },
    });
  }
}
