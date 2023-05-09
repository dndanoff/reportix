import { string } from 'yup';

export class GetRelatedContentLinks {
    static #VALIDATION_SCHEMA = string().trim().email().required();

    #contentLinkRepo;

    constructor({ contentLinkRepo }) {
        this.#contentLinkRepo = contentLinkRepo;
    }

    async execute(recipientInput) {
        const { recipient } =
            await GetRelatedContentLinks.#VALIDATION_SCHEMA.validate(
                recipientInput
            );
        return this.#contentLinkRepo.getById(validatedId);
    }
}
