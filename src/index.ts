import * as querystring from 'querystring';
import { VkStartParams } from './VkStartParams';
import * as crypto from 'crypto';
import Dict = NodeJS.Dict;

/**
 * @param {String} url
 * @return {Object}
 */
export function convertUrlToParams(url: string): querystring.ParsedUrlQuery {
  if (!url) {return {};}
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
  return querystring.parse(url);
}

/**
 * @param {Object} parsedParams
 * @param secret
 * @return {boolean}
 */
export function checkVkMiniAppsSignArgs(parsedParams: querystring.ParsedUrlQuery, secret: string): boolean {
  return calcVkMiniAppsSignArgs(parsedParams, secret) === parsedParams.sign;
}

/**
 * @param {Object} parsedParams
 * @param secret
 * @return {String}
 */
export function calcVkMiniAppsSignArgs(parsedParams: querystring.ParsedUrlQuery, secret: string) {
  const signParamsKeys = Object.keys(parsedParams).filter((key) => key.startsWith('vk_') && parsedParams[key] !== undefined);

  let stringForSign = signParamsKeys.sort().map((key) => querystring.stringify({ [key]: parsedParams[key] })).join('&');

  const hmac = crypto.createHmac('sha256', secret);
  hmac.write(stringForSign);
  hmac.end();
  return hmac.read()
    .toString('base64')
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
export function createStartParamsFromObject(data: Dict<any>) {
  return new VkStartParams(data);
}

/**
 * @param {Number} userId
 * @param {Number} groupId
 * @param {Number} groupRole
 * @return {VkStartParams}
 */
export function createFakeUser(userId: number, groupId?: number, groupRole = 'none') {
  const data = {
    vk_user_id: userId,
    vk_app_id: 10,
    vk_is_app_user: 0,
    vk_are_notifications_enabled: 0,
    vk_language: 'ru',
    vk_ref: 'other',
    vk_access_token_settings: '',
    vk_group_id: groupId,
    vk_viewer_group_role: groupRole,
    vk_platform: VkStartParams.DESKTOP_WEB,
    vk_is_favorite: 0,
    sign: '',
  };
  return new VkStartParams(data);
}
