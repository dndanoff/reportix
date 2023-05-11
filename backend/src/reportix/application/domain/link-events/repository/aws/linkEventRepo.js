import { v4 as uuid } from 'uuid';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

import { LinkEvent } from '../../../../../domain/link-events/model/linkEvent.js';

export class LinkEventRepo {
    #dbClient;
    constructor(dbClient) {
        this.#dbClient = dbClient;
    }

    async getByContentLink(contentLinkId) {
        const client = this.#dbClient.unwrap();
        const params = {
            TableName: 'LINK_EVENTS',
            IndexName: 'LinkIdIndex',
            KeyConditionExpression: '#field_linkId = :value_linkId',
            ExpressionAttributeNames: { '#field_linkId': 'linkId' },
            ExpressionAttributeValues: { ':value_linkId': contentLinkId },
        };
        const data = await client.send(new QueryCommand(params));
        return data.Items.map((item) =>
            LinkEventRepo.#convertItemToLinkEvent(item)
        );
    }

    async create(linkEvent) {
        const event = LinkEvent.copy(linkEvent, { id: uuid() });
        await this.#dbClient.create({
            tableName: 'LINK_EVENTS',
            item: event.toDto(),
            pkName: 'id',
        });

        return event;
    }

    static #convertItemToLinkEvent(item) {
        const { id, ...props } = { ...item };
        return LinkEvent.create(id, props);
    }
}
