
import ITrackProvider, { StringField } from '@providers/ITrackProvider'


export default class NullTrackProvider implements ITrackProvider {

  private fields: Map<string, StringField>

  constructor() {
    this.fields = new Map<string, StringField>()
  }

  onTrackAdded(): void {
    // NOT IMPLEMENTED
  }

  getFields(): Map<string, StringField> {
    return this.fields
  }

  async addTrack(): Promise<Error | null> {
    return null
  }
}