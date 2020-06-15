
import NullTrackProvider from '@providers/NullTrackProvider'
import LocalTrackProvider from '@providers/LocalTrackProvider'

import { getTrackProviders } from '@index'


it('should get every providers', () => {
  const providers = getTrackProviders()
  expect(providers.size).toEqual(2)

  const iterator = providers.values()
  expect(typeof iterator.next().value).toEqual(typeof NullTrackProvider)
  expect(typeof iterator.next().value).toEqual(typeof LocalTrackProvider)
})

