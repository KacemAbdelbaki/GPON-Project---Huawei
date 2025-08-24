import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environment/environment';
import { Box } from '../../../Core/Models/Equipment/Box';
import { BoxType } from '../../../Core/Models/Equipment/BoxType';
import { Status } from '../../../Core/Models/Equipment/Status';

@Injectable({
  providedIn: 'root'
})
export class BoxService {
  private apiUrl = `${environment.BASE_URL}/equipment/api/box`;

  constructor(private http: HttpClient) { }

  // Get all boxes
  findAll(): Observable<Box[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`).pipe(
      map((response: any[]) => {
        // Filter out any non-object entries (like just IDs)
        return response.filter((item: any) => typeof item === 'object' && item !== null);
      })
    );
  }

  // Get box by ID
  findById(id: number): Observable<Box> {
    return this.http.get<Box>(`${this.apiUrl}/${id}`);
  }

  // Get boxes by type
  findByType(type: BoxType): Observable<Box[]> {
    return this.http.get<Box[]>(`${this.apiUrl}/type/${type}`);
  }

  // Get boxes by status
  findByStatus(status: Status): Observable<Box[]> {
    return this.http.get<Box[]>(`${this.apiUrl}/status/${status}`);
  }

  // Get boxes by type and status
  findByTypeAndStatus(type: BoxType, status: Status): Observable<Box[]> {
    return this.http.get<Box[]>(`${this.apiUrl}/type/${type}/status/${status}`);
  }

  // Get box by address ID
  findByAddressId(addressId: number): Observable<Box> {
    return this.http.get<Box>(`${this.apiUrl}/address/${addressId}`);
  }

  // Get boxes by previous box ID
  findByPreviousBoxId(previousBoxId: number): Observable<Box[]> {
    return this.http.get<Box[]>(`${this.apiUrl}/previous/${previousBoxId}`);
  }
  
  // Get boxes by next box ID
  findByNextBoxId(nextBoxId: number): Observable<Box[]> {
    return this.http.get<Box[]>(`${this.apiUrl}/next/${nextBoxId}`);
  }

  // Get boxes by board ID
  findByBoardId(boardId: number): Observable<Box[]> {
    return this.http.get<Box[]>(`${this.apiUrl}/board/${boardId}`);
  }

  // Get boxes by OLT ID
  findByOltId(oltId: number): Observable<Box[]> {
    return this.http.get<Box[]>(`${this.apiUrl}/olt/${oltId}`);
  }

  // Get next box
  next(box: Box): Observable<Box> {
    return this.http.post<Box>(`${this.apiUrl}/next`, box);
  }
  
  // Connect box to next box
  connectToNext(boxId: number, nextBoxId: number): Observable<Box> {
    return this.http.post<Box>(`${this.apiUrl}/${boxId}/connect-to-next/${nextBoxId}`, {});
  }
  
  // Connect box to previous box
  connectToPrevious(boxId: number, previousBoxId: number): Observable<Box> {
    return this.http.post<Box>(`${this.apiUrl}/${boxId}/connect-to-previous/${previousBoxId}`, {});
  }

  // Save new box
  save(box: Box): Observable<Box> {
    return this.http.post<Box>(`${this.apiUrl}/save`, box);
  }

  // Update existing box
  update(id: number, box: Box): Observable<Box> {
    return this.http.put<Box>(`${this.apiUrl}/update/${id}`, box);
  }

  // Delete box
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
