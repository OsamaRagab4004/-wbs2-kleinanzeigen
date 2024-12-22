import { UserService } from './services/user.service';
import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { UnregisteredUserService } from './services/unregistered-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements DoCheck{
    title = 'webflea';
  constructor(private route:Router, private unregisteredUserService: UnregisteredUserService){

  }

  ngDoCheck(): void {
    if(this.route.url == "/products"){
      let bef = document.querySelectorAll(".hide")
      bef.forEach(ele => {
        ele.classList.add("boxnone")
      })
    }else{
      let bef = document.querySelectorAll(".hide")
      bef.forEach(ele => {
        ele.classList.remove("boxnone")
      })
    }
    if(this.route.url == "/products"){
      let diss = document.querySelectorAll(".diss")
      diss.forEach(ele => {
        ele.classList.remove("d-none")
      })
    }else{
      let diss = document.querySelectorAll(".diss")
      diss.forEach(ele => {
        ele.classList.add("d-none")
      })
    }
    if(this.route.url == "/user" || this.route.url == "/admin"){
      let diss = document.querySelectorAll(".diss")
      diss.forEach(ele => {
        ele.classList.add("d-none")
      })
    }else{
      let diss = document.querySelectorAll(".diss")
      diss.forEach(ele => {
        ele.classList.remove("d-none")
      })
    }
    if(this.route.url == "/user"){
      let diss = document.querySelectorAll(".hide")
      diss.forEach(ele => {
        ele.classList.add("boxnone")
      })
    }else{
      let diss = document.querySelectorAll(".hide")
      diss.forEach(ele => {
        ele.classList.remove("d-none")
      })
    }
  }
}
