import { object, string } from 'yup';

import { EventType } from '../../model/eventTypes.js';
import { LinkEvent } from '../../model/linkEvent.js';

export class CreateLinkEvent {
    static #VALIDATION_SCHEMA = object().shape({
        linkId: string().trim().uuid().required(),
        type: string().trim().required().oneOf(Object.values(EventType)),
        metaInfo: object().default({}),
    });

    #linkEventRepo;

    constructor({ linkEventRepo }) {
        this.#linkEventRepo = linkEventRepo;
    }

    async execute(linkEventInputParams) {
        const validatedParams =
            await CreateLinkEvent.#VALIDATION_SCHEMA.validate(
                linkEventInputParams,
                { abortEarly: false }
            );

        const linkEvent = LinkEvent.createNew({
            ...validatedParams,
        });
        return this.#linkEventRepo.create(linkEvent);
    }
}
