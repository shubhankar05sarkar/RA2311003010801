import { Log } from './index.js';

const result = await Log('frontend', 'info', 'middleware', 'Logging middleware initialized and verified');
console.log('Test log response:', result);
