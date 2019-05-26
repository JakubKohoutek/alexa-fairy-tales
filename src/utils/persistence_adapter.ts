import {PersistenceAdapter} from 'ask-sdk';
import {RequestEnvelope} from 'ask-sdk-model';

interface UserData {
  [key: string]: any;
}

interface AdapterData {
  [key: string]: UserData;
}

export default class MemoryPersistenceAdapter implements PersistenceAdapter {
  private data: AdapterData = {};

  constructor() {
    console.info('Initializing in memory persistence adapter.');
  }

  public async getAttributes(requestEnvelope: RequestEnvelope): Promise<UserData> {
    const {userId} = requestEnvelope.context.System.user;

    return this.data[userId] || {};
  }

  public async saveAttributes(
    requestEnvelope: RequestEnvelope,
    attributes: UserData
  ): Promise<void> {
    const {userId} = requestEnvelope.context.System.user;
    this.data[userId] = attributes;
  }

  public async deleteAttributes?(requestEnvelope: RequestEnvelope): Promise<void> {
    this.data = {};
  }
}
