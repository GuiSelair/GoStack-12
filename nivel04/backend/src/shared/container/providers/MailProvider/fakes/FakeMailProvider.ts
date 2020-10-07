import IMailProvider from '../models/IMailProvider';

interface IMessages {
  to: string;
  body: string;
}

class FakeMailProvider implements IMailProvider {
  private messages: IMessages[] = [];

  public async sendMail(to: string, body: string): Promise<void> {
    this.messages.push({
      to,
      body,
    });
  }
}

export default FakeMailProvider;
