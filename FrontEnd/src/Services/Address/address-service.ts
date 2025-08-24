import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Address } from '../../Core/Models/Address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly baseurl: string = `${environment.BASE_URL}/user/api/address`;

  constructor(private readonly http: HttpClient) { }

  address(lat: number, lng: number): Observable<Address> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lng', lng.toString());

    return this.http.post<Address>(this.baseurl + "/reverse-geo-code", null, { params });
  }

  save(address: Address): Observable<Address> {
    return this.http.post<Address>(this.baseurl + "/save", address);
  }
  
  findById(id: number): Observable<Address> {
    return this.http.get<Address>(`${this.baseurl}/${id}`);
  }
}
