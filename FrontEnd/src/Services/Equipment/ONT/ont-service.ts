import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ONT } from '../../../Core/Models/Equipment/ONT';
import { Status } from '../../../Core/Models/Equipment/Status';

@Injectable({
  providedIn: 'root'
})
export class ONTService {
  private apiUrl = `${environment.BASE_URL}/equipment/api/ont`;

  constructor(private http: HttpClient) { }

  // Get all ONTs
  findAll(): Observable<ONT[]> {
    return this.http.get<ONT[]>(`${this.apiUrl}/all`);
  }

  // Get ONT by ID
  findById(id: number): Observable<ONT> {
    return this.http.get<ONT>(`${this.apiUrl}/${id}`);
  }

  // Get ONTs by status
  findByStatus(status: Status): Observable<ONT[]> {
    return this.http.get<ONT[]>(`${this.apiUrl}/status/${status}`);
  }

  // Get ONT by address ID
  findByAddressId(addressId: number): Observable<ONT> {
    return this.http.get<ONT>(`${this.apiUrl}/address/${addressId}`);
  }

  // Get ONT by client ID
  findByClientId(clientId: number): Observable<ONT> {
    return this.http.get<ONT>(`${this.apiUrl}/client/${clientId}`);
  }

  // Get ONTs by box ID
  findByBoxId(boxId: number): Observable<ONT[]> {
    return this.http.get<ONT[]>(`${this.apiUrl}/box/${boxId}`);
  }

  // Get ONTs by board ID
  findByBoardId(boardId: number): Observable<ONT[]> {
    return this.http.get<ONT[]>(`${this.apiUrl}/board/${boardId}`);
  }

  // Get ONTs by OLT ID
  findByOltId(oltId: number): Observable<ONT[]> {
    return this.http.get<ONT[]>(`${this.apiUrl}/olt/${oltId}`);
  }

  // Save new ONT
  save(ont: ONT): Observable<ONT> {
    return this.http.post<ONT>(`${this.apiUrl}/save`, ont);
  }

  // Update existing ONT
  update(id: number, ont: ONT): Observable<ONT> {
    return this.http.put<ONT>(`${this.apiUrl}/update/${id}`, ont);
  }

  // Delete ONT
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
