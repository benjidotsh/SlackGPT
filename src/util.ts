export const parseSlackMessage = (message: string): string =>
  message
    .replace(/<@[UW][A-Z0-9]{2,}>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
