import querystring from 'querystring';
import { calcVkMiniAppsSignArgs } from './index';

export type Dict<T> = {[key:string]:T}

export class VkStartParams {
  static MOBILE_IPHONE_MESSENGER = 'mobile_iphone_messenger';
  static MOBILE_ANDROID_MESSENGER = 'mobile_android_messenger';

  static MOBILE_ANDROID = 'mobile_android';
  static MOBILE_IPHONE = 'mobile_iphone';

  static DESKTOP_WEB = 'desktop_web';
  static MOBILE_WEB = 'mobile_web';

  static ADMIN = 'admin';
  static EDITOR = 'editor';
  static MODER = 'moder';
  static MEMBER = 'member';
  static NONE = 'none';
  public params: Dict<any>;

  constructor(params: Dict<any>) {
    this.params = params;
  }

  public getValue(name: string): any {
    return this.params[name];
  }

  public hasValue(name: string): boolean {
    return this.params[name] !== undefined;
  }

  public getIntValue(name: string, def = 0): number {
    if (!this.hasValue(name)) {
      return def;
    }
    const value = parseInt(this.getValue(name), 10);
    if (!isNaN(value)) {return value;}
    return def;
  }

  public getStrValue(name: string, def = ''): string {
    if (!this.hasValue(name)) {
      return def;
    }
    const value = this.getValue(name);
    if (typeof value === 'string') {return value;}
    return (value || '').toString();
  }

  /**
     * @param {String|String[]} scope
     * @return {boolean}
     */
  hasTokenSettings(scope: string | string[]) {
    if (Array.isArray(scope)) {
      return !scope.some((scope) => !this._hasTokenSettingsScope(scope));
    }
    return this._hasTokenSettingsScope(scope);
  }

  /**
     * @return {boolean}
     */
  hasGroup() {
    return !!this.getValue('vk_group_id');
  }

  /**
     * @return {boolean}
     */
  isDesktop() {
    return this.getValue('vk_platform') === VkStartParams.DESKTOP_WEB;
  }

  /**
     * Любмая мобильная версия включая мобильный веб и мессенлжеры
     * @return {boolean}
     */
  isMobile() {
    const platform = this.getPlatform();
    return platform === VkStartParams.MOBILE_ANDROID
            || platform === VkStartParams.MOBILE_IPHONE
            || platform === VkStartParams.MOBILE_WEB
            || platform === VkStartParams.MOBILE_ANDROID_MESSENGER
            || platform === VkStartParams.MOBILE_IPHONE_MESSENGER;
  }

  /**
     * Мобильные клиенты
     * @return {boolean}
     */
  isMobileApp() {
    return this.getValue('vk_platform') === VkStartParams.MOBILE_ANDROID
            || this.getValue('vk_platform') === VkStartParams.MOBILE_IPHONE
            || this.getValue('vk_platform') === VkStartParams.MOBILE_ANDROID_MESSENGER
            || this.getValue('vk_platform') === VkStartParams.MOBILE_IPHONE_MESSENGER;
  }

  /**
     * @return {boolean}
     */
  isMobileWeb() {
    return this.getValue('vk_platform === VkStartParams.MOBILE_WEB');
  }

  /**
     * Только приложения под андроид и iOS
     * @return {boolean}
     */
  isMobileAppVkOnly() {
    return this.getValue('vk_platform') === VkStartParams.MOBILE_ANDROID
            || this.getValue('vk_platform') === VkStartParams.MOBILE_IPHONE;
  }

  isGroupAdmin() {
    return this.getValue('vk_viewer_group_role') === VkStartParams.ADMIN;
  }

  isGroupEditor() {
    return this.getValue('vk_viewer_group_role') === VkStartParams.EDITOR;
  }

  isGroupModerator() {
    return this.getValue('vk_viewer_group_role') === VkStartParams.MODER;
  }

  /**
     * vk_viewer_group_role == member
     * Чтобы проверить состоит ли пользователь в сообществе используй isGroupMemberOrAdmin
     * @return {boolean}
     */
  isGroupMember() {
    return this.getValue('vk_viewer_group_role === VkStartParams.MEMBER');
  }

  /**
     * Пользователь состоит в сообществе или администратор/модервтор/редактор
     * @return {boolean}
     */
  isGroupMemberOrAdmin() {
    return this.isGroupMember() || this.isGroupAdmin() || this.isGroupEditor() || this.isGroupModerator();
  }

  /**
     * Пользователь администратор/модервтор/редактор
     * @return {boolean}
     */
  isGroupAnyAdmin() {
    return this.isGroupAdmin() || this.isGroupEditor() || this.isGroupModerator();
  }

  notInGroup() {
    return this.getStrValue('vk_viewer_group_role') === VkStartParams.NONE || !this.hasValue('vk_viewer_group_role');
  }

  /**
     * @private
     * @param {String} singleScope
     * @return {boolean}
     * @private
     */
  _hasTokenSettingsScope(singleScope: string) {
    const settings = this.getAccessTokenSettings();
    return settings.includes(singleScope);
  }

  getUserId(): number {
    return this.getIntValue('vk_user_id');
  }

  getAppId(): number {
    return this.getIntValue('vk_app_id', 0);
  }

  isAppUser() {
    return this.getValue('vk_is_app_user');
  }

  areNotificationsEnabled(): boolean {
    return this.getIntValue('vk_are_notifications_enabled', 0) === 1;
  }

  getLanguage(): string {
    return this.getStrValue('vk_language');
  }

  getRef() {
    return this.getStrValue('vk_ref');
  }

  getAccessTokenSettings() {
    return this.getStrValue('vk_access_token_settings').split(',');
  }

  /**
     * 0 если без группы
     */
  getGroupId(): number {
    return this.getIntValue('vk_group_id', 0);
  }

  getViewerGroupRole(): string {
    return this.getStrValue('vk_viewer_group_role');
  }

  getPlatform(): string {
    return (this.getValue('vk_platform') || '').toString();
  }

  isFavorite(): boolean {
    return parseInt(this.getValue('vk_is_favorite') || '0') === 1;
  }

  getSign(): string {
    return (this.getValue('sign') || '').toString();
  }

  isValidSign(secret: string): boolean {
    return this.calcSign(secret) === this.getSign();
  }

  calcSign(secret: string) {
    return calcVkMiniAppsSignArgs(this.params, secret);
  }

  /**
     * @param {string} secret
     * @return {string}
     */
  getAuthUrl(secret: string) {
    const data = JSON.parse(JSON.stringify(this.params));
    data.sign = this.calcSign(secret);
    return querystring.stringify(data);
  }
}
