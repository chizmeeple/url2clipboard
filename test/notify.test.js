/**
 * notify.test.js
 */

/* api */
import { strict as assert } from 'node:assert';
import { afterEach, beforeEach, describe, it } from 'mocha';
import { browser, createJsdom } from './mocha/setup.js';

/* test */
import { NOTIFY_COPY } from '../src/mjs/constant.js';
import * as mjs from '../src/mjs/notify.js';

describe('notify', () => {
  beforeEach(() => {
    browser._sandbox.reset();
    browser.i18n.getMessage.callsFake((...args) => args.toString());
    browser.permissions.contains.resolves(true);
    global.browser = browser;
  });
  afterEach(() => {
    delete global.browser;
    browser._sandbox.reset();
  });

  describe('notify on copy', () => {
    const func = mjs.notifyOnCopy;
    const notifyId = new RegExp(`^${NOTIFY_COPY}-\\d+$`);

    it('should call function', async () => {
      browser.runtime.getURL.withArgs('img/icon.png').returns('img/icon.png');
      browser.i18n.getMessage.withArgs('notifyOnCopyMsg').returns('foo');
      browser.i18n.getMessage.withArgs('extensionName').returns('bar');
      browser.notifications.create.resolves(true);
      const res = await func();
      const [id, opt] = browser.notifications.create.args[0];
      assert.match(id, notifyId, 'id');
      assert.deepEqual(opt, {
        iconUrl: 'img/icon.png',
        message: 'foo',
        title: 'bar',
        type: 'basic'
      }, 'opt');
      assert.strictEqual(res, true, 'result');
    });

    it('should call function', async () => {
      browser.runtime.getURL.withArgs('img/icon.png').returns('img/icon.png');
      browser.i18n.getMessage.withArgs('notifyOnCopyMsg_format', 'foo')
        .returns('foo');
      browser.i18n.getMessage.withArgs('extensionName').returns('bar');
      browser.notifications.create.resolves(true);
      const res = await func('foo');
      const [id, opt] = browser.notifications.create.args[0];
      assert.match(id, notifyId, 'id');
      assert.deepEqual(opt, {
        iconUrl: 'img/icon.png',
        message: 'foo',
        title: 'bar',
        type: 'basic'
      }, 'opt');
      assert.strictEqual(res, true, 'result');
    });

    it('should call function with url', async () => {
      browser.runtime.getURL.withArgs('img/icon.png').returns('img/icon.png');
      browser.i18n.getMessage.withArgs('notifyOnCopyMsg').returns('Copied');
      browser.i18n.getMessage.withArgs('extensionName').returns('bar');
      browser.notifications.create.resolves(true);
      const res = await func(null, 'https://example.com/');
      const [id, opt] = browser.notifications.create.args[0];
      assert.match(id, notifyId, 'id');
      assert.deepEqual(opt, {
        contextMessage: 'Copied',
        iconUrl: 'img/icon.png',
        message: 'https://example.com/',
        title: 'bar',
        type: 'basic'
      }, 'opt');
      assert.strictEqual(res, true, 'result');
    });

    it('should call function with format and url', async () => {
      browser.runtime.getURL.withArgs('img/icon.png').returns('img/icon.png');
      browser.i18n.getMessage.withArgs('notifyOnCopyMsg_format', 'Markdown')
        .returns('Copied as Markdown');
      browser.i18n.getMessage.withArgs('extensionName').returns('bar');
      browser.notifications.create.resolves(true);
      const res = await func('Markdown', 'https://example.com/');
      const [id, opt] = browser.notifications.create.args[0];
      assert.match(id, notifyId, 'id');
      assert.deepEqual(opt, {
        contextMessage: 'Copied as Markdown',
        iconUrl: 'img/icon.png',
        message: 'https://example.com/',
        title: 'bar',
        type: 'basic'
      }, 'opt');
      assert.strictEqual(res, true, 'result');
    });

    it('should call function', async () => {
      const { window } = createJsdom();
      global.window = window;
      browser.runtime.getURL.withArgs('img/icon.svg').returns('img/icon.svg');
      browser.i18n.getMessage.withArgs('notifyOnCopyMsg').returns('foo');
      browser.i18n.getMessage.withArgs('extensionName').returns('bar');
      browser.notifications.create.resolves(true);
      const res = await func();
      const [id, opt] = browser.notifications.create.args[0];
      delete global.window;
      assert.match(id, notifyId, 'id');
      assert.deepEqual(opt, {
        iconUrl: 'img/icon.svg',
        message: 'foo',
        title: 'bar',
        type: 'basic'
      }, 'opt');
      assert.strictEqual(res, true, 'result');
    });

    it('should call function', async () => {
      const { window } = createJsdom();
      global.window = window;
      browser.runtime.getURL.withArgs('img/icon.svg').returns('img/icon.svg');
      browser.i18n.getMessage.withArgs('notifyOnCopyMsg_format', 'foo')
        .returns('foo');
      browser.i18n.getMessage.withArgs('extensionName').returns('bar');
      browser.notifications.create.resolves(true);
      const res = await func('foo');
      const [id, opt] = browser.notifications.create.args[0];
      delete global.window;
      assert.match(id, notifyId, 'id');
      assert.deepEqual(opt, {
        iconUrl: 'img/icon.svg',
        message: 'foo',
        title: 'bar',
        type: 'basic'
      }, 'opt');
      assert.strictEqual(res, true, 'result');
    });
  });
});
