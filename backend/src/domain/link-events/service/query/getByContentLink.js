import { string } from 'yup';

export class GetLinkEventsByContentLink {
    static #VALIDATION_SCHEMA = string().trim().uuid().required();

    #linkEventRepo;

    constructor({ linkEventRepo }) {
        this.#linkEventRepo = linkEventRepo;
    }

    async execute(contentLinkIdInput) {
        const contentLinkId =
            await GetLinkEventsByContentLink.#VALIDATION_SCHEMA.validate(
                contentLinkIdInput
            );
        return this.#linkEventRepo.getByContentLink(contentLinkId);
    }
}
