import * as Crypto from 'expo-crypto';

export default async function sha256 (data: string): Promise<string> {
  const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, data);
  return digest;
};
