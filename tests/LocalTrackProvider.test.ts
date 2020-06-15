
import FileSystem from 'fs'
import Path from 'path'

import { MissingRequiredFieldError, FileNotFoundError } from '@utils/Errors'
import { removeDir } from '@utils/TestUtils'

import LocalTrackProvider from '@providers/LocalTrackProvider'

import Environment from '@environment'
import { getTrackProvider, LOCAL_TRACK_PROVIDER } from '@index'


it('should get the local track provider', () => {
  const Provider = getTrackProvider(LOCAL_TRACK_PROVIDER)
  expect(typeof Provider).toEqual(typeof LocalTrackProvider)
})

it('should return necessary fields for LocalTrackProvider', () => {
  const Provider = getTrackProvider(LOCAL_TRACK_PROVIDER)
  if (Provider) {
    const provider = new Provider('test', () => { return })
    const fields = provider.getFields()

    expect(fields.size).toEqual(3)
    expect(fields.get(LocalTrackProvider.TRACK_TITLE_KEY)).toBeDefined()
    expect(fields.get(LocalTrackProvider.ARTIST_NAME_KEY)).toBeDefined()
    expect(fields.get(LocalTrackProvider.FILE_PATH_KEY)).toBeDefined()
  }
})

it('should request fields to be valued', async () => {
  let missingFields: Array<string> = []
  const Provider = getTrackProvider(LOCAL_TRACK_PROVIDER)

  if (Provider) {
    const provider = new Provider('_', () => { return })
    const error = await provider.addTrack(new Map<string, string>())
    expect(error).toBeInstanceOf(MissingRequiredFieldError)

    if (error && error instanceof MissingRequiredFieldError) {
      missingFields = error.getMissingFields()
    }
  }

  expect(missingFields).toEqual([
    LocalTrackProvider.TRACK_TITLE_KEY,
    LocalTrackProvider.ARTIST_NAME_KEY,
    LocalTrackProvider.FILE_PATH_KEY
  ])
})

it('should not add local track nor call the onTrackAdded callback [source file does not exist]', async () => {
  const Provider = getTrackProvider(LOCAL_TRACK_PROVIDER)
  if (Provider) {
    const provider = new Provider('nonexistantDir', () => { return })

    const fields = new Map<string, string>()
    fields.set(LocalTrackProvider.TRACK_TITLE_KEY, '_')
    fields.set(LocalTrackProvider.ARTIST_NAME_KEY, '_')
    fields.set(LocalTrackProvider.FILE_PATH_KEY, Path.join(Environment.TEST_DATA, 'nonexistant.m4a'))

    const error = await provider.addTrack(fields)
    expect(error).toBeInstanceOf(FileNotFoundError)
    const fileError = error as FileNotFoundError
    expect(Path.basename(fileError.getFilename())).toEqual('nonexistant.m4a')
  }
})

it('should not add local track nor call the onTrackAdded callback [destination dir. does not exist]', async () => {
  const Provider = getTrackProvider(LOCAL_TRACK_PROVIDER)
  if (Provider) {
    const provider = new Provider('nonexistantDir', () => { return })

    const fields = new Map<string, string>()
    fields.set(LocalTrackProvider.TRACK_TITLE_KEY, '_')
    fields.set(LocalTrackProvider.ARTIST_NAME_KEY, '_')
    fields.set(LocalTrackProvider.FILE_PATH_KEY, Path.join(Environment.TEST_DATA, 'testFile.m4a'))

    const error = await provider.addTrack(fields)
    expect(error).toBeInstanceOf(FileNotFoundError)
    const fileError = error as FileNotFoundError
    expect(Path.basename(fileError.getFilename())).toEqual('nonexistantDir')
  }
})

it('should add local track', async () => {
  const expectedTitle = 'test title'
  const expectedArtistName = 'test artist'
  const expectedDuration = 171 // Moonrise track length
  const destinationDir = Path.join(Environment.TEST_ROOT, 'testDir')
  const testFile = 'testFile.m4a'

  removeDir(destinationDir)
  FileSystem.mkdirSync(destinationDir)

  const Provider = getTrackProvider(LOCAL_TRACK_PROVIDER)
  if (Provider) {
    const onTrackAdded = (title: string, artistName: string, duration: number): void => {
      expect(title).toEqual(expectedTitle)
      expect(artistName).toEqual(expectedArtistName)
      expect(duration).toEqual(expectedDuration)
    }
    const provider = new Provider(destinationDir, onTrackAdded)

    const fields = new Map<string, string>()
    fields.set(LocalTrackProvider.TRACK_TITLE_KEY, expectedTitle)
    fields.set(LocalTrackProvider.ARTIST_NAME_KEY, expectedArtistName)
    fields.set(LocalTrackProvider.FILE_PATH_KEY, Path.join(Environment.TEST_DATA, testFile))

    const error = await provider.addTrack(fields)
    expect(error).toBeNull()
    expect(FileSystem.existsSync(Path.join(destinationDir, testFile))).toBeTruthy()
  }

  removeDir(destinationDir)
})