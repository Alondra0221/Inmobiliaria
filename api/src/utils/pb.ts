const PocketBase = require('pocketbase/cjs')
import dotenv from 'dotenv';

dotenv.config();

const pb = new PocketBase(process.env.POCKETBASE_URL);

export default pb;
