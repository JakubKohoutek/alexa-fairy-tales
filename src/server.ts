import bodyParser from 'body-parser';
import express, {Request, Response} from 'express';
import {Server} from 'http';

import {CustomSkill} from 'ask-sdk-core/dist/skill/CustomSkill';

const PORT = process.env.PORT || 3000;

export const createServer = (skill: CustomSkill): Server => {
  const app = express();

  app.use(bodyParser.json());

  app.use(express.static('public_media'));

  app.post(
    '/',
    async (req: Request, res: Response): Promise<Response> => {
      const response = await skill.invoke(req.body);

      return res.send(response);
    }
  );

  app.get(
    '/',
    async (req: Request, res: Response): Promise<Response> =>
      res.send('Skill handler is up and running.')
  );

  return app.listen(
    PORT,
    (): void => {
      console.info(`Skill handler is listening on port ${PORT}!`);
    }
  );
};
