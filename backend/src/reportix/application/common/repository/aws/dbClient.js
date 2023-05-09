import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    ScanCommand,
    UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

import { config } from '../../../../config.js';

const marshallOptions = {
    // Whether to automatically convert empty strings, blobs, and sets to `null`.
    convertEmptyValues: false, // false, by default.
    // Whether to remove undefined values while marshalling.
    removeUndefinedValues: false, // false, by default.
    // Whether to convert typeof object to map attribute.
    convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
    // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
    wrapNumbers: false, // false, by default.
};

export class DbClient {
    #client;

    unwrap() {
        return this.#client;
    }

    constructor() {
        const client = new DynamoDBClient({
            region: config.aws.region,
            endpoint: config.aws.endpoint,
        });

        this.#client = DynamoDBDocumentClient.from(client, {
            marshallOptions,
            unmarshallOptions,
        });
    }

    async getAll({ tableName }) {
        const params = { TableName: tableName };
        const data = await this.#client.send(new ScanCommand(params));

        return data.Items ?? [];
    }

    async getById({ tableName, pkName, pkValue }) {
        const params = {
            TableName: tableName,
            Key: {
                [pkName]: pkValue,
            },
        };
        const data = await this.#client.send(new GetCommand(params));
        return data.Item;
    }

    async create({ tableName, item }) {
        const params = {
            TableName: tableName,
            Item: { ...item },
        };
        return this.#client.send(new PutCommand(params));
    }

    async update({ tableName, item, pkName }) {
        const itemKeys = Object.keys(item).filter((k) => k !== pkName);
        const params = {
            TableName: tableName,
            UpdateExpression: `SET ${itemKeys
                .map((k) => `#field_${k} = :value_${k}`)
                .join(', ')}`,
            ExpressionAttributeNames: itemKeys.reduce(
                (accumulator, k) => ({
                    ...accumulator,
                    [`#field_${k}`]: k,
                }),
                {}
            ),
            ExpressionAttributeValues: itemKeys.reduce(
                (accumulator, k) => ({
                    ...accumulator,
                    [`:value_${k}`]: item[k],
                }),
                {}
            ),
            Key: {
                [pkName]: item[pkName],
            },
            ReturnValues: 'ALL_NEW',
        };
        return this.#client.send(new UpdateCommand(params));
    }
}
