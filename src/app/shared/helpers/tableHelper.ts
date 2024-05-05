export class TableHelper {
  getFlatKeys(
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

  nestedPropertyAccessor(item: any, path: string): unknown {
    return path
      .split('.')
      .reduce(
        (obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : undefined),
        item,
      );
  }
}
