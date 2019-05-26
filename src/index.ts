import {createServer} from './server';
import {skill} from './skill_builder';
import AudioFiles from './utils/audio_files';

(async () => {
  await AudioFiles.load();
  await createServer(skill);
})();
