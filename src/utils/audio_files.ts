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
    try {
      fs.access(path);
    } catch (error) {
      throw new Error(
        `The directory "public_media" doesn't exist at the project's root level,\n` +
        `Please create this directory and include audio files in it before starting\n` +
        `the handler`
      );
    }

    const fileNames = await fs.readdir(path);
    if (fileNames.length === 0) {
      throw new Error(`There are no files in "public_media" directory, please add them.`);
    }

    const files = fileNames.reduce((acc: AudioFile[], fileName: string) => {
      if (fileName.endsWith('.mp3')) {
        return [
          ...acc,
          {
            title: fileName.split('.mp3')[0],
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
