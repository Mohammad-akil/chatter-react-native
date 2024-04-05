import axiosApi from '../../config/axios';

async function getNotifications() {
  const response = await axiosApi.get(`/notifications`);

  if (response.data.error) {
    return {
      success: false,
      data: response.data,
    };
  }

  return {
    success: true,
    data: response.data,
  };
}

async function registerDevice(token: string, platform: string) {
  try {
    await axiosApi.post(`/notifications/register-device`, {
      token,
      platform,
    });
  } catch (error) {
    console.log('Error registering device');
  }
}

export const notificationsApi = {
  getNotifications,
  registerDevice,
};
