const {createFakeUser} = require("./index")
const {VkStartParams} = require("./index")
const {createStartParamsFromUrl} = require("./index")
const {checkVkMiniAppsSignUrl} = require("./index")
const {getStartParamsFromUrl} = require("./index")
const {convertUrlToParams} = require("./index")


test("check convertUrlToParams", () => {
	const urlNoGroup = "https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&sign=QLhcxfbxJvOMtpCMipI3Ak2s6mvV7f-rVBqCGV6gmJ4"
	expect(convertUrlToParams(urlNoGroup)).toMatchObject({
		vk_user_id: "19039187",
		vk_access_token_settings: "notify",
		vk_app_id: "7284402",
	})
})

test("check checkVkMiniAppsSignUrl", () => {
	const secretKey = 'YGZHWm3eO9T4oL6bApg2'
	const urlNoGroup = "https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&sign=QLhcxfbxJvOMtpCMipI3Ak2s6mvV7f-rVBqCGV6gmJ4"
	expect(checkVkMiniAppsSignUrl(urlNoGroup, secretKey)).toEqual(true)
})

test("check createStartParamsFromUrl", () => {
	const urlNoGroup = "https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&sign=QLhcxfbxJvOMtpCMipI3Ak2s6mvV7f-rVBqCGV6gmJ4"
	expect(createStartParamsFromUrl(urlNoGroup)).toMatchObject({
		vk_access_token_settings:'notify',
		vk_app_id:7284402,
		vk_are_notifications_enabled:0,
		vk_group_id:null,
		vk_is_app_user:1,
		vk_is_favorite:0,
		vk_language:'ru',
		vk_platform:'desktop_web',
		vk_ref:'other',
		vk_user_id:19039187,
		vk_viewer_group_role:'',
		sign:'QLhcxfbxJvOMtpCMipI3Ak2s6mvV7f-rVBqCGV6gmJ4',
	})
})

test("check getStartParamsFromUrl no group", () => {
	const urlNoGroup = "https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&sign=QLhcxfbxJvOMtpCMipI3Ak2s6mvV7f-rVBqCGV6gmJ4"
	const secretKey = 'YGZHWm3eO9T4oL6bApg2'
	const data = getStartParamsFromUrl(urlNoGroup, secretKey)
	expect(data).toMatchObject({
		vk_access_token_settings:'notify',
		vk_app_id:7284402,
		vk_are_notifications_enabled:0,
		vk_group_id:null,
		vk_is_app_user:1,
		vk_is_favorite:0,
		vk_language:'ru',
		vk_platform:'desktop_web',
		vk_ref:'other',
		vk_user_id:19039187,
		vk_viewer_group_role:'',
		sign:'QLhcxfbxJvOMtpCMipI3Ak2s6mvV7f-rVBqCGV6gmJ4',
	})
})

test("check getStartParamsFromUrl group", () => {
	const urlGroupAdmin = "https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_group_id=60687596&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&vk_viewer_group_role=admin&sign=znK4Byk4l2ywtzmSuAvaDUXTAK2yeHh7uPcPb_8V0dM"
	const secretKey = 'YGZHWm3eO9T4oL6bApg2'
	const data = getStartParamsFromUrl(urlGroupAdmin, secretKey)
	expect(data).toMatchObject({
		vk_access_token_settings:'notify',
		vk_app_id:7284402,
		vk_are_notifications_enabled:0,
		vk_group_id:60687596,
		vk_is_app_user:1,
		vk_is_favorite:0,
		vk_language:'ru',
		vk_platform:'desktop_web',
		vk_ref:'other',
		vk_user_id:19039187,
		vk_viewer_group_role:'admin',
		sign:'znK4Byk4l2ywtzmSuAvaDUXTAK2yeHh7uPcPb_8V0dM',
	})
})

test("check VkStartParams", () => {
	const urlGroupAdmin = "https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_group_id=60687596&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&vk_viewer_group_role=admin&sign=znK4Byk4l2ywtzmSuAvaDUXTAK2yeHh7uPcPb_8V0dM"
	const secretKey = 'YGZHWm3eO9T4oL6bApg2'
	const data = getStartParamsFromUrl(urlGroupAdmin, secretKey)
	expect(data instanceof VkStartParams).toEqual(true)
	expect(data.getAppId()).toEqual(7284402)
	expect(data.getGroupId()).toEqual(60687596)
	expect(data.getUserId()).toEqual(19039187)
	expect(data.isGroupAdmin()).toEqual(true)
	expect(data.isGroupAnyAdmin()).toEqual(true)
})

