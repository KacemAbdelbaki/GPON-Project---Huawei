import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BoardService } from '../../../../Services/Equipment/Board/board-service';
import { Board } from '../../../../Core/Models/Equipment/Board';
import { Status } from '../../../../Core/Models/Equipment/Status';
import { OLT } from '../../../../Core/Models/Equipment/OLT';
import { Navbar } from '../../../shared/navbar/navbar';
import { CommonModule } from '@angular/common';
import { OLTService } from '../../../../Services/Equipment/OLT/olt-service';
import { Sidebar } from '../../../shared/sidebar/sidebar';

@Component({
  selector: 'app-create-board',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, Navbar, Sidebar],
  templateUrl: './create-board.html',
  styleUrl: './create-board.css',
  encapsulation: ViewEncapsulation.None
})
export class CreateBoard implements OnInit {
  board: Board = new Board();
  boardTypes: string[] = ['GPON', 'XGPON', 'XGSPON'];
  statuses: string[] = Object.values(Status).filter(value => typeof value === 'string');
  olts: OLT[] = [];
  isLoading: boolean = true;
  selectedOLT: OLT | null = null;
  availableSlots: number[] = [];
  
  boardForm: FormGroup = new FormGroup({
    boardType: new FormControl('', [Validators.required]),
    slotNumber: new FormControl({value: '', disabled: true}, [Validators.required, Validators.min(1)]),
    status: new FormControl('', [Validators.required]),
    maxPorts: new FormControl('', [Validators.required, Validators.min(1)]),
    oltId: new FormControl({value: '', disabled: true}, [Validators.required]),
  });

  constructor(
    private readonly boardService: BoardService,
    private readonly oltService: OLTService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.loadOLTs();
  }

  private loadOLTs(): void {
    this.isLoading = true;
    this.oltService.findAll().subscribe({
      next: (olts) => {
        this.olts = olts;
        console.log('OLTs loaded:', this.olts.length);
        this.boardForm.get('oltId')?.enable();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  onOLTSelected(): void {
    const oltId = this.boardForm.get('oltId')?.value;
    if (oltId) {
      this.selectedOLT = this.olts.find(olt => olt.id === +oltId) || null;
      
      if (this.selectedOLT) {
        // Get available slots
        this.availableSlots = this.getAvailableSlotsForOLT(this.selectedOLT);
        
        // Enable slot selection field
        this.boardForm.get('slotNumber')?.enable();
        
        // Reset the slot selection
        this.boardForm.get('slotNumber')?.setValue('');
      } else {
        this.availableSlots = [];
        this.boardForm.get('slotNumber')?.disable();
      }
    } else {
      this.selectedOLT = null;
      this.availableSlots = [];
      this.boardForm.get('slotNumber')?.disable();
    }
  }

  getAvailableSlotsForOLT(olt: OLT): number[] {
    const availableSlots: number[] = [];
    
    // If OLT doesn't have slotCapacity or boardSlots, return empty array
    if (!olt.slotCapacity || !olt.boardSlots) {
      return availableSlots;
    }
    
    // Check each slot to see if it's available
    for (let i = 0; i < olt.slotCapacity; i++) {
      // If slot has no board (null value), it's available
      if (!olt.boardSlots[i]) {
        // Add 1 to index because slots are 1-indexed in the UI
        availableSlots.push(i + 1);
      }
    }
    
    return availableSlots;
  }

  createBoard(): void {
    if (this.boardForm.invalid) {
      Object.keys(this.boardForm.controls).forEach(key => {
        this.boardForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.board.boardType = this.boardForm.get('boardType')?.value;
    this.board.slotNumber = this.boardForm.get('slotNumber')?.value;
    this.board.status = this.boardForm.get('status')?.value;
    this.board.maxPorts = this.boardForm.get('maxPorts')?.value;
    this.board.usedPorts = 0;
    this.board.availablePorts = this.board.maxPorts;
    this.board.olt = this.olts.filter(olt => olt.id === +this.boardForm.get('oltId')?.value)[0];

    this.boardService.save(this.board).subscribe({
      next: (savedBoard: Board) => {
        const olt = this.board.olt;
        if(olt.boards === undefined) 
          olt.boards = [savedBoard];
        else
          olt.boards.push(savedBoard);
        
        // Make sure boardSlots array is initialized
        if(olt.boardSlots === undefined || olt.boardSlots === null){
          olt.boardSlots = new Array(olt.slotCapacity).fill(null);
        }
        
        // Assign the board ID to the correct slot (subtract 1 because arrays are 0-indexed)
        olt.boardSlots[this.board.slotNumber - 1] = savedBoard.id;
        
        this.oltService.update(olt.id, olt).subscribe({
          next: () => {
            this.router.navigate(['/equipment/board/list']);
          },
          error: (error) => {
            console.error('Error updating OLT with new board:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error saving board:', error);
      }
    });
  }
      }
