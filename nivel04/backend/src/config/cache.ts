import { RedisOptions } from 'ioredis';

interface ICacheConfig {
  driver: 'redis';
  config: {
    redis: RedisOptions;
  };
}

export default {
  driver: 'redis',

  config: {
    redis: {
      port: 6379,
      host: '127.0.0.1',
      password: undefined,
    },
  },
} as ICacheConfig;
