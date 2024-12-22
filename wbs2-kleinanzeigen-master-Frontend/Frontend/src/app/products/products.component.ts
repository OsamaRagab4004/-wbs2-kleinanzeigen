import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass'],
})
export class ProductsComponent implements OnInit {
  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toasterService: ToastrService
  ) {}
  public produkte: any = [];
  public value: number = 0;
  public highValue: number = 0;
  public maxPreis: number = 0;
  public minPreis: number = 0;
  public preisCollapsed = true;
  public verkaeuferId: any;
  public options = {
    ceil: Number.MAX_SAFE_INTEGER,
    floor: 0,
    translate: (value: number): string => {
      return '$' + value;
    },
  };

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      let param = new HttpParams();
      if (params['q']) {
        param = param.append('q', params['q']);
      }
      if (params['category']) {
        param = param.append('kategorie', params['category']);
      }
      if (params['verkaeuferId']) {
        param = param.append('verkaeuferId', params['verkaeuferId']);
      }
      param = param.append('sortierenNach', params['sort'] ? 'preis' : '');
      param = param.append('reihenfolge', params['sort'] ?? '');
      param = param.append('minPreis', params['minPreis'] ?? 0);
      param = param.append(
        'maxPreis',
        params['maxPreis'] ?? Number.MAX_SAFE_INTEGER
      );
      this.httpClient
        .get('http://localhost:3000/produkte', {
          withCredentials: true,
          params: param,
        })
        .subscribe((result: any) => {
          this.produkte = result.produkte;
          this.maxPreis = Math.ceil(result.maxPreis);
          this.minPreis = Math.floor(result.minPreis);
          this.options = {
            floor: Math.floor(result.minPreis),
            ceil: Math.ceil(result.maxPreis),
            translate: (value: number): string => {
              return '$' + value;
            },
          };
          if (params['minPreis'] && params['maxPreis']) {
            this.value = +params['minPreis'];
            this.highValue = +params['maxPreis'];
          } else {
            this.value = this.minPreis;
            this.highValue = this.maxPreis;
          }
        });
    });
  }

  navigateToProdukt(id: number) {
    this.router.navigate(['product-info'], { queryParams: { id } });
  }

  applyPreis() {
    this.route.queryParams.subscribe((params) => {
      this.router.navigate(['products'], {
        queryParams: {
          ...params,
          minPreis: this.value,
          maxPreis: this.highValue,
        },
      });
    });
  }

  applyOrder(dir: 'DESC' | 'ASC') {
    this.route.queryParams.subscribe((params) => {
      this.router.navigate(['products'], {
        queryParams: { ...params, sort: dir },
      });
    });
  }
}
