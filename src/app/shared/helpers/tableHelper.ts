import { PageRequestResponseData } from '../models/PageRequestResponseData';

export class TableHelper {
  private _allColumnNames: string[] = [];

  get allColumnNames(): string[] {
    return this._allColumnNames;
  }

  set allColumnNames(value: string[]) {
    this._allColumnNames = value;
  }

  private _baseColumnNames: string[] = [];

  get baseColumnNames(): string[] {
    return this._baseColumnNames;
  }

  set baseColumnNames(value: string[]) {
    this._baseColumnNames = value;
  }

  nestedPropertyAccessor(item: any, path: string): unknown {
    return path
      .split('.')
      .reduce(
        (obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined),
        item,
      );
  }

  setBaseColumnNames(
    requestResponseData: PageRequestResponseData<any>,
    excludeColumns: string[] = [],
  ): void {
    this._baseColumnNames = this.getFlatKeys(
      requestResponseData.content[0],
      excludeColumns,
    );
  }

  setAllColumnNames(additionalColumns: string[]): void {
    this.allColumnNames = [...this._baseColumnNames, ...additionalColumns];
  }

  private getFlatKeys(
    obj: { [key: string]: any },
    excludeList: string[] = [],
  ): string[] {
    return Object.keys(obj).reduce((acc: string[], key: string) => {
      // If this key is in the exclude list, skip this key
      if (excludeList.includes(key)) {
        return acc;
      }

      if (
        typeof obj[key] === 'object' &&
        obj[key] !== null &&
        !(obj[key] instanceof Date) &&
        !Array.isArray(obj[key])
      ) {
        const nestedKeys = this.getFlatKeys(obj[key], excludeList).map(
          nestedKey => `${key}.${nestedKey}`,
        );
        acc = [...acc, ...nestedKeys];
      } else {
        acc.push(key);
      }
      return acc;
    }, []);
  }
}
