import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  recargarTab(event: any) {
    this.router.navigate([this.router.url]);
  }


  ngOnInit() {
  }

}
