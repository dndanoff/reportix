import { object, string, number } from 'yup';
import { ContentLink } from '../../model/contentLink.js';
import { ApiError } from '../../../common/service/error.js';

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
                { abortEarly: false, stripUnknown: true }
            );

        const existingContentLink = await this.#contentLinkRepo.getById(
            validatedParams.id
        );

        if (
            existingContentLink.getExpireAfter() ===
                validatedParams.expireAfter &&
            existingContentLink.getRecipient() === validatedParams.recipient
        ) {
            throw new ApiError({
                message: 'Cannot duplicate with exact same values.',
                statusCode: 400,
            });
        }

        const contentLink = ContentLink.createNew({
            ...validatedParams,
            company: existingContentLink.getCompany(),
            name: existingContentLink.getName(),
            sourceUrl: existingContentLink.getSourceUrl(),
        });

        return this.#contentLinkRepo.save(contentLink);
    }
}
