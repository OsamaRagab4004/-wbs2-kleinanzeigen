import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Kategorie } from '../enums/kategorie';
import { Zustaende } from '../enums/zustaende';
import { Produkt } from '../models/produkt';
import { ExceptionHandler } from '../shared/exception-handler';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.sass'],
})
export class AddProductComponent implements OnInit {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private toasterService: ToastrService
  ) {}

  async ngOnInit() {
    const params = await firstValueFrom(this.route.params)
    if(params['produktId']) {
        try{
            this.produktId = params['produktId']
            const resProdukt = this.httpClient.get<Produkt>(`http://localhost:3000/produkte/${this.produktId}`)
            const resBilder = this.httpClient.get<Array<string>>(`http://localhost:3000/produkte/${this.produktId}/bilder`)
            const promiseResProdukt = firstValueFrom(resProdukt)
            const promiseResBilder = firstValueFrom(resBilder)
            const promiseRes = await Promise.all([promiseResProdukt, promiseResBilder])
            this.name.setValue(promiseRes[0].name)
            this.beschreibung.setValue(promiseRes[0].beschreibung)
            this.preis.setValue(promiseRes[0].preis)
            this.verhandelbar.setValue(promiseRes[0].verhandelbar)
            this.kategorie.setValue(promiseRes[0].kategorie)
            this.istVerkauft.setValue(promiseRes[0].istVerkauft)
            this.uploadedBilder = promiseRes[1]
        } catch (e) {
            ExceptionHandler.handleError(e, this.toasterService)
        }
    }
  }
  produktId?: number;
  currentDeleteImageId?: string;

  kategorien = Object.entries(Kategorie);

  produktForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    preis: new FormControl(0, [Validators.required, Validators.min(0)]),
    verhandelbar: new FormControl(false, [Validators.required]),
    kategorie: new FormControl(Kategorie.SONSTIGES, [Validators.required]),
    beschreibung: new FormControl('', [Validators.required]),
    istVerkauft: new FormControl(false)
  });

  produktBilder: FormData | undefined;
  bilderName: Array<string> = [];
  uploadedBilder?: Array<string>;
  get name() {
    return this.produktForm.controls.name;
  }
  get preis() {
    return this.produktForm.controls.preis;
  }
  get verhandelbar() {
    return this.produktForm.controls.verhandelbar;
  }
  get kategorie() {
    return this.produktForm.controls.kategorie;
  }
  get beschreibung() {
    return this.produktForm.controls.beschreibung;
  }
  get istVerkauft() {
    return this.produktForm.controls.istVerkauft;
  }

  updateFiles(event: any) {
    const bilder: FileList = event?.target.files;
    this.produktBilder = new FormData();
    this.bilderName = [];
    for (let i = 0; i < bilder.length; i++) {
      this.produktBilder.append('bilder', bilder[i]);
      this.bilderName.push(bilder[i].name);
    }
  }

  async submitForm() {
    try {
      const produktUrl = this.produktId? `http://localhost:3000/produkte/${this.produktId}` : "http://localhost:3000/produkte"
      const body = {
        name: this.name.value,
        preis: this.preis.value,
        kategorie: this.kategorie.value,
        beschreibung: this.beschreibung.value,
        verhandelbar: this.verhandelbar.value,
        istVerkauft: this.istVerkauft.value 
      }
      const option = { withCredentials: true }
      const resProdukt = this.produktId ? this.httpClient.patch<{produkt: Produkt}>(produktUrl, body, option) : this.httpClient.post<{produkt: Produkt}>(produktUrl, body,option)
      const promiseResProdukt = await firstValueFrom(resProdukt);
      const produktId = +promiseResProdukt.produkt.id;
      const resBilder = this.httpClient.post(
        `http://localhost:3000/produkte/${produktId}/bilder`,
        this.produktBilder,
        { withCredentials: true }
      );
      const promiseResBilder = await lastValueFrom(resBilder);
      this.router.navigate(['/verkaeufer'], { state: { zustand: this.produktId? Zustaende.PRODUKT_BEARBEITET : Zustaende.PRODUKT_HINZUGEFUEGT}});
    } catch (e) {
        ExceptionHandler.handleError(e, this.toasterService)
    }
  }
  handleDeleteBild(imageId: string) {
    this.currentDeleteImageId = imageId
  }
  async handleDeleteBildConfirm() {
    try {
        const resDeleteBild = this.httpClient.delete(`http://localhost:3000/produkte/${this.produktId}/bilder/${this.currentDeleteImageId}`, { withCredentials: true })
        const promiseResDeleteBild = await firstValueFrom(resDeleteBild)
        const resBilder = this.httpClient.get<Array<string>>(`http://localhost:3000/produkte/${this.produktId}/bilder`)
        const promiseResBilder = await firstValueFrom(resBilder)
        this.uploadedBilder = promiseResBilder
        this.toasterService.success(Zustaende.BILD_GELOESCHT)
    } catch(e) {
        ExceptionHandler.handleError(e, this.toasterService)
    }
  }

  imageIdToUrl(bildId: string) {
    return `http://localhost:3000/uploads/${this.produktId}/${bildId}`
  }

}
