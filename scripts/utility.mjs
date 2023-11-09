import * as findup from 'find-up';
import dotenv from 'dotenv';

/**
 * Loads environment variables from .env and .env.defaults
 */
export const loadEnvironmentVariables = () => {
  console.log("Load Environment Variables");
  
  const env = findup.findUpSync(process.env.ENV_FILE || '.env');

  if (env) dotenv.config({ path: env });

  const defaults = findup.findUpSync('.env.defaults', { type: 'file' });

  if (defaults) dotenv.config({ path: defaults });

};

/**
 * Causes a delay.
 * @param {*} t 
 * @param {*} callback 
 * @returns 
 */
export const delay = (t, callback) => {
  return new Promise(resolve => setTimeout(() => {
    callback();
    resolve();
  }, t));
}