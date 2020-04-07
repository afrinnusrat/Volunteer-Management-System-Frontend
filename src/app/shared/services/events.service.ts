import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EventModel } from "../models/event.model";

/******************************************************************************/
@Injectable({
  providedIn: "root"
})
export class EventsService
{
  private REST_API_SERVER = "http://68.66.193.100:8080/CARS/";
  private CTRL_MAPPING = "events/";

  constructor(private http: HttpClient) {}

  /**
   * Sends a request to the backend for an array containing all events.
   * Returns the list of events in a subscribe-able object.
   * @returns {Observable<EventModel[]>}
   */
  public loadEvents(): Observable<EventModel[]>
  {
    return this.sendGetAllLoadRequest()
      .pipe(
        map((responseData: EventModel[]) => {
          const eventArray: EventModel[] = [];
          responseData.forEach((event: EventModel) => {
            if (event.id) {
              eventArray.push(event);
            }
          });
          return eventArray;
        })
      );
  }

  /**
   * Sends a request to get a single Event matching the input id.
   * Returns a subscribe-able object containing the found Event.
   * @param eventID
   */
  public getEvent(eventID: number): Observable<EventModel>
  {
    return this.sendGetEventRequest(eventID)
      .pipe(
        map((responseData: EventModel) => {
          return responseData;
        })
      );
  }

  /**
   * Sends a request to add a new Event to the backend database. The
   * input is the new Event to persist to the backend. Returns a
   * subscibe-able object containing the server success/error response.
   * @param newEvent
   */
  public addEvent(newEvent: EventModel): Observable<string>
  {
    return this.sendPostRequest(newEvent)
      .pipe(
        map((responseData) => {
          return responseData;
        })
      );
  }

  /**
   * Sends a request to update an event. The input is an Event
   * with the same ID as the one we want to update in the backend.
   * Returns a subscibe-able object containing the server success/error
   * response.
   * @param changes
   */
  public updateEvent(changes: EventModel): Observable<string>
  {
    return this.sendUpdateRequest(changes)
      .pipe(
        map((responseData: string) => {
          return responseData;
        })
      );
  }

  /**
   * Sends a delete request to the backend. Input ID is used in the
   * backend to delete an event with a matching ID. Returns a subscribe-
   * able object containing the server success/error response.
   * @param deleteID
   */
  public removeEvent(deleteID: number): Observable<string>
  {
    return this.sendDeleteRequest(deleteID)
      .pipe(
        map((responseData) => {
          return responseData;
        })
      );
  }

  /******************************************************************************/
  /**
   * Http get load info from server.
   */
  private sendGetAllLoadRequest()
  {
    return this.http.get<EventModel[]>(
      this.REST_API_SERVER + this.CTRL_MAPPING
    );
  }

  /**
   * Http get one event from server.
   */
  private sendGetEventRequest(id: number)
  {
    return this.http.get<EventModel>(
      this.REST_API_SERVER + this.CTRL_MAPPING + id
    );
  }

  /**
   * HTTP post new event to server
   */
  private sendPostRequest(event: EventModel)
  {
    return this.http.post(
      this.REST_API_SERVER + this.CTRL_MAPPING,
      event,
      {responseType: 'text'}
    );
  }

  /**
   * HTTP delete event from server
   */
  private sendDeleteRequest(id: number)
  {
    return this.http.delete(
      this.REST_API_SERVER + this.CTRL_MAPPING + id,
      { responseType: 'text' }
    );
  }

  /**
   * HTTP patch event to update server
   */
  private sendUpdateRequest(event: EventModel)
  {
    return this.http.patch(
      this.REST_API_SERVER + this.CTRL_MAPPING,
      event,
      { responseType: 'text' }
    );
  }

}
