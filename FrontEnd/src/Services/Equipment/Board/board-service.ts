import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Board } from '../../../Core/Models/Equipment/Board';
import { Status } from '../../../Core/Models/Equipment/Status';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private apiUrl = `${environment.BASE_URL}/equipment/api/board`;

  constructor(private http: HttpClient) { }

  // Get all boards
  findAll(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.apiUrl}/all`);
  }

  // Get board by ID
  findById(id: number): Observable<Board> {
    return this.http.get<Board>(`${this.apiUrl}/${id}`);
  }

  // Get boards by status
  findByStatus(status: Status): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.apiUrl}/status/${status}`);
  }

  // Get boards by OLT ID
  findByOltId(oltId: number): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.apiUrl}/olt/${oltId}`);
  }

  // Get board by OLT ID and slot number
  findByOltIdAndSlotNumber(oltId: number, slotNumber: number): Observable<Board> {
    return this.http.get<Board>(`${this.apiUrl}/olt/${oltId}/slot/${slotNumber}`);
  }

  // Get board by address ID
  findByAddressId(addressId: number): Observable<Board> {
    return this.http.get<Board>(`${this.apiUrl}/address/${addressId}`);
  }

  // Save new board
  save(board: Board): Observable<Board> {
    return this.http.post<Board>(`${this.apiUrl}/save`, board);
  }

  // Update existing board
  update(id: number, board: Board): Observable<Board> {
    return this.http.put<Board>(`${this.apiUrl}/update/${id}`, board);
  }

  // Delete board
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
