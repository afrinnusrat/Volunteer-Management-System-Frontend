import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-our-animals-page",
  templateUrl: "./our-animals-page.component.html",
  styleUrls: ["./our-animals-page.component.css", "../../website-style.css"],
})
export class OurAnimalsPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    document.body.scrollTop = 0;
  }
}
