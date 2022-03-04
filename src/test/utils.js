import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config({ path: './.env.test' });


const {
  BASE_URL = 'http://localhost:3000',
  ADMIN_USER: adminUser = '',
  ADMIN_PASS: adminPass = '',
} = process.env;

export const baseUrl = BASE_URL;

export async function callUrl(path, method = null, body = null){
  const url = new URL(path, baseUrl);

  if (method === null) {
    console.log("get");
    const response = await fetch(url);
    return {
      result: await response.json(),
      status: response.status,
    }
  }

  const result = await fetch(url, {
    method,
    body
  })
  return {
    result: await result.json(),
    status: result.status,
  }



}
