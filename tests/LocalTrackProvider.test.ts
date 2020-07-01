
import FileSystem from 'fs'
import Path from 'path'

import { MissingRequiredFieldError, FileNotFoundError } from '@utils/Errors'
import { removeDir } from '@utils/TestUtils'

import LocalTrackProvider from '@providers/LocalTrackProvider'

import Environment from '@environment'
import { TrackProviderFactory, LOCAL_TRACK_PROVIDER, ITrackProvider, OnTrackAddedCallback } from '@index'


function getLocalTrackProvider(filesDir = '', callback: OnTrackAddedCallback = (): void => { return }): ITrackProvider {
  const factory = new TrackProviderFactory()
  const provider = factory.getTrackProvider(LOCAL_TRACK_PROVIDER, filesDir, callback)

  if (provider) {
    return provider
  }

  throw new Error(`Factory cannot produce ${LOCAL_TRACK_PROVIDER}`)
}


it('should get the local track provider', () => {
  expect(getLocalTrackProvider()).toBeInstanceOf(LocalTrackProvider)
})

it('should return necessary fields for LocalTrackProvider', () => {
  const provider = getLocalTrackProvider()
  const fields = provider.getFields()

  expect(fields.size).toEqual(3)
  expect(fields.get(LocalTrackProvider.TRACK_TITLE_KEY)).toBeDefined()
  expect(fields.get(LocalTrackProvider.ARTIST_NAME_KEY)).toBeDefined()
  expect(fields.get(LocalTrackProvider.FILE_PATH_KEY)).toBeDefined()
})

it('should request fields to be valued', async () => {
  let missingFields: Array<string> = []
  const provider = getLocalTrackProvider()

  const error = await provider.addTrack(new Map<string, string>())
  expect(error).toBeInstanceOf(MissingRequiredFieldError)

  if (error && error instanceof MissingRequiredFieldError) {
    missingFields = error.getMissingFields()
  }

  expect(missingFields).toEqual([
    LocalTrackProvider.TRACK_TITLE_KEY,
    LocalTrackProvider.ARTIST_NAME_KEY,
    LocalTrackProvider.FILE_PATH_KEY
  ])
})

it('should not add local track nor call the onTrackAdded callback [source file does not exist]', async () => {
  const provider = getLocalTrackProvider()

  const fields = new Map<string, string>()
  fields.set(LocalTrackProvider.TRACK_TITLE_KEY, '_')
  fields.set(LocalTrackProvider.ARTIST_NAME_KEY, '_')
  fields.set(LocalTrackProvider.FILE_PATH_KEY, Path.join(Environment.TEST_DATA, 'nonexistant.m4a'))

  const error = await provider.addTrack(fields)
  expect(error).toBeInstanceOf(FileNotFoundError)
  const fileError = error as FileNotFoundError
  expect(Path.basename(fileError.getFilename())).toEqual('nonexistant.m4a')
})

it('should not add local track nor call the onTrackAdded callback [destination dir. does not exist]', async () => {
  const provider = getLocalTrackProvider('nonexistantDir')

  const fields = new Map<string, string>()
  fields.set(LocalTrackProvider.TRACK_TITLE_KEY, '_')
  fields.set(LocalTrackProvider.ARTIST_NAME_KEY, '_')
  fields.set(LocalTrackProvider.FILE_PATH_KEY, Path.join(Environment.TEST_DATA, 'testFile.m4a'))

  const error = await provider.addTrack(fields)
  expect(error).toBeInstanceOf(FileNotFoundError)
  const fileError = error as FileNotFoundError
  expect(Path.basename(fileError.getFilename())).toEqual('nonexistantDir')
})

it('should add local track', async () => {
  const expectedTitle = 'test title'
  const expectedArtistName = 'test artist'
  const expectedDuration = 171 // Moonrise track length
  const destinationDir = Path.join(Environment.TEST_ROOT, 'testDir')
  const testFile = 'testFile.m4a'

  removeDir(destinationDir)
  FileSystem.mkdirSync(destinationDir)

  const onTrackAdded = (title: string, artistName: string, duration: number): void => {
    expect(title).toEqual(expectedTitle)
    expect(artistName).toEqual(expectedArtistName)
    expect(duration).toEqual(expectedDuration)
  }
  const provider = getLocalTrackProvider(destinationDir, onTrackAdded)

  const fields = new Map<string, string>()
  fields.set(LocalTrackProvider.TRACK_TITLE_KEY, expectedTitle)
  fields.set(LocalTrackProvider.ARTIST_NAME_KEY, expectedArtistName)
  fields.set(LocalTrackProvider.FILE_PATH_KEY, Path.join(Environment.TEST_DATA, testFile))

  const error = await provider.addTrack(fields)
  expect(error).toBeNull()
  expect(FileSystem.existsSync(Path.join(destinationDir, testFile))).toBeTruthy()

  removeDir(destinationDir)
})