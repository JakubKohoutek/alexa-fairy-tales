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
    app = createServer({} as any);

    const result = await request(app).get('/');

    expect(result.status).toEqual(200);
    expect(result.text).toEqual('Skill handler is up and running.');
  });
});
