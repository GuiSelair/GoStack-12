import IStorageProvider from '../models/IStorageProvider';

class FakeStorageProvider implements IStorageProvider {
  private avatarList: string[] = [];

  public async saveFile(file: string): Promise<string> {
    this.avatarList.push(file);
    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    const avatarIndex = this.avatarList.findIndex(avatar => avatar === file);

    this.avatarList.splice(avatarIndex, 1);
  }
}

export default FakeStorageProvider;
