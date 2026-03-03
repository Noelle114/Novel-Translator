import keytar from 'keytar'
import { APP_SERVICE_NAME, type SavedCredentialRef } from '@mtn/shared'

export class CredentialService {
  async set(ref: SavedCredentialRef, key: string): Promise<void> {
    await keytar.setPassword(APP_SERVICE_NAME, ref.keychainAccount, key)
  }

  async get(ref: SavedCredentialRef): Promise<string | null> {
    return keytar.getPassword(APP_SERVICE_NAME, ref.keychainAccount)
  }

  async delete(account: string): Promise<void> {
    await keytar.deletePassword(APP_SERVICE_NAME, account)
  }
}

