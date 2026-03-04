/**
 * 存储工具
 */
const createStorage = (storage: Storage) => {
  return {
    /**
     * @description 保存数据到本地存储
     * @template T -数据类型
     * @param {string} key -存储键名
     * @param {T} value -存储值
     */
    set<T>(key: string, value: T) {
      try {
        storage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error(`${storage} sava error:`, e);
      }
    },
    /**
     * @description 从本地存储获取数据
     * @template T -数据类型
     * @param {string} key -存储键名
     * @param {T} defaultValue -默认值
     * @returns {T} 获取到的数据
     */
    get<T>(key: string, defaultValue: T) {
      const value = storage.getItem(key);
      if (!value) return defaultValue;
      try {
        return JSON.parse(value) as T;
      } catch (e) {
        console.error(`${storage} parse error:`, e);
        return defaultValue;
      }
    },
    /**
     * @description 移除指定键的数据
     * @param {string} key -存储键名
     */
    remove(key: string) {
      storage.removeItem(key);
    },
    /**
     * @description 清除所有本地存储
     */
    clear() {
      storage.clear();
    },
  };
};

export const localStorageUtil = createStorage(localStorage);
export const sessionStorageUtil = createStorage(sessionStorage);
