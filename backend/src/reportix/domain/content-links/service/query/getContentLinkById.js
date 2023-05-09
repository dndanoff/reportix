import { string } from 'yup';

export class GetContentLinkById {
    static #VALIDATION_SCHEMA = string().trim().required();

    #contentLinkRepo;

    constructor({ contentLinkRepo }) {
        this.#contentLinkRepo = contentLinkRepo;
    }

    async execute(id) {
        const { validatedId } =
            await GetContentLinkById.#VALIDATION_SCHEMA.validate(id);
        return this.#contentLinkRepo.getById(validatedId);
    }
}
