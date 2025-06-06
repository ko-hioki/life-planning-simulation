import type { LifePlan, StorageData } from '../types';

const STORAGE_KEY = 'lifePlanningSimulation';
const STORAGE_VERSION = '1.0.0';

/**
 * ローカルストレージでのデータ永続化管理
 */
export class StorageManager {
  /**
   * すべてのライフプランを取得
   */
  static getLifePlans(): LifePlan[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const parsedData: StorageData = JSON.parse(data);
      
      // バージョンチェック
      if (parsedData.version !== STORAGE_VERSION) {
        console.warn('Storage version mismatch, migrating data...');
        return this.migrateData(parsedData);
      }

      return parsedData.lifePlans.map(plan => ({
        ...plan,
        createdAt: new Date(plan.createdAt),
        updatedAt: new Date(plan.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading life plans from storage:', error);
      return [];
    }
  }

  /**
   * ライフプランを保存
   */
  static saveLifePlan(lifePlan: LifePlan): void {
    try {
      const existingPlans = this.getLifePlans();
      const updatedPlans = existingPlans.filter(p => p.id !== lifePlan.id);
      updatedPlans.push({
        ...lifePlan,
        updatedAt: new Date(),
      });

      const storageData: StorageData = {
        lifePlans: updatedPlans,
        lastUpdated: new Date(),
        version: STORAGE_VERSION,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    } catch (error) {
      console.error('Error saving life plan to storage:', error);
      throw new Error('ライフプランの保存に失敗しました');
    }
  }

  /**
   * ライフプランを削除
   */
  static deleteLifePlan(planId: string): void {
    try {
      const existingPlans = this.getLifePlans();
      const filteredPlans = existingPlans.filter(p => p.id !== planId);

      const storageData: StorageData = {
        lifePlans: filteredPlans,
        lastUpdated: new Date(),
        version: STORAGE_VERSION,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
    } catch (error) {
      console.error('Error deleting life plan from storage:', error);
      throw new Error('ライフプランの削除に失敗しました');
    }
  }

  /**
   * 特定のライフプランを取得
   */
  static getLifePlan(planId: string): LifePlan | null {
    const plans = this.getLifePlans();
    return plans.find(p => p.id === planId) || null;
  }

  /**
   * ライフプランを複製
   */
  static duplicateLifePlan(planId: string, newName: string): LifePlan {
    const originalPlan = this.getLifePlan(planId);
    if (!originalPlan) {
      throw new Error('複製対象のライフプランが見つかりません');
    }

    const duplicatedPlan: LifePlan = {
      ...originalPlan,
      id: this.generateId(),
      name: newName,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.saveLifePlan(duplicatedPlan);
    return duplicatedPlan;
  }

  /**
   * ストレージをクリア
   */
  static clearStorage(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * データエクスポート
   */
  static exportData(): string {
    const data = localStorage.getItem(STORAGE_KEY);
    return data || '';
  }

  /**
   * データインポート
   */
  static importData(jsonData: string): void {
    try {
      const parsedData: StorageData = JSON.parse(jsonData);
      
      // データ検証
      if (!this.validateStorageData(parsedData)) {
        throw new Error('無効なデータ形式です');
      }

      localStorage.setItem(STORAGE_KEY, jsonData);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('データのインポートに失敗しました');
    }
  }

  /**
   * ユニークIDを生成
   */
  static generateId(): string {
    return `lps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * データマイグレーション
   */
  private static migrateData(oldData: any): LifePlan[] {
    // 将来のバージョンアップ時のマイグレーション処理
    console.log('Migrating data from version:', oldData.version, 'to', STORAGE_VERSION);
    return oldData.lifePlans || [];
  }

  /**
   * ストレージデータの検証
   */
  private static validateStorageData(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      Array.isArray(data.lifePlans) &&
      typeof data.version === 'string'
    );
  }
}

/**
 * ファイルダウンロードヘルパー
 */
export const downloadFile = (content: string, filename: string, contentType: string = 'application/json') => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * ローカルストレージの容量チェック
 */
export const checkStorageQuota = (): { used: number; available: number; percentage: number } => {
  let used = 0;
  let available = 0;

  try {
    // 使用量計算
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length;
      }
    }

    // 利用可能容量の概算測定
    const testKey = 'storageQuotaTest';
    let testSize = 1024; // 1KB
    let maxSize = 0;

    while (testSize <= 10 * 1024 * 1024) { // 最大10MB まで測定
      try {
        localStorage.setItem(testKey, 'x'.repeat(testSize));
        localStorage.removeItem(testKey);
        maxSize = testSize;
        testSize *= 2;
      } catch {
        break;
      }
    }

    available = maxSize;
    const percentage = available > 0 ? (used / available) * 100 : 0;

    return { used, available, percentage };
  } catch (error) {
    console.error('Error checking storage quota:', error);
    return { used: 0, available: 0, percentage: 0 };
  }
};
