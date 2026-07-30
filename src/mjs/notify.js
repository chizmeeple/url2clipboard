/**
 * notify.js
 */

/* shared */
import { createNotification } from './browser.js';
import { isString } from './common.js';
import { EXT_NAME, NOTIFY_COPY } from './constant.js';

/* api */
const { i18n, runtime } = browser;

/**
 * notify on copy
 * @param {string} [label] - format label
 * @param {string} [url] - copied URL
 * @returns {Promise} - createNotification()
 */
export const notifyOnCopy = (label, url) => {
  const formatMsg =
    (isString(label) && label &&
     i18n.getMessage(`${NOTIFY_COPY}Msg_format`, label)) ||
    i18n.getMessage(`${NOTIFY_COPY}Msg`);
  const ext = typeof window === 'undefined' ? 'png' : 'svg';
  const msg = {
    iconUrl: runtime.getURL(`img/icon.${ext}`),
    title: i18n.getMessage(EXT_NAME),
    type: 'basic'
  };
  if (isString(url) && url) {
    msg.message = url;
    msg.contextMessage = formatMsg;
  } else {
    msg.message = formatMsg;
  }
  return createNotification(`${NOTIFY_COPY}-${Date.now()}`, msg);
};
