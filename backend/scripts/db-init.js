import {
    DynamoDBClient,
    CreateTableCommand,
    ListTablesCommand,
    DeleteTableCommand,
} from '@aws-sdk/client-dynamodb';
import { config } from '../src/reportix/config.js';
import { logger } from '../src/reportix/logger.js';

const tableParams = [
    {
        TableName: 'CONTENT_LINKS',
        Projection: {
            ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
        },
        StreamSpecification: {
            StreamEnabled: false,
        },
        KeySchema: [
            {
                AttributeName: 'id',
                KeyType: 'HASH',
            },
        ],
        AttributeDefinitions: [
            {
                AttributeName: 'id',
                AttributeType: 'S',
            },
            {
                AttributeName: 'recipient',
                AttributeType: 'S',
            },
            {
                AttributeName: 'company',
                AttributeType: 'S',
            },
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'RecipientAndCompanyIndex',
                Projection: {
                    ProjectionType: 'ALL',
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1,
                },
                KeySchema: [
                    {
                        AttributeName: 'recipient',
                        KeyType: 'HASH',
                    },
                    {
                        AttributeName: 'company',
                        KeyType: 'RANGE',
                    },
                ],
            },
        ],
    },
    {
        TableName: 'LINK_EVENTS',
        Projection: {
            ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
        },
        StreamSpecification: {
            StreamEnabled: false,
        },
        KeySchema: [
            {
                AttributeName: 'id',
                KeyType: 'HASH',
            },
        ],
        AttributeDefinitions: [
            {
                AttributeName: 'id',
                AttributeType: 'S',
            },
            {
                AttributeName: 'linkId',
                AttributeType: 'S',
            },
            {
                AttributeName: 'type',
                AttributeType: 'S',
            },
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'LinkIdIndex',
                Projection: {
                    ProjectionType: 'ALL',
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1,
                },
                KeySchema: [
                    {
                        AttributeName: 'linkId',
                        KeyType: 'HASH',
                    },
                    {
                        AttributeName: 'type',
                        KeyType: 'RANGE',
                    },
                ],
            },
        ],
    },
];

const run = async () => {
    const dbClient = new DynamoDBClient({
        region: config.aws.region,
        endpoint: config.aws.endpoint,
    });
    try {
        const tableData = await dbClient.send(new ListTablesCommand({}));
        logger.info({
            msg: `Found the following ${
                tableData.TableNames.length
            } tables: ${tableData.TableNames.join('\n')}`,
        });
        for (const TableName of tableData.TableNames) {
            await dbClient.send(new DeleteTableCommand({ TableName }));
            logger.info({
                msg: `Deleted table: ${TableName}`,
                tableName: TableName,
            });
        }

        for (const params of tableParams) {
            await dbClient.send(new CreateTableCommand(params));
            logger.info({
                msg: `Created table: ${params.TableName}`,
                tableName: params.TableName,
            });
        }
    } catch (err) {
        logger.error({
            msg: 'Error during creation of table schema',
            err,
        });
    }
};

run();
