const querystring = require('querystring')
const crypto = require('crypto')

class VkStartParams {

	/**
	 * @param {Object} data
	 * @return {VkStartParams}
	 */
	static fromObject(data) {
		const {vk_user_id, vk_app_id, vk_is_app_user, vk_are_notifications_enabled, vk_language, vk_ref, vk_access_token_settings, vk_group_id, vk_viewer_group_role, vk_platform, vk_is_favorite, sign} = data
		const self = new VkStartParams(vk_user_id, vk_app_id, vk_is_app_user, vk_are_notifications_enabled, vk_language, vk_ref, vk_access_token_settings, vk_group_id, vk_viewer_group_role, vk_platform, vk_is_favorite, sign)
		const copy = {...data}
		delete copy.vk_user_id
		delete copy.vk_app_id
		delete copy.vk_is_app_user
		delete copy.vk_are_notifications_enabled
		delete copy.vk_language
		delete copy.vk_ref
		delete copy.vk_access_token_settings
		delete copy.vk_group_id
		delete copy.vk_viewer_group_role
		delete copy.vk_platform
		delete copy.vk_is_favorite
		delete copy.sign
		return Object.assign(self, copy)
	}

	constructor(vk_user_id, vk_app_id, vk_is_app_user, vk_are_notifications_enabled, vk_language, vk_ref, vk_access_token_settings, vk_group_id, vk_viewer_group_role, vk_platform, vk_is_favorite, sign) {
		this.vk_user_id = parseInt(vk_user_id, 10)
		this.vk_app_id = parseInt(vk_app_id, 10)
		this.vk_is_app_user = parseInt(vk_is_app_user, 10)
		this.vk_group_id = vk_group_id ? parseInt(vk_group_id, 10) : undefined
		this.vk_are_notifications_enabled = parseInt(vk_are_notifications_enabled, 10)
		this.vk_language = (vk_language || "").toString()
		this.vk_ref = (vk_ref || "").toString()
		this.vk_access_token_settings = (vk_access_token_settings || "").toString()
		this.vk_viewer_group_role = vk_viewer_group_role ? (vk_viewer_group_role || "").toString() : undefined
		this.vk_platform = (vk_platform || "").toString()
		this.vk_is_favorite = parseInt(vk_is_favorite, 10)

		this._vk_access_token_settings_arr = this.vk_access_token_settings.split(',')
		this.raw = {
			vk_user_id,
			vk_app_id,
			vk_is_app_user,
			vk_are_notifications_enabled,
			vk_language,
			vk_ref,
			vk_access_token_settings,
			vk_group_id,
			vk_viewer_group_role,
			vk_platform,
			vk_is_favorite,
			sign
		}
		this.sign = sign
	}


	/**
	 * @param {String|String[]} scope
	 * @return {boolean}
	 */
	hasTokenSettings(scope) {
		if (Array.isArray(scope)) {
			return !scope.some(scope => !this._hasTokenSettingsScope(scope))
		}
		return this._hasTokenSettingsScope(scope)
	}

	/**
	 * @return {boolean}
	 */
	hasGroup() {
		return !!this.vk_group_id
	}

	/**
	 * @return {boolean}
	 */
	isDesktop() {
		return this.vk_platform === VkStartParams.DESKTOP_WEB
	}

	/**
	 * Любмая мобильная версия включая мобильный веб и мессенлжеры
	 * @return {boolean}
	 */
	isMobile() {
		return this.vk_platform === VkStartParams.MOBILE_ANDROID
			|| this.vk_platform === VkStartParams.MOBILE_IPHONE
			|| this.vk_platform === VkStartParams.MOBILE_WEB
			|| this.vk_platform === VkStartParams.MOBILE_ANDROID_MESSENGER
			|| this.vk_platform === VkStartParams.MOBILE_IPHONE_MESSENGER
	}

