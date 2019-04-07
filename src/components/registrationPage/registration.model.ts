import {v4 as uuid} from 'uuid';


export class Preset {
  readonly id: string;

  constructor(readonly tags: string[]) {
    this.id = uuid();
  }
}
