import { Categories } from './../categories';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.sass']
})
export class CategoriesComponent {

  constructor (private router: Router) {}

  categories:Categories[]=[
    {
      path:"auto.png",
      name:"Auto, Rad & Boot"
    },
    {
      path:"babys.png",
      name:"Babys & Kleinkinder"
    },
    {
      path:"buro.png",
      name:"Büro"
    },
    {
      path:"electronic.png",
      name:"Elektronik"
    },
    {
      path:"film.png",
      name:"Filme, Bücher & Musik"
    },
    {
      path:"hobby.png",
      name:"Freizeit & Hobby"
    },
    {
      path:"handg.png",
      name:"Handgemacht"
    },
    {
      path:"garden.png",
      name:"Haus & Garten"
    },
    {
      path:"animals.png",
      name:"Haustiere"
    },
    {
      path:"beauty.png",
      name:"Mode & Beauty"
    },
    {
      path:"accessories.png",
      name:"Schmuck & Accessoires"
    },
    {
      path:"games.png",
      name:"Spiele & Spielzeug"
    },{
      path:"sport.png",
      name:"Sport"
    },
    {
      path:"decor.png",
      name:"Wohnen & Deko"
    },
    {
      path:"other.png",
      name:"Sonstiges"
    }

  ]

  public searchForCategory(category: string) {
    this.router.navigate(['/products'], {queryParams: {category}});
  }

}
