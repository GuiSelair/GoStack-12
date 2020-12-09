import { container } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import RedisCacheProvider from './implementations/RedisCacheProvider';

const cacheProviders = {
  redis: container.resolve(RedisCacheProvider),
};

container.registerInstance<ICacheProvider>(
  'CacheProvider',
  cacheProviders.redis,
);
