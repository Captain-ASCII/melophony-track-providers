
import FileSystem from 'fs'
import Path from 'path'

import { MissingRequiredFieldError, FileNotFoundError } from '../utils/Errors'
import { getMp4FileDuration } from '../utils/Mp4Utils'

import ITrackProvider, { StringField, OnTrackAddedCallback } from './ITrackProvider'


export default class LocalTrackProvider implements ITrackProvider {

  public static TRACK_TITLE_KEY = 'trackTitle'
  public static ARTIST_NAME_KEY = 'artistName'
  public static FILE_PATH_KEY = 'filePath'

  private tracksDir: string
  private fields: Map<string, StringField>
  private callback: OnTrackAddedCallback

  constructor(tracksDir: string, callback: OnTrackAddedCallback) {
    this.tracksDir = tracksDir
    this.callback = callback
    this.fields = this.defineFields()
  }

  defineFields(): Map<string, StringField> {
    const fields = new Map<string, StringField>()

    fields.set(LocalTrackProvider.TRACK_TITLE_KEY, new StringField('title', 'The track title'))
    fields.set(LocalTrackProvider.ARTIST_NAME_KEY, new StringField('Artist\'s name', 'The artist name'))
    fields.set(LocalTrackProvider.FILE_PATH_KEY, new StringField('Local file path (absolute)', '/home/melophonyUser/...'))

    return fields
  }

  getFields(): Map<string, StringField> {
    return this.fields
  }

  async addTrack(fields: Map<string, string>): Promise<Error | null> {
    const trackTitle = fields.get(LocalTrackProvider.TRACK_TITLE_KEY)
    const artistName = fields.get(LocalTrackProvider.ARTIST_NAME_KEY)
    const fileToAdd = fields.get(LocalTrackProvider.FILE_PATH_KEY)

    if (trackTitle && artistName && fileToAdd) {
      if (FileSystem.existsSync(fileToAdd)) {
        if (FileSystem.existsSync(this.tracksDir)) {
          FileSystem.copyFileSync(fileToAdd, Path.join(this.tracksDir, Path.basename(fileToAdd)))
          this.callback(trackTitle, artistName, await getMp4FileDuration(fileToAdd))
          return null
        }
        return new FileNotFoundError('Destination directory: {0} does not exist', this.tracksDir)
      }
      return new FileNotFoundError('Source file: {0} does not exist', fileToAdd)
    }
    return new MissingRequiredFieldError('Missing:', [ ...this.fields.keys() ])
  }
}