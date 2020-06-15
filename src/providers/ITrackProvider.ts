
export class StringField {
  private name: string
  private placeholder: string

  constructor(name: string, placeholder: string) {
    this.name = name
    this.placeholder = placeholder
  }

  getName(): string {
    return this.name
  }

  getPlaceholder(): string {
    return this.placeholder
  }
}


export interface OnTrackAddedCallback { (title: string, artistName: string, duration: number): void }


export default interface ITrackProvider {
  getFields(): Map<string, StringField>;
  addTrack(trackInformation: Map<string, string>): Promise<Error | null>;
}
