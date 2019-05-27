import bodyParser from 'body-parser';
import express, {Request, Response} from 'express';

import {CustomSkill} from 'ask-sdk-core/dist/skill/CustomSkill';

const PORT = process.env.PORT || 3000;

export const createServer = (skill: CustomSkill): void => {
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

  app.listen(
    PORT,
    (): void => {
      console.info('Skill handler is listening on port 3000!');
    }
  );
};
