import * as querystring from 'querystring';
import { VkStartParams } from './VkStartParams';
import * as crypto from 'crypto';
export { VkStartParams } from './VkStartParams';

/**
 * @param {String} url
 * @return {Object}
 */
export function convertUrlToParams(url: string): URLSearchParams {
  if (!url) {return new URLSearchParams();}
  url = url.trim();
  if (url.startsWith('https://') || url.startsWith('http://')) {
    url = new URL(url).search.substr(1);
  } else {
    if (url.startsWith('/')) {
      url = url.substr(1);
    }
    if (url.startsWith('?')) {
      url = url.substr(1);
    }
  }
  return new URLSearchParams(url);
}

export function uspToObject(u: URLSearchParams) {
  const out: {[key: string]: string|null} = {};
  for (const key of u.keys()) {
    out[key] = u.get(key);
  }
  return out;
}

/**
 * @param {Object} parsedParams
 * @param secret
 * @return {boolean}
 */
export function checkVkMiniAppsSignArgs(parsedParams: URLSearchParams, secret: string): boolean {
  return calcVkMiniAppsSignArgs(parsedParams, secret) === parsedParams.get('sign');
}

/**
 * @param {Object} parsedParams
 * @param secret
 * @return {String}
 */
export function calcVkMiniAppsSignArgsBuffer(parsedParams: URLSearchParams, secret: string) {
  const signParamsKeys: string[] = [];
  for (const key of parsedParams.keys()) {
    if (key.startsWith('vk_') && parsedParams.get(key) !== undefined) {
      signParamsKeys.push(key);
    }
  }

  let stringForSign = signParamsKeys.sort((a, b)=>a.localeCompare(b)).map((key) => querystring.stringify({ [key]: parsedParams.get(key) })).join('&');

  const hmac = crypto.createHmac('sha256', secret);
  hmac.write(stringForSign);
  hmac.end();
  const data = hmac.read();
  if (data instanceof Buffer) {
    return data;
  } else {
    throw new Error('hmac.read() return no buffer value');
  }
}

/**
 * @param {Object} parsedParams
 * @param secret
 * @return {String}
 */
export function calcVkMiniAppsSignArgs(parsedParams: URLSearchParams, secret: string) {
  return bufferToBase64UrlSafe(calcVkMiniAppsSignArgsBuffer(parsedParams, secret));
}

export function bufferToBase64UrlSafe(data: Buffer) {
  return data.toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * @param {String} url
 * @param {String} secret
 * @return {boolean}
 */
export function checkVkMiniAppsSignUrl(url: string, secret: string) {
  return checkVkMiniAppsSignArgs(convertUrlToParams(url), secret);
}

/**
 * Проверяет параметры запуска, если подпись не сошлась, возвращает null
 * @param {String} url
 * @param {String} secret
 * @return {null|VkStartParams}
 */
export function getStartParamsFromUrl(url: string, secret: string) {
  const params = convertUrlToParams(url);
  if (checkVkMiniAppsSignArgs(params, secret)) {
    return new VkStartParams(params);
  } else {
    return null;
  }
}

/**
 * @param {String} url
 * @return {VkStartParams}
 */
export function createStartParamsFromUrl(url: string): VkStartParams {
  return new VkStartParams(convertUrlToParams(url));
}

/**
 * @param {Object} data
 * @return {VkStartParams}
 */
export function createStartParamsFromObject(data: URLSearchParams) {
  return new VkStartParams(data);
}

/**
 * @param {Number} userId
 * @param {Number} groupId
 * @param {Number} groupRole
 * @return {VkStartParams}
 */
export function createFakeUser(userId: number, groupId?: number, groupRole = 'none') {
  const data: Record<string, string> = {
    vk_user_id: userId.toString(),
    vk_app_id: '10',
    vk_is_app_user: '0',
    vk_are_notifications_enabled: '0',
    vk_language: 'ru',
    vk_ref: 'other',
    vk_access_token_settings: '',
    vk_viewer_group_role: groupRole,
    vk_platform: VkStartParams.DESKTOP_WEB,
    vk_is_favorite: '0',
    sign: '',
  };
  if (groupId) {
    data['vk_group_id'] = groupId.toString();
  }
  return new VkStartParams(new URLSearchParams(data));
}