test("negative getStartParamsFromUrl", () => {
	const urlGroupAdmin = "https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_group_id=60687596&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&vk_viewer_group_role=admin&sign=znK4Byk4l2ywtzmSuAvaDUXTAK2yeHh7uPcPb_8V0dM"
	const secretKey = '' //no secret
	const data = getStartParamsFromUrl(urlGroupAdmin, secretKey)
	expect(data).toEqual(null)
})

test("negative checkVkMiniAppsSignUrl no secret", () => {
	const urlGroupAdmin = "https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_group_id=60687596&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&vk_viewer_group_role=admin&sign=znK4Byk4l2ywtzmSuAvaDUXTAK2yeHh7uPcPb_8V0dM"
	const secretKey = '' //no secret
	const data = checkVkMiniAppsSignUrl(urlGroupAdmin, secretKey)
	expect(data).toEqual(false)
})

test("negative checkVkMiniAppsSignUrl bad params", () => {
	const urlGroupAdmin = "https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_group_id=61687596&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&vk_viewer_group_role=admin&sign=znK4Byk4l2ywtzmSuAvaDUXTAK2yeHh7uPcPb_8V0dM"
	const secretKey = 'YGZHWm3eO9T4oL6bApg2'
	const data = checkVkMiniAppsSignUrl(urlGroupAdmin, secretKey)
	expect(data).toEqual(false)
})

test("negative checkVkMiniAppsSignUrl bad params 2", () => {
	const urlGroupAdmin = "https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_group_id[]=60687596&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&vk_viewer_group_role=admin&sign=znK4Byk4l2ywtzmSuAvaDUXTAK2yeHh7uPcPb_8V0dM"
	const secretKey = 'YGZHWm3eO9T4oL6bApg2'
	const data = checkVkMiniAppsSignUrl(urlGroupAdmin, secretKey)
	expect(data).toEqual(false)
})


test("check parse params for url", () => {
	expect(convertUrlToParams("a=1&b=2")).toEqual({a: "1", b: "2"})
	expect(convertUrlToParams("/a=1&b=2")).toEqual({a: "1", b: "2"})
	expect(convertUrlToParams("/?a=1&b=2")).toEqual({a: "1", b: "2"})
	expect(convertUrlToParams("?a=1&b=2")).toEqual({a: "1", b: "2"})
	expect(convertUrlToParams(" ?a=1&b=2")).toEqual({a: "1", b: "2"})
	expect(convertUrlToParams(" a=1&b=2")).toEqual({a: "1", b: "2"})
	expect(convertUrlToParams("http://vk.com/?a=1&b=2")).toEqual({a: "1", b: "2"})
	expect(convertUrlToParams("http://vk.com?a=1&b=2")).toEqual({a: "1", b: "2"})
	expect(convertUrlToParams("https://vk.com?a=1&b=2")).toEqual({a: "1", b: "2"})
	expect(convertUrlToParams("https://vk.com/?a=1&b=2")).toEqual({a: "1", b: "2"})
	expect(convertUrlToParams("vk_access_token_settings=friends")).toEqual({vk_access_token_settings: "friends"})
})

test("check true way getStartParamsFromUrl", () => {
	const urlNoGroup = "https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&sign=QLhcxfbxJvOMtpCMipI3Ak2s6mvV7f-rVBqCGV6gmJ4"
	const secretKey = 'YGZHWm3eO9T4oL6bApg2'
	const data = createStartParamsFromUrl(urlNoGroup)
	expect(data.calcSign(secretKey)).toEqual(data.sign)
	expect(data.isValidSign(secretKey)).toEqual(true)
})

test("fake users", () => {
	const user = createFakeUser(2050)
	const secretKey = 'blablalba'
	const data = createStartParamsFromUrl(user.getAuthUrl(secretKey))
	expect(data.calcSign(secretKey)).toEqual(data.sign)
	expect(data.isValidSign(secretKey)).toEqual(true)
})