import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// import { AuthResponse } from '../api/auth.types.js';
// import { LoginPayload } from '../factories/auth.factory.js';
import { RegisterPayload } from '../factories/auth.factory.js';

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const STORAGE_FILE = path.join(dirName, '../data/shared-user.json');

export class UserStorage {
  static saveUser(userData: any) {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(userData, null, 2));
  }

  static loadUser(): any {
    if (fs.existsSync(STORAGE_FILE)) {
      return JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf-8'));
    }
    return null;
  }
}
