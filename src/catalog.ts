export type CatalogValue = string | { readonly [key: string]: CatalogValue };

export type Catalog = { readonly [key: string]: CatalogValue };

export type CatalogValidationIssue =
  | { readonly type: "missing_key"; readonly key: string }
  | { readonly type: "extra_key"; readonly key: string }
  | { readonly type: "missing_placeholder"; readonly key: string; readonly placeholder?: string }
  | { readonly type: "extra_placeholder"; readonly key: string; readonly placeholder?: string };

export function flattenCatalogKeys(catalog: Catalog): string[] {
  return flattenCatalog(catalog).map(([key]) => key);
}

export function validateCatalogKeyParity(
  baseCatalog: Catalog,
  targetCatalog: Catalog
): CatalogValidationIssue[] {
  const baseKeys = new Set(flattenCatalogKeys(baseCatalog));
  const targetKeys = new Set(flattenCatalogKeys(targetCatalog));

  return [
    ...findMissingValues(baseKeys, targetKeys).map((key) => ({
      type: "missing_key" as const,
      key,
    })),
    ...findMissingValues(targetKeys, baseKeys).map((key) => ({
      type: "extra_key" as const,
      key,
    })),
  ];
}

export function validateIcuPlaceholderParity(
  baseMessage: string,
  targetMessage: string
): CatalogValidationIssue[] {
  const basePlaceholders = new Set(extractIcuPlaceholderNames(baseMessage));
  const targetPlaceholders = new Set(extractIcuPlaceholderNames(targetMessage));

  return [
    ...findMissingValues(basePlaceholders, targetPlaceholders).map((key) => ({
      type: "missing_placeholder" as const,
      key,
    })),
    ...findMissingValues(targetPlaceholders, basePlaceholders).map((key) => ({
      type: "extra_placeholder" as const,
      key,
    })),
  ];
}

export function validateCatalogPlaceholderParity(
  baseCatalog: Catalog,
  targetCatalog: Catalog
): CatalogValidationIssue[] {
  const targetEntries = new Map(flattenCatalog(targetCatalog));

  return flattenCatalog(baseCatalog).flatMap(([key, baseMessage]) => {
    const targetMessage = targetEntries.get(key);

    if (typeof targetMessage !== "string") {
      return [];
    }

    return validateIcuPlaceholderParity(baseMessage, targetMessage).map((issue) => ({
      type: issue.type,
      key,
      placeholder: issue.key,
    }));
  });
}

function flattenCatalog(catalog: Catalog, prefix = ""): Array<[string, string]> {
  return Object.entries(catalog)
    .flatMap(([key, value]): Array<[string, string]> => {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "string") {
        return [[fullKey, value]];
      }

      if (isCatalog(value)) {
        return flattenCatalog(value, fullKey);
      }

      return [];
    })
    .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));
}

function isCatalog(value: CatalogValue): value is Catalog {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractIcuPlaceholderNames(message: string): string[] {
  const names = new Set<string>();
  let index = 0;

  while (index < message.length) {
    if (message[index] !== "{") {
      index += 1;
      continue;
    }

    const token = readBalancedBraceToken(message, index);
    if (!token) {
      index += 1;
      continue;
    }

    const name = token.token.slice(1, -1).trim().match(/^([A-Za-z][A-Za-z0-9_]*)/)?.[1];
    if (name) {
      names.add(name);
    }

    index = token.endIndex;
  }

  return [...names].sort();
}

interface BalancedBraceToken {
  readonly token: string;
  readonly endIndex: number;
}

function readBalancedBraceToken(message: string, startIndex: number): BalancedBraceToken | null {
  let depth = 0;

  for (let index = startIndex; index < message.length; index += 1) {
    if (message[index] === "{") {
      depth += 1;
    }

    if (message[index] === "}") {
      depth -= 1;

      if (depth === 0) {
        return {
          token: message.slice(startIndex, index + 1),
          endIndex: index + 1,
        };
      }
    }
  }

  return null;
}

function findMissingValues(left: Set<string>, right: Set<string>): string[] {
  return [...left].filter((value) => !right.has(value)).sort();
}