	/**
	 * Мобильные клиенты
	 * @return {boolean}
	 */
	isMobileApp() {
		return this.vk_platform === VkStartParams.MOBILE_ANDROID
			|| this.vk_platform === VkStartParams.MOBILE_IPHONE
			|| this.vk_platform === VkStartParams.MOBILE_ANDROID_MESSENGER
			|| this.vk_platform === VkStartParams.MOBILE_IPHONE_MESSENGER
	}

	/**
	 * @return {boolean}
	 */
	isMobileWeb() {
		return this.vk_platform === VkStartParams.MOBILE_WEB
	}

	/**
	 * Только приложения под андроид и iOS
	 * @return {boolean}
	 */
	isMobileAppVkOnly() {
		return this.vk_platform === VkStartParams.MOBILE_ANDROID
			|| this.vk_platform === VkStartParams.MOBILE_IPHONE
	}

	isGroupAdmin() {
		return this.vk_viewer_group_role === VkStartParams.ADMIN
	}

	isGroupEditor() {
		return this.vk_viewer_group_role === VkStartParams.EDITOR
	}

	isGroupModerator() {
		return this.vk_viewer_group_role === VkStartParams.MODER
	}

	/**
	 * vk_viewer_group_role == member
	 * Чтобы проверить состоит ли пользователь в сообществе используй isGroupMemberOrAdmin
	 * @return {boolean}
	 */
	isGroupMember() {
		return this.vk_viewer_group_role === VkStartParams.MEMBER
	}

	/**
	 * Пользователь состоит в сообществе или администратор/модервтор/редактор
	 * @return {boolean}
	 */
	isGroupMemberOrAdmin() {
		return this.isGroupMember() || this.isGroupAdmin() || this.isGroupEditor() || this.isGroupModerator()
	}

	/**
	 * Пользователь администратор/модервтор/редактор
	 * @return {boolean}
	 */
	isGroupAnyAdmin() {
		return this.isGroupAdmin() || this.isGroupEditor() || this.isGroupModerator()
	}

	notInGroup() {
		return this.vk_viewer_group_role === VkStartParams.NONE
	}

	/**
	 * @private
	 * @param {String} singleScope
	 * @return {boolean}
	 * @private
	 */
	_hasTokenSettingsScope(singleScope) {
		return this._vk_access_token_settings_arr.indexOf(singleScope) !== -1
	}

	getUserId() {
		return this.vk_user_id
	}

	getAppId() {
		return this.vk_app_id
	}

	isAppUser() {
		return this.vk_is_app_user
	}

	areNotificationsEnabled() {
		return this.vk_are_notifications_enabled
	}

	getLanguage() {
		return this.vk_language
	}

	getRef() {
		return this.vk_ref
	}

	getAccessTokenSettings() {
		return this.vk_access_token_settings
	}

	getGroupId() {
		return this.vk_group_id
	}

	getViewerGroupRole() {
		return this.vk_viewer_group_role
	}

	getPlatform() {
		return this.vk_platform
	}

	getIsFavorite() {
		return this.vk_is_favorite
	}

	getSign() {
		return this.sign
	}

	isValidSign(secret) {
		return this.calcSign(secret) === this.sign
	}

	calcSign(secret) {
		return calcVkMiniAppsSignArgs(this, secret)
	}

	/**
	 * @param {string} secret
	 * @return {string}
	 */
	getAuthUrl(secret) {
		const data = JSON.parse(JSON.stringify(this))
		delete data.raw
		delete data._vk_access_token_settings_arr
		data.sign = this.calcSign(secret)
		return querystring.stringify(data)
	}

}

VkStartParams.MOBILE_IPHONE_MESSENGER = 'mobile_iphone_messenger'
VkStartParams.MOBILE_ANDROID_MESSENGER = 'mobile_android_messenger'

VkStartParams.MOBILE_ANDROID = 'mobile_android'
VkStartParams.MOBILE_IPHONE = 'mobile_iphone'

VkStartParams.DESKTOP_WEB = 'desktop_web'
VkStartParams.MOBILE_WEB = 'mobile_web'

