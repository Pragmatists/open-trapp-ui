export class Preset {

  constructor(readonly tags: string[]) {
  }

  toString() {
    return this.tags.map(t => `#${t}`).join(', ');
  }
}
