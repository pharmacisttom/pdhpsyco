import { GOOGLE_SCRIPT_URL } from '../config';

export const logUsage = async (formType) => {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn('Google Script URL is not configured. Log not sent.');
    return;
  }

  const device = getDeviceType();
  const payload = {
    timestamp: new Date().toISOString(),
    form_type: formType,
    device: device,
    page: window.location.pathname,
    user_agent: navigator.userAgent
  };

  try {
    // using no-cors to prevent CORS issues with simple Google Apps Script deployments
    // Note: with no-cors, we can't read the response, but it successfully sends the POST
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Failed to log usage:', error);
    // Fail silently so it doesn't disturb the user
  }
};

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

export const logContact = async (formType, phone, score, interpretation) => {
  if (!GOOGLE_SCRIPT_URL) return;
  
  const payload = {
    timestamp: new Date().toISOString(),
    form_type: formType,
    device: getDeviceType(),
    page: window.location.pathname,
    user_agent: navigator.userAgent,
    phone: phone,
    score: score,
    interpretation: interpretation
  };

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Failed to log contact:', error);
  }
};
