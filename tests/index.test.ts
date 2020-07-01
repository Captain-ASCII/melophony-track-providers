
import LocalTrackProvider from '@providers/LocalTrackProvider'

import { TrackProviderFactory, LOCAL_TRACK_PROVIDER } from '@index'


it('should get every providers', () => {
  const factory = new TrackProviderFactory()
  const providers = factory.getAvailableTrackProviders()
  expect(providers.length).toEqual(2)

  expect(providers[1]).toEqual(LOCAL_TRACK_PROVIDER)

  expect(factory.getTrackProvider(providers[1], '', () => { return })).toBeInstanceOf(LocalTrackProvider)
})

