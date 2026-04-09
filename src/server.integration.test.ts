import {Skill} from 'ask-sdk-core';
import {Server} from 'http';
import request from 'supertest';

import {createServer} from './server';

describe('Server', () => {
  let app: Server | undefined;

  afterEach(() => {
    if (app) {
      app.close();
    }
  });

  it('should respond with skill status on get request', async () => {
    const mockSkill = {
      appendAdditionalUserAgent: jest.fn(),
      invoke: jest.fn()
    } as unknown as Skill;
    app = createServer(mockSkill);

    const result = await request(app).get('/');

    expect(result.status).toEqual(200);
    expect(result.text).toEqual('Skill handler is up and running.');
  });
});
