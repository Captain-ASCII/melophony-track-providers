
import ITrackProvider, { OnTrackAddedCallback, StringField } from '@providers/ITrackProvider'

import LocalTrackProvider from '@providers/LocalTrackProvider'

const LOCAL_TRACK_PROVIDER = 'LocalTrackProvider'

class TrackProviderFactory {

  getAvailableTrackProviders(): Array<string> {
    return [ LOCAL_TRACK_PROVIDER ]
  }

  getTrackProvider(providerName: string, filesDir: string, callback: OnTrackAddedCallback): ITrackProvider | null {
    switch (providerName) {
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