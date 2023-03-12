import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import config from '../../config.js';
import { prefixObjectKeys } from '../../utils/index.js';
import { Table } from './dynamodb.interface.js';

const client = new DynamoDBClient({
  region: config.AWS_REGION,
  ...(config.isDevelopment && {
    endpoint: config.AWS_ENDPOINT,
    credentials: {
      accessKeyId: config.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    },
  }),
});
const document = DynamoDBDocument.from(client);

export async function getItem<T>(
  table: Table,
  key: Partial<T>
): Promise<T | undefined> {
  const { Item } = await document.get({
    TableName: table,
    Key: key,
  });
  return Item as T | undefined;
}

export async function putItem<T extends Record<string, unknown>>(
  table: Table,
  data: T
) {
  await document.put({
    TableName: table,
    Item: data,
  });
}

export async function updateItem<T>(
  table: Table,
  key: Partial<T>,
  data: Partial<T>
) {
  await document.update({
    TableName: table,
    Key: key,
    UpdateExpression: `set ${Object.keys(data)
      .map((k) => `${k} = :${k}`)
      .join(', ')}`,
    ExpressionAttributeValues: prefixObjectKeys(data, ':'),
  });
}

export async function deleteItem<T>(table: Table, key: Partial<T>) {
  await document.delete({
    TableName: table,
    Key: key,
  });
}
