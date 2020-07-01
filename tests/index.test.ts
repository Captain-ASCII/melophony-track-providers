
import LocalTrackProvider from '@providers/LocalTrackProvider'

import { TrackProviderFactory, LOCAL_TRACK_PROVIDER } from '@index'


it('should get every providers', () => {
  const factory = new TrackProviderFactory()
  const providers = factory.getAvailableTrackProviders()
  expect(providers.length).toEqual(1)

  expect(providers[0]).toEqual(LOCAL_TRACK_PROVIDER)

  expect(factory.getTrackProvider(providers[0], '', () => { return })).toBeInstanceOf(LocalTrackProvider)
})

