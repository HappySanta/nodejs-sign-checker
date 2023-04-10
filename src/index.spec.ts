import {
  bufferToBase64UrlSafe,
  checkVkMiniAppsSignUrl,
  convertUrlToParams,
  createFakeUser,
  createStartParamsFromUrl,
  getStartParamsFromUrl, uspToObject,
} from './index';
import { VkStartParams } from './VkStartParams';

describe('sign-checker', () => {
  test('check convertUrlToParams', () => {
    const urlNoGroup = 'https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&sign=QLhcxfbxJvOMtpCMipI3Ak2s6mvV7f-rVBqCGV6gmJ4';
    expect(uspToObject(convertUrlToParams(urlNoGroup))).toMatchObject({
      vk_user_id: '19039187',
      vk_access_token_settings: 'notify',
      vk_app_id: '7284402',
    });
  });

  test('check checkVkMiniAppsSignUrl', () => {
    const secretKey = 'YGZHWm3eO9T4oL6bApg2';
    const urlNoGroup = 'https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&sign=QLhcxfbxJvOMtpCMipI3Ak2s6mvV7f-rVBqCGV6gmJ4';
    expect(checkVkMiniAppsSignUrl(urlNoGroup, secretKey)).toEqual(true);
  });

  test('check checkVkMiniAppsSignUrl 2', () => {
    const secretKey = 'rkwdOT04kUh28RDEC9zr';
    const urlNoGroup = '?vk_access_token_settings=friends%2Cgroups&vk_app_id=6825462&vk_are_notifications_enabled=0&vk_is_app_user=1&vk_language=ru&vk_platform=desktop_web&vk_user_id=19039187&sign=vBBPIysvzccFUn_e55JCGxZBnmxpXeh92XpiAY9gcv8';
    expect(checkVkMiniAppsSignUrl(urlNoGroup, secretKey)).toEqual(true);
  });

  test('check checkVkMiniAppsSignUrl bad args', () => {
    const secretKey = 'YGZHWm3eO9T4oL6bApg2';
    const urlNoGroup = 'https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=9999&vk_are_notifications_enabled=0&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&sign=QLhcxfbxJvOMtpCMipI3Ak2s6mvV7f-rVBqCGV6gmJ4';
    expect(checkVkMiniAppsSignUrl(urlNoGroup, secretKey)).toEqual(false);
  });

  test('check checkVkMiniAppsSignUrl bad secret', () => {
    const secretKey = 'rkwdOT0_BAD_EC9zr';
    const urlNoGroup = '?vk_access_token_settings=friends%2Cgroups&vk_app_id=6825462&vk_are_notifications_enabled=0&vk_is_app_user=1&vk_language=ru&vk_platform=desktop_web&vk_user_id=19039187&sign=vBBPIysvzccFUn_e55JCGxZBnmxpXeh92XpiAY9gcv8';
    expect(checkVkMiniAppsSignUrl(urlNoGroup, secretKey)).toEqual(false);
  });

  test('check checkVkMiniAppsSignUrl empty secret', () => {
    const secretKey = '';
    const urlNoGroup = '?vk_access_token_settings=friends%2Cgroups&vk_app_id=6825462&vk_are_notifications_enabled=0&vk_is_app_user=1&vk_language=ru&vk_platform=desktop_web&vk_user_id=19039187&sign=vBBPIysvzccFUn_e55JCGxZBnmxpXeh92XpiAY9gcv8';
    expect(checkVkMiniAppsSignUrl(urlNoGroup, secretKey)).toEqual(false);
  });

  test('check checkVkMiniAppsSignUrl empty args', () => {
    const secretKey = 'rkwdOT04kUh28RDEC9zr';
    const urlNoGroup = '';
    expect(checkVkMiniAppsSignUrl(urlNoGroup, secretKey)).toEqual(false);
  });

  test('check checkVkMiniAppsSignUrl empty both', () => {
    const secretKey = '';
    const urlNoGroup = '';
    expect(checkVkMiniAppsSignUrl(urlNoGroup, secretKey)).toEqual(false);
  });

  test('check VkStartParams', () => {
    const urlGroupAdmin = 'https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_group_id=60687596&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&vk_viewer_group_role=admin&sign=znK4Byk4l2ywtzmSuAvaDUXTAK2yeHh7uPcPb_8V0dM';
    const secretKey = 'YGZHWm3eO9T4oL6bApg2';
    const data = getStartParamsFromUrl(urlGroupAdmin, secretKey);
    if (data === null) {
      throw new Error('bad params');
    }
    expect(data instanceof VkStartParams).toEqual(true);
    expect(data.getAppId()).toEqual(7284402);
    expect(data.getGroupId()).toEqual(60687596);
    expect(data.getUserId()).toEqual(19039187);
    expect(data.isGroupAdmin()).toEqual(true);
    expect(data.isGroupAnyAdmin()).toEqual(true);
  });

  test('check VkStartParams with bad params', () => {
    const urlGroupAdmin = 'https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_group_id=60687596&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&vk_viewer_group_role=admin&sign=znK4Byk4l2ywtzmSuAvaDUXTAK2yeHh7uPcPb_8V0dM';
    const secretKey = 'YGZHW_FAKE_L6bApg2';
    const data = getStartParamsFromUrl(urlGroupAdmin, secretKey);
    if (data !== null) {
      throw new Error('bad params');
    }
    expect(data).toEqual(null);
  });

  test('negative getStartParamsFromUrl', () => {
    const urlGroupAdmin = 'https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_group_id=60687596&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&vk_viewer_group_role=admin&sign=znK4Byk4l2ywtzmSuAvaDUXTAK2yeHh7uPcPb_8V0dM';
    const secretKey = ''; // no secret
    const data = getStartParamsFromUrl(urlGroupAdmin, secretKey);
    expect(data).toEqual(null);
  });

  test('negative checkVkMiniAppsSignUrl no secret', () => {
    const urlGroupAdmin = 'https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_group_id=60687596&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&vk_viewer_group_role=admin&sign=znK4Byk4l2ywtzmSuAvaDUXTAK2yeHh7uPcPb_8V0dM';
    const secretKey = ''; // no secret
    const data = checkVkMiniAppsSignUrl(urlGroupAdmin, secretKey);
    expect(data).toEqual(false);
  });

  test('negative checkVkMiniAppsSignUrl bad params', () => {
    const urlGroupAdmin = 'https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_group_id=61687596&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&vk_viewer_group_role=admin&sign=znK4Byk4l2ywtzmSuAvaDUXTAK2yeHh7uPcPb_8V0dM';
    const secretKey = 'YGZHWm3eO9T4oL6bApg2';
    const data = checkVkMiniAppsSignUrl(urlGroupAdmin, secretKey);
    expect(data).toEqual(false);
  });

  test('negative checkVkMiniAppsSignUrl bad params 2', () => {
    const urlGroupAdmin = 'https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_group_id[]=60687596&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&vk_viewer_group_role=admin&sign=znK4Byk4l2ywtzmSuAvaDUXTAK2yeHh7uPcPb_8V0dM';
    const secretKey = 'YGZHWm3eO9T4oL6bApg2';
    const data = checkVkMiniAppsSignUrl(urlGroupAdmin, secretKey);
    expect(data).toEqual(false);
  });

  test('check parse params for url', () => {
    expect(uspToObject(convertUrlToParams('a=1&b=2'))).toEqual({ a: '1', b: '2' });
    expect(uspToObject(convertUrlToParams('/a=1&b=2'))).toEqual({ a: '1', b: '2' });
    expect(uspToObject(convertUrlToParams('/?a=1&b=2'))).toEqual({ a: '1', b: '2' });
    expect(uspToObject(convertUrlToParams('?a=1&b=2'))).toEqual({ a: '1', b: '2' });
    expect(uspToObject(convertUrlToParams(' ?a=1&b=2'))).toEqual({ a: '1', b: '2' });
    expect(uspToObject(convertUrlToParams(' a=1&b=2'))).toEqual({ a: '1', b: '2' });
    expect(uspToObject(convertUrlToParams('http://vk.com/?a=1&b=2'))).toEqual({ a: '1', b: '2' });
    expect(uspToObject(convertUrlToParams('http://vk.com?a=1&b=2'))).toEqual({ a: '1', b: '2' });
    expect(uspToObject(convertUrlToParams('https://vk.com?a=1&b=2'))).toEqual({ a: '1', b: '2' });
    expect(uspToObject(convertUrlToParams('https://vk.com/?a=1&b=2'))).toEqual({ a: '1', b: '2' });
    expect(uspToObject(convertUrlToParams('vk_access_token_settings=friends'))).toEqual({ vk_access_token_settings: 'friends' });
  });

  test('check true way getStartParamsFromUrl', () => {
    const urlNoGroup = 'https://stels-cs.github.io/demo-vk-apps/VKWebAppOpenPayFormFailed.html?vk_access_token_settings=notify&vk_app_id=7284402&vk_are_notifications_enabled=0&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_user_id=19039187&sign=QLhcxfbxJvOMtpCMipI3Ak2s6mvV7f-rVBqCGV6gmJ4';
    const secretKey = 'YGZHWm3eO9T4oL6bApg2';
    const data = createStartParamsFromUrl(urlNoGroup);
    expect(bufferToBase64UrlSafe(data.calcSign(secretKey))).toEqual(data.getSign());
    expect(data.isValidSign(secretKey)).toEqual(true);
  });

  test('fake users', () => {
    const user = createFakeUser(2050);
    const secretKey = 'blablalba';
    const data = createStartParamsFromUrl(user.getAuthUrl(secretKey));
    expect(bufferToBase64UrlSafe(data.calcSign(secretKey))).toEqual(data.getSign());
    expect(data.isValidSign(secretKey)).toEqual(true);
  });

  test('params with experiments', () => {
    const args = 'https://test.dev1.hsstore.ru/demo-vk-apps/index.html?vk_access_token_settings=&vk_app_id=7648434&vk_are_notifications_enabled=0&vk_experiment={"950":0,"949":0}&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_ts=1607004912&vk_user_id=19039187&sign=opZy_yHgqes6dvcqHApACJcf_dmHphIbMUlRWkJK7Rw';
    const secret = '27cDPwLMFM4G6hetC9ed';
    const data = createStartParamsFromUrl(args);
    expect(data.isValidSign(secret)).toEqual(true);
  });

  test('update params 2023', () => {
    const args = 'https://in.dev1.hsstore.ru/?vk_access_token_settings=&vk_app_id=51610110&vk_are_notifications_enabled=0&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_ts=1681141388&vk_user_id=19039187&sign=7SVkcWJDe_srCfWwBrkREbNIRziTmPJplJ60cnx3hZ8';
    const secret = 'bHfBoOIfqQNFVuiFHA8B';
    const data = createStartParamsFromUrl(args);
    expect(bufferToBase64UrlSafe(data.calcSign(secret))).toEqual(data.getSign());
    expect(data.isValidSign(secret)).toEqual(true);
  });
});

