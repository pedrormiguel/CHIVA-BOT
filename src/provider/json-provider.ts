import { JsonFileDB as Database  } from  '@builderbot/database-json'

import { config } from 'dotenv';
config();
 
export type IDatabase = typeof Database