import { localStorageUtil } from '@/app/shared/utils/storage';

describe('存储工具', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('set 和 get 应正确读写对象数据', () => {
    const key = 'ut_storage_object';
    const value = { city: '上海', temp: 26 };

    localStorageUtil.set(key, value);
    const result = localStorageUtil.get(key, { city: '', temp: 0 });

    expect(result).toEqual(value);
  });

  it('键不存在时 get 应返回默认值', () => {
    const result = localStorageUtil.get('ut_storage_missing', { ok: true });
    expect(result).toEqual({ ok: true });
  });

  it('数据无法解析时 get 应返回默认值', () => {
    const key = 'ut_storage_invalid_json';
    const consoleErrorSpy = spyOn(console, 'error').and.stub();
    localStorage.setItem(key, '{invalid-json');

    const result = localStorageUtil.get(key, { fallback: 1 });

    expect(result).toEqual({ fallback: 1 });
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('remove 应删除指定键', () => {
    const key = 'ut_storage_remove';
    localStorageUtil.set(key, { value: 1 });

    localStorageUtil.remove(key);

    expect(localStorage.getItem(key)).toBeNull();
  });

  it('clear 应清空全部键', () => {
    localStorageUtil.set('ut_storage_clear_1', 1);
    localStorageUtil.set('ut_storage_clear_2', 2);

    localStorageUtil.clear();

    expect(localStorage.length).toBe(0);
  });
});