VkStartParams.ADMIN = 'admin'
VkStartParams.EDITOR = 'editor'
VkStartParams.MODER = 'moder'
VkStartParams.MEMBER = 'member'
VkStartParams.NONE = 'none'


/**
 * @param {String} url
 * @return {Object}
 */
function convertUrlToParams(url) {
	if (!url) return {}
	url = url.trim()
	if (url.indexOf('https://') === 0 || url.indexOf('http://') === 0) {
		url = (new URL(url)).search.substr(1)
	} else {
		if (url[0] === '/') {
			url = url.substr(1)
		}
		if (url[0] === '?') {
			url = url.substr(1)
		}
	}
	const parsedParams = querystring.parse(url)
	// if (parsedParams.vk_access_token_settings) {
	// 	parsedParams.vk_access_token_settings = encodeURIComponent(parsedParams.vk_access_token_settings)
	// }
	return parsedParams
}

/**
 * @param {Object} parsedParams
 * @param secret
 * @return {boolean}
 */
function checkVkMiniAppsSignArgs(parsedParams, secret) {
	return calcVkMiniAppsSignArgs(parsedParams, secret) === parsedParams.sign
}

/**
 * @param {Object} parsedParams
 * @param secret
 * @return {String}
 */
function calcVkMiniAppsSignArgs(parsedParams, secret) {
	const signParamsKeys = Object.keys(parsedParams).filter(key => (key.indexOf('vk_') === 0 && parsedParams[key] !== undefined))

	let stringForSign = signParamsKeys.sort().map(key => querystring.stringify({[key]:parsedParams[key]})).join("&")

	const hmac = crypto.createHmac('sha256', secret)
	hmac.write(stringForSign)
	hmac.end()
	return hmac.read()
		.toString('base64')
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
}


/**
 * @param {String} url
 * @param {String} secret
 * @return {boolean}
 */
function checkVkMiniAppsSignUrl(url, secret) {
	return checkVkMiniAppsSignArgs(convertUrlToParams(url), secret)
}

/**
 * Проверяет параметры запуска, если подпись не сошлась, возвращает null
 * @param {String} url
 * @param {String} secret
 * @return {null|VkStartParams}
 */
function getStartParamsFromUrl(url, secret) {
	const params = convertUrlToParams(url)
	if (checkVkMiniAppsSignArgs(params, secret)) {
		return VkStartParams.fromObject(params)
	} else {
		return null
	}
}

/**
 * @param {String} url
 * @return {VkStartParams}
 */
function createStartParamsFromUrl(url) {
	return VkStartParams.fromObject(convertUrlToParams(url))
}

/**
 * @param {Object} data
 * @return {VkStartParams}
 */
function createStartParamsFromObject(data) {
	return VkStartParams.fromObject(data)
}

/**
 * @param {Number} userId
 * @param {Number} groupId
 * @param {Number} groupRole
 * @return {VkStartParams}
 */
function createFakeUser(userId, groupId = undefined, groupRole = undefined) {
	const data = {
		vk_user_id: userId,
		vk_app_id: 10,
		vk_is_app_user: 0,
		vk_are_notifications_enabled: 0,
		vk_language: "ru",
		vk_ref: "other",
		vk_access_token_settings: "",
		vk_group_id: groupId,
		vk_viewer_group_role: groupRole,
		vk_platform: VkStartParams.DESKTOP_WEB,
		vk_is_favorite: 0,
		sign: "",
	}
	return VkStartParams.fromObject(data)
}

module.exports = {
	checkVkMiniAppsSignUrl,
	checkVkMiniAppsSignArgs,
	convertUrlToParams,
	getStartParamsFromUrl,
	createStartParamsFromUrl,
	createStartParamsFromObject,
	VkStartParams,
	isValidUrl: checkVkMiniAppsSignUrl,
	isValidParams: checkVkMiniAppsSignUrl,
	createFakeUser,
}
