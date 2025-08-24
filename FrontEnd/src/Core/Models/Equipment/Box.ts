import { Board } from './Board';
import { BoxType } from './BoxType';
import { ONT } from './ONT';
import { Status } from './Status';

export class Box {
  id!: number;
  type!: BoxType;
  name!: string;
  serialNumber!: string;
  status!: Status;
  addressId!: number;
  
  // Relationships
  board?: Board;
  previousBox?: Box | number;
  nextBox?: Box | number;
  onts?: ONT[];
  
  // Additional fields
  portCapacity!: number;
  ports!: number[];
  usedPorts!: number;
  
  // Helper methods
  isSubBox(): boolean {
    return this.type === BoxType.SUB_BOX;
  }
  
  isEndBox(): boolean {
    return this.type === BoxType.END_BOX;
  }
  
  getAvailablePorts(): number | null {
    if (this.portCapacity == null || this.usedPorts == null) {
      return null;
    }
    return this.portCapacity - this.usedPorts;
  }
  
  // Helper to get previousBox ID regardless of type
  getPreviousBoxId(): number | undefined {
    if (typeof this.previousBox === 'number') {
      return this.previousBox;
    } else if (this.previousBox && typeof this.previousBox === 'object') {
      return this.previousBox.id;
    }
    return undefined;
  }
  
  // Helper to get nextBox ID regardless of type
  getNextBoxId(): number | undefined {
    if (typeof this.nextBox === 'number') {
      return this.nextBox;
    } else if (this.nextBox && typeof this.nextBox === 'object') {
      return this.nextBox.id;
    }
    return undefined;
  }
}
