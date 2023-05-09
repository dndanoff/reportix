import { bool, object, string, number } from 'yup';

import { ContentLink } from '../../model/contentLink.js';

export class CreateContentLink {
    static #VALIDATION_SCHEMA = object().shape({
        company: string().trim().required(),
        name: string().trim().required(),
        sourceUrl: string().trim().required(),
        recipient: string().trim().email().required(),
        redirect: bool().default(false),
        expireAfter: number().default(-1),
    });

    #contentLinkRepo;

    constructor({ contentLinkRepo }) {
        this.#contentLinkRepo = contentLinkRepo;
    }

    async execute(contentLinkInputParams) {
        const valdiatedParams =
            await CreateContentLink.#VALIDATION_SCHEMA.validate(
                contentLinkInputParams,
                { abortEarly: false }
            );

        const contentLink = ContentLink.createNew({
            ...valdiatedParams,
        });

        return this.#contentLinkRepo.save(contentLink);
    }
}
