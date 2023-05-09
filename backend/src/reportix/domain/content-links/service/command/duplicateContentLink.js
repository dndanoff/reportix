import { object, string, number } from 'yup';
import { ContentLink } from '../../model/contentLink.js';

export class DuplicateContentLink {
    static #VALIDATION_SCHEMA = object().shape({
        id: string().trim().required(),
        recipient: string().trim().email().required(),
        expireAfter: number().default(-1),
    });

    #contentLinkRepo;

    constructor({ contentLinkRepo }) {
        this.#contentLinkRepo = contentLinkRepo;
    }

    async execute(contentLinkInputParams) {
        const validatedParams =
            await DuplicateContentLink.#VALIDATION_SCHEMA.validate(
                contentLinkInputParams,
                { abortEarly: false }
            );

        const existingContentLink = this.#contentLinkRepo.getById(
            validatedParams.id
        );

        const contentLink = ContentLink.createNew({
            ...validatedParams,
            company: existingContentLink.getCompany(),
            name: existingContentLink.getName(),
            sourceUrl: existingContentLink.getSourceUrl(),
        });

        return this.#contentLinkRepo.save(contentLink);
    }
}
