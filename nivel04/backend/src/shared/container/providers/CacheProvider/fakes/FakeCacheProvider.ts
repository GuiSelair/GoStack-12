import ICacheProvider from '../models/ICacheProvider';

interface ICacheData {
  [key: string]: string;
}

class FakeCacheProvider implements ICacheProvider {
  private client: ICacheData = {};

  public async save(key: string, value: any): Promise<void> {
    this.client[key] = value;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.client[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.client).filter(key =>
      key.startsWith(`${prefix}:`),
    );

    keys.forEach(key => {
      delete this.client[key];
    });
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.client[key];

    if (!data) return null;

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }
}

export default FakeCacheProvider;
