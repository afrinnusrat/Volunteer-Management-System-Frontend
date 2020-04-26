import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";

import { FosterModel } from "../../shared/models/foster.model";
import { FostersService } from 'src/app/shared/services/new-fosters.service';

@Component({
  selector: "app-view-fosters",
  templateUrl: "./view-fosters.component.html",
  styleUrls: ["./view-fosters.component.css"],
  providers: [FostersService]
})
export class ViewFostersComponent implements OnInit
{
  fosterList: FosterModel[] = [];
  isLoading: boolean = false;
  fetched: FosterModel;
  fetchedLoading: boolean = false;

  // //Boolean to determine if foster is an admin or not
  adminCheck: boolean = false;
  // //boolean to determine to disable buttons on viewFoster modal footer
  deletable: boolean = true;

  constructor(private test: FostersService) {}

  ngOnInit()
  {
    this.loadAllFosters();
  }

  /**
   * Converts booleans into Yes/No
   * Determines if foster is an admin
   * @param id
   */
  viewFoster(fosterID: number)
  {
    if (!(fosterID || fosterID === 0)) {
      console.log('ERROR: failed because fosterID: ' + fosterID);
      return;
    }

    this.fetchFoster(fosterID);
  }

  activateFoster()
  {
    if (!this.fetched) {
      console.log('fetched is still undefined');
      return;
    }

    if (this.fetched.active)
      this.fetched.active = false;
    else
      this.fetched.active = true;

    this.updateFoster(this.fetched);
  }

  /**
   * Removes the foster from the database
   */
  onDeleteFoster(fosterID: number): void
  {
    if (!(fosterID || fosterID === 0)) {
      console.log('ERROR: foster ID: ' + fosterID);
      return;
    }

    this.deleteFoster(fosterID);
  }

  editFoster(form: NgForm, id:number)
  {
    if (!this.fetched) {
      console.log('attempted to send an undefined thing');
      return;
    }

    this.updateFoster(this.fetched)
  }

  private fetchFoster(fosterID: number): void
  {
    this.fetchedLoading = true;
    this.test.getFoster(fosterID)
    .subscribe(
      (foster: FosterModel) => {
        this.fetched = foster;
        this.fetchedLoading = false;
      },
      (error: any) => {
        console.log(error);
        this.fetchedLoading = false;
      }
    );
  }

  private updateFoster(changes: FosterModel): void
  {
    this.test.updateFoster(changes)
    .subscribe(
      (status: any) => {
        this.loadAllFosters();
      },
      (error: any) => {
        console.log('Error in updateFoster: ');
        console.log(error);
      }
    );
  }

  private deleteFoster(fosterID: number): void
  {
    this.test.removeFoster(fosterID)
    .subscribe(
      (status: any) => {  // http success
        this.loadAllFosters();
      },
      (error: any) => {  // http failure
        console.log(error);
      },
    );
  }

  private loadActiveFosters(): void
  {
    this.isLoading = true;
    this.test.loadFosters(true)  // true means active == true fosters are returned
    .subscribe(
      (fosters: FosterModel[]) => {  // http success
        this.fosterList = [];
        fosters.forEach((foster: FosterModel) => {
          this.fosterList.push(foster);
        });
        this.isLoading = false;
      },
      (error: any) => {  // http error
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  private loadAllFosters(): void
  {
    const regex = new RegExp('^.+(@calgaryanimalrescue\.com)$');

    this.isLoading = true;
    this.test.loadAllFosters()
    .subscribe(
      (fosters: FosterModel[]) => {  // http success
        this.fosterList = [];
        fosters.forEach((foster: FosterModel) => {
          if (!regex.test(foster.email)) {
            this.fosterList.push(foster);
          }
        });
        this.isLoading = false;
      },
      (error: any) => {  // http error
        console.log(error);
        this.isLoading = false;
      }
    );
  }

}