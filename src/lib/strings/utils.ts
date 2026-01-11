/**
 * Capitalizes the first letter of every word in a string.
 *
 * @param str - The input string.
 * @returns The title-cased string.
 *
 * @example
 * capitalizeAll("hello world"); // "Hello World"
 */
export function capitalizeAll(str: string): string {
  return str.replace(
    /(^|\s)(\S)/g,
    (_, space, char) => space + char.toUpperCase(),
  );
}

/**
 * Capitalizes the first character of a string.
 *
 * @param str - The input string.
 * @returns The string with the first character uppercased.
 *
 * @example
 * capitalize("typescript"); // "Typescript"
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Pads a string evenly on both sides until it reaches the desired length.
 *
 * @param str - The input string.
 * @param length - Desired total length.
 * @param pad - The character/string used as padding (default: space).
 * @returns The padded string centered with the given padding.
 *
 * @example
 * repeatPad("TS", 6, "-"); // "--TS--"
 */
export function repeatPad(str: string, length: number, pad = ' '): string {
  const total = Math.max(length - str.length, 0);
  const left = Math.floor(total / 2);
  const right = total - left;
  return pad.repeat(left) + str + pad.repeat(right);
}

/**
 * Reverses the characters in a string.
 *
 * @param str - The input string.
 * @returns The reversed string.
 *
 * @example
 * reverseString("TypeScript"); // "tpircSpeyT"
 */
export function reverseString(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Converts a string to camelCase.
 *
 * Handles acronyms properly, ensuring that something like
 * "XMLHttpRequest" becomes "xmlHttpRequest".
 *
 * @param str - The input string.
 * @returns The camelCased string.
 *
 * @example
 * toCamelCase("hello world-example"); // "helloWorldExample"
 * toCamelCase("XMLHttpRequest"); // "xmlHttpRequest"
 */
export function toCamelCase(str: string): string {
  const result = str
    // Split acronym groups into proper boundaries
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    // Split between lowercase/digit and uppercase
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    // Normalize spaces/underscores/dashes
    .replace(/[-_\s]+/g, ' ')
    // Lowercase everything to start clean
    .toLowerCase()
    // Capitalize first letter of each "word" after the first
    .replace(/\s+(\w)/g, (_, c) => c.toUpperCase())
    // Remove any remaining spaces and trim
    .replace(/\s+/g, '')
    .trim();

  // Ensure first character is lowercase for camelCase
  return result.charAt(0).toLowerCase() + result.slice(1);
}

/**
 * Converts a string to kebab-case.
 *
 * Handles acronyms and consecutive uppercase letters properly.
 * Example:
 *   "XMLHttpRequest" -> "xml-http-request"
 *
 * @param str - The input string.
 * @returns The kebab-cased string.
 *
 * @example
 * toKebabCase("Hello World Again"); // "hello-world-again"
 * toKebabCase("XMLHttpRequest"); // "xml-http-request"
 */
export function toKebabCase(str: string): string {
  return (
    str
      // Split acronym groups (e.g. "XMLHttp" -> "XML-Http")
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
      // Split between a lowercase/digit and an uppercase (e.g. "testHTTP" -> "test-HTTP")
      .replace(/([a-z\d])([A-Z])/g, '$1-$2')
      // Replace spaces and underscores with hyphens
      .replace(/[\s_]+/g, '-')
      .toLowerCase()
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, '')
  );
}

/**
 * Converts a string to PascalCase.
 *
 * Handles acronyms properly, ensuring that something like
 * "XMLHttpRequest" becomes "XmlHttpRequest".
 *
 * @param str - The input string.
 * @returns The PascalCased string.
 *
 * @example
 * toPascalCase("hello world-example"); // "HelloWorldExample"
 * toPascalCase("XMLHttpRequest"); // "XmlHttpRequest"
 */
export function toPascalCase(str: string): string {
  return (
    str
      // Split acronym groups into proper boundaries
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
      // Split between lowercase/digit and uppercase
      .replace(/([a-z\d])([A-Z])/g, '$1 $2')
      // Normalize spaces/underscores/dashes
      .replace(/[-_\s]+/g, ' ')
      // Lowercase all to normalize
      .toLowerCase()
      // Capitalize every word
      .replace(/\b\w/g, (c) => c.toUpperCase())
      // Remove spaces
      .replace(/\s+/g, '')
  );
}

/**
 * Converts a string to snake_case.
 *
 * Handles acronyms and consecutive uppercase letters properly.
 * Example:
 *   "XMLHttpRequest" -> "xml_http_request"
 *
 * @param str - The input string.
 * @returns The snake_cased string.
 *
 * @example
 * toSnakeCase("Hello World"); // "hello_world"
 * toSnakeCase("XMLHttpRequest"); // "xml_http_request"
 */
export function toSnakeCase(str: string): string {
  return (
    str
      // Split acronym groups (e.g. "XMLHttp" -> "XML_Http")
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
      // Split between a lowercase/digit and an uppercase (e.g. "testHTTP" -> "test_HTTP")
      .replace(/([a-z\d])([A-Z])/g, '$1_$2')
      // Replace spaces and dashes with underscores
      .replace(/[\s-]+/g, '_')
      .toLowerCase()
      // Remove leading and trailing underscores
      .replace(/^_+|_+$/g, '')
  );
}

/**
 * Truncates a string to a given length and appends an ellipsis ("...") if necessary.
 *
 * @param str - The input string.
 * @param length - The maximum length of the string.
 * @returns The truncated string with "..." if it exceeded the limit.
 *
 * @example
 * truncate("Hello TypeScript World", 10); // "Hello Type..."
 */
export function truncateString(str: string, length: number): string {
  return str.length > length ? `${str.slice(0, length)}...` : str;
}
