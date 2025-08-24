import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { OLT } from '../../../Core/Models/Equipment/OLT';
import { Status } from '../../../Core/Models/Equipment/Status';

@Injectable({
  providedIn: 'root'
})
export class OLTService {
  private apiUrl = `${environment.BASE_URL}/equipment/api/olt`;

  constructor(private http: HttpClient) { }

  // Get all OLTs
  findAll(): Observable<OLT[]> {
    return this.http.get<OLT[]>(`${this.apiUrl}/all`);
  }

  // Get OLT by ID
  findById(id: number): Observable<OLT> {
    return this.http.get<OLT>(`${this.apiUrl}/${id}`);
  }

  // Get OLTs by status
  findByStatus(status: Status): Observable<OLT[]> {
    return this.http.get<OLT[]>(`${this.apiUrl}/status/${status}`);
  }

  // Get OLT by address ID
  findByAddressId(addressId: number): Observable<OLT> {
    return this.http.get<OLT>(`${this.apiUrl}/address/${addressId}`);
  }

  // Save new OLT
  save(olt: OLT): Observable<OLT> {
    return this.http.post<OLT>(`${this.apiUrl}/save`, olt);
  }

  // Update existing OLT
  update(id: number, olt: OLT): Observable<OLT> {
    return this.http.put<OLT>(`${this.apiUrl}/update/${id}`, olt);
  }

  // Delete OLT
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
