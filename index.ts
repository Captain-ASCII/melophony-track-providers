
import ITrackProvider, { OnTrackAddedCallback, StringField } from '@providers/ITrackProvider'

import NullTrackProvider from '@providers/NullTrackProvider'
import LocalTrackProvider from '@providers/LocalTrackProvider'

const NULL_TRACK_PROVIDER = 'NullTrackProvider'
const LOCAL_TRACK_PROVIDER = 'LocalTrackProvider'

class TrackProviderFactory {

  getAvailableTrackProviders(): Array<string> {
    return [ NULL_TRACK_PROVIDER, LOCAL_TRACK_PROVIDER ]
  }

  getTrackProvider(providerName: string, filesDir: string, callback: OnTrackAddedCallback): ITrackProvider | null {
    switch (providerName) {
      case NULL_TRACK_PROVIDER: {
        return new NullTrackProvider()
      }
      case LOCAL_TRACK_PROVIDER: {
        return new LocalTrackProvider(filesDir, callback)
      }

      default: {
        return null
      }
    }
  }
}

export { LOCAL_TRACK_PROVIDER, TrackProviderFactory, ITrackProvider, OnTrackAddedCallback, StringField }