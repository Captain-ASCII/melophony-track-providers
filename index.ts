
import ITrackProvider, { OnTrackAddedCallback } from '@providers/ITrackProvider'

import NullTrackProvider from '@providers/NullTrackProvider'


export type TrackProviderType = typeof NullTrackProvider

const NULL_TRACK_PROVIDER = 'NullTrackProvider'

const _TRACK_PROVIDERS = new Map<string, TrackProviderType>()

_TRACK_PROVIDERS.set(NULL_TRACK_PROVIDER, NullTrackProvider)


function getTrackProviders(): Map<string, TrackProviderType> {
  return _TRACK_PROVIDERS
}

function getTrackProvider(providerName: string): TrackProviderType | undefined {
  return _TRACK_PROVIDERS.get(providerName)
}


export { NULL_TRACK_PROVIDER, getTrackProviders, getTrackProvider, ITrackProvider, OnTrackAddedCallback }