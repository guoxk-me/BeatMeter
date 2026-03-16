import * as FileSystem from 'expo-file-system/legacy';
import { DocumentPickerAsset } from 'expo-document-picker';

const CUSTOM_SOUND_DIR = `${FileSystem.documentDirectory}custom-sounds/`;

export interface ImportedCustomSound {
  uri: string;
  name: string;
}

export async function persistCustomWav(asset: DocumentPickerAsset): Promise<ImportedCustomSound> {
  const originalName = asset.name?.trim() || 'custom-sound.wav';
  const normalizedName = normalizeWavFileName(originalName);
  const destinationUri = `${CUSTOM_SOUND_DIR}${Date.now()}-${normalizedName}`;

  await ensureCustomSoundDirectory();
  await FileSystem.copyAsync({ from: asset.uri, to: destinationUri });

  return {
    uri: destinationUri,
    name: normalizedName,
  };
}

export function isLikelyWavFile(asset: Pick<DocumentPickerAsset, 'name' | 'mimeType' | 'uri'>) {
  const lowerName = asset.name?.toLowerCase() ?? '';
  const lowerUri = asset.uri.toLowerCase();
  const mimeType = asset.mimeType?.toLowerCase() ?? '';

  return lowerName.endsWith('.wav')
    || lowerUri.endsWith('.wav')
    || mimeType === 'audio/wav'
    || mimeType === 'audio/x-wav'
    || mimeType === 'audio/wave';
}

export async function ensureCustomSoundDirectory() {
  if (!CUSTOM_SOUND_DIR) {
    throw new Error('应用存储目录不可用');
  }

  const info = await FileSystem.getInfoAsync(CUSTOM_SOUND_DIR);

  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(CUSTOM_SOUND_DIR, { intermediates: true });
  }
}

function normalizeWavFileName(value: string) {
  const safe = value.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');

  return safe.toLowerCase().endsWith('.wav') ? safe : `${safe}.wav`;
}
