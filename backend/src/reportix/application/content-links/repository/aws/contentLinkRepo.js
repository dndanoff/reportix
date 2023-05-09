import { v4 as uuid } from 'uuid';

import { ContentLink } from '../../../../domain/content-links/model/contentLink.js';

export class ContentLinkRepo {
    #dbClient;
    constructor(dbClient) {
        this.#dbClient = dbClient;
    }

    async getAll() {
        const items = await this.#dbClient.getAll({
            tableName: 'CONTENT_LINKS',
        });

        return items.map((item) =>
            ContentLinkRepo.#convertItemToContentLink(item)
        );
    }

    async getById(id) {
        const item = await this.#dbClient.getById({
            tableName: 'CONTENT_LINKS',
            pk: id,
        });

        return ContentLinkRepo.#convertItemToContentLink(item);
    }

    async save(contentLink) {
        if (contentLink.isNew()) {
            return this.#create(contentLink);
        }

        return this.#update(contentLink);
    }

    async #create(contentLink) {
        const link = ContentLink.copy(contentLink, { id: uuid() });
        await this.#dbClient.create({
            tableName: 'CONTENT_LINKS',
            item: link.toDto(),
            pkName: 'id',
        });

        return link;
    }

    async #update(contentLink) {
        await this.#dbClient.update({
            tableName: 'CONTENT_LINKS',
            item: contentLink.toDto(),
            pkName: 'id',
        });

        return contentLink;
    }

    static #convertItemToContentLink(item) {
        const { id, ...props } = { ...item };
        return ContentLink.create(id, props);
    }
}
