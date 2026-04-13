import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const STORAGE_FILE = path.join(dirName, '../data/shared-product.json');

export class ProductStorage {
  static saveProduct(userData: any) {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(userData, null, 2));
  }

  static loadProduct(): any {
    if (fs.existsSync(STORAGE_FILE)) {
      return JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf-8'));
    }
    return null;
  }
}
