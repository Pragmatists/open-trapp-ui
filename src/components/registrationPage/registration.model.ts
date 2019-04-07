import {v4 as uuid} from 'uuid';


export class Preset {

  constructor(readonly tags: string[], readonly id: string = uuid()) {
  }

  serialize() {
    return {
      id: this.id,
      tags: this.tags
    }
  }
}
