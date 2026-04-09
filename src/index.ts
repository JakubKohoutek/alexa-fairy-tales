import {createServer} from './server';
import {skill} from './skill_builder';
import AudioFiles from './utils/audio_files';

(async () => {
  try {
    await AudioFiles.load();
    const server = createServer(skill);

    const shutdown = () => {
      console.info('Shutting down gracefully...');
      server.close(() => {
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
