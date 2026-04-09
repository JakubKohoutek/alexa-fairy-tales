import {RequestEnvelope} from 'ask-sdk-model';
import MemoryPersistenceAdapter from './persistence_adapter';

const makeEnvelope = (userId: string): RequestEnvelope => ({
  context: {
    System: {
      user: {userId}
    } as any
  }
} as RequestEnvelope);

describe('MemoryPersistenceAdapter', () => {
  let adapter: MemoryPersistenceAdapter;

  beforeEach(() => {
    adapter = new MemoryPersistenceAdapter();
  });

  it('should return empty object for unknown user', async () => {
    const result = await adapter.getAttributes(makeEnvelope('user1'));

    expect(result).toEqual({});
  });

  it('should save and retrieve attributes for a user', async () => {
    const envelope = makeEnvelope('user1');
    const attrs = {currentIndex: 2, offset: 1000};

    await adapter.saveAttributes(envelope, attrs);
    const result = await adapter.getAttributes(envelope);

    expect(result).toEqual(attrs);
  });

  it('should isolate data between users', async () => {
    await adapter.saveAttributes(makeEnvelope('user1'), {track: 'a'});
    await adapter.saveAttributes(makeEnvelope('user2'), {track: 'b'});

    expect(await adapter.getAttributes(makeEnvelope('user1'))).toEqual({track: 'a'});
    expect(await adapter.getAttributes(makeEnvelope('user2'))).toEqual({track: 'b'});
  });

  it('should delete only the specified user data', async () => {
    await adapter.saveAttributes(makeEnvelope('user1'), {track: 'a'});
    await adapter.saveAttributes(makeEnvelope('user2'), {track: 'b'});

    await adapter.deleteAttributes!(makeEnvelope('user1'));

    expect(await adapter.getAttributes(makeEnvelope('user1'))).toEqual({});
    expect(await adapter.getAttributes(makeEnvelope('user2'))).toEqual({track: 'b'});
  });
});
