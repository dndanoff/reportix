import { string } from 'yup';
import { EventType } from '../../../link-events/model/eventTypes.js';

export class GetContentLinkById {
    static #VALIDATION_SCHEMA = string().trim().uuid().required();

    #contentLinkRepo;
    #createLinkEventService;

    constructor({ contentLinkRepo, createLinkEventService }) {
        this.#contentLinkRepo = contentLinkRepo;
        this.#createLinkEventService = createLinkEventService;
    }

    async execute(id, metaInfo) {
        await this.#createLinkEventService.execute({
            linkId: id,
            type: EventType.View,
            metaInfo,
        });
        const validatedId =
            await GetContentLinkById.#VALIDATION_SCHEMA.validate(id);
        return this.#contentLinkRepo.getById(validatedId);
    }
}
