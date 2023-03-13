/* eslint-disable import/prefer-default-export */

import { Table } from '../services/dynamodb/index.js';
import config from '../config.js';

export function getTableName(table: Table): string {
  return `slackgpt-${config.NODE_ENV}-${table}`;
}
