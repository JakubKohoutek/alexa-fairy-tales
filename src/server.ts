import {Skill} from 'ask-sdk-core';
import {logger} from './utils/logger';
import {ExpressAdapter} from 'ask-sdk-express-adapter';
import express, {Request, Response} from 'express';
import {Server} from 'http';

const PORT = process.env.PORT || 3000;

export const createServer = (skill: Skill): Server => {
  const app = express();

  app.use(express.static('public_media'));

  const adapter = new ExpressAdapter(skill, true, true);
  app.post('/', ...adapter.getRequestHandlers());

  app.get(
    '/',
    async (_req: Request, res: Response): Promise<Response> =>
      res.send('Skill handler is up and running.')
  );

  return app.listen(
    PORT,
    (): void => {
      logger.info(`Skill handler is listening on port ${PORT}!`);
    }
  );
};
