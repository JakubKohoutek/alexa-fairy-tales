import {Skill} from 'ask-sdk-core';
import {ExpressAdapter} from 'ask-sdk-express-adapter';
import express, {Request, Response} from 'express';
import {Server} from 'http';
import {logger} from './utils/logger';
import {normalizationStatus} from './utils/normalize_audio';

const PORT = process.env.PORT || 3000;

export const createServer = (skill: Skill): Server => {
  const app = express();

  app.use(express.static('public_media'));

  const adapter = new ExpressAdapter(skill, true, true);
  app.post('/', ...adapter.getRequestHandlers());

  app.get(
    '/',
    async (_req: Request, res: Response): Promise<Response> => {
      if (normalizationStatus.total > 0) {
        const msg = 'Skill handler is starting up. Normalizing audio files: ' +
          `${normalizationStatus.completed}/${normalizationStatus.total} ` +
          `(current: ${normalizationStatus.current})`;

        return res.send(msg);
      }

      return res.send('Skill handler is up and running.');
    }
  );

  return app.listen(
    PORT,
    (): void => {
      logger.info(`Skill handler is listening on port ${PORT}!`);
    }
  );
};
