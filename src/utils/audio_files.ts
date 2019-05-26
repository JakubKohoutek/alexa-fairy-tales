import {promises as fs} from 'fs';

import shuffle from './shuffle_list';

export interface AudioFile {
  title: string;
  url: string;
}

const MEDIA_URL_BASE = process.env.MEDIA_URL_BASE || 'https://tunnel.myslenkynezastavis.cz/';

export default class AudioFiles {
  public static async load(): Promise<void> {
    const path = `${__dirname}/../../public_media`;
    const fileNames = await fs.readdir(path);
    const files = fileNames.reduce((acc: AudioFile[], fileName: string) => {
      if (fileName.endsWith('.mp3')) {
        return [
          ...acc,
          {
            title: fileName,
            url: `${MEDIA_URL_BASE}${fileName}`
          }
        ];
      }

      return acc;
    }, []);
    AudioFiles.list = files;
  }

  public static getList(): AudioFile[] {
    return AudioFiles.list;
  }

  public static getShuffledList(): AudioFile[] {
    return shuffle(AudioFiles.list);
  }

  private static list: AudioFile[] = [];
}
