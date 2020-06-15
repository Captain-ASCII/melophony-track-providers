
import ITrackProvider, { OnTrackAddedCallback } from '@providers/ITrackProvider'

import NullTrackProvider from '@providers/NullTrackProvider'
import LocalTrackProvider from '@providers/LocalTrackProvider'


export type TrackProviderType = typeof NullTrackProvider | typeof LocalTrackProvider

const NULL_TRACK_PROVIDER = 'NullTrackProvider'
const LOCAL_TRACK_PROVIDER = 'LocalTrackProvider'

const _TRACK_PROVIDERS = new Map<string, TrackProviderType>()

_TRACK_PROVIDERS.set(NULL_TRACK_PROVIDER, NullTrackProvider)
_TRACK_PROVIDERS.set(LOCAL_TRACK_PROVIDER, LocalTrackProvider)


function getTrackProviders(): Map<string, TrackProviderType> {
  return _TRACK_PROVIDERS
}

function getTrackProvider(providerName: string): TrackProviderType | undefined {
  return _TRACK_PROVIDERS.get(providerName)
}


export { NULL_TRACK_PROVIDER, LOCAL_TRACK_PROVIDER, getTrackProviders, getTrackProvider, ITrackProvider, OnTrackAddedCallback }