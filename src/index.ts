import {createServer} from './server';
import {skill} from './skill_builder';
import AudioFiles from './utils/audio_files';
import {logger} from './utils/logger';

(async () => {
  try {
    await AudioFiles.load({skipNormalization: true});
    const server = createServer(skill);

    AudioFiles.load().catch((error) => {
      logger.error('Background audio normalization failed:', error);
    });

    const shutdown = () => {
      logger.info('Shutting down gracefully...');
      server.close(() => {
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
})();
