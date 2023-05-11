import { object, string, bool, number } from 'yup';
import { ContentLink } from '../../model/contentLink.js';

export class UpdateContentLink {
    static #VALIDATION_SCHEMA = object().shape({
        id: string().trim().uuid().required(),
        company: string().trim().required(),
        name: string().trim().required(),
        sourceUrl: string().trim().required(),
        recipient: string().trim().email().required(),
        expireAfter: number().default(-1),
    });

    #contentLinkRepo;

    constructor({ contentLinkRepo }) {
        this.#contentLinkRepo = contentLinkRepo;
    }

    async execute(contentLinkInputParams) {
        const validatedParams =
            await UpdateContentLink.#VALIDATION_SCHEMA.validate(
                contentLinkInputParams,
                { abortEarly: false, stripUnknown: true }
            );

        const existingContentLink = await this.#contentLinkRepo.getById(
            validatedParams.id
        );

        const contentLink = ContentLink.copy(existingContentLink, {
            ...validatedParams,
            updatedAt: new Date().getTime(),
        });

        return this.#contentLinkRepo.save(contentLink);
    }
}
