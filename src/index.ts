import {createServer} from './server';
import {skill} from './skill_builder';
import AudioFiles from './utils/audio_files';

(async () => {
  try {
    await AudioFiles.load();
    createServer(skill);
  } catch (error) {
    console.error(error);
  }
})();
