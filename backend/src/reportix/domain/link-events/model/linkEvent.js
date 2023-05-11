/* eslint-disable no-underscore-dangle */
import { object, string, number, bool } from 'yup';
import { BaseEntity, NEW_ID } from '../../common/model/baseEntity.js';
import { EventType } from './eventTypes.js';

export class LinkEvent extends BaseEntity {
    static #isInternalConstructing = false;

    static #VALIDATION_SCHEMA = object().shape({
        linkId: string().trim().uuid().required(),
        type: string().trim().required().oneOf(Object.values(EventType)),
        createdAt: number().required(),
        metaInfo: object().default({}),
    });

    constructor(id, props) {
        if (!LinkEvent.#isInternalConstructing) {
            throw new TypeError('Invoking private constructor');
        }
        super(id, props);
    }

    static copy(linkEvent, updatedProps = {}) {
        return LinkEvent.create(
            updatedProps.id ? updatedProps.id : linkEvent.getId(),
            {
                ...linkEvent._props,
                ...updatedProps,
            }
        );
    }

    static createNew(props) {
        const currentDate = new Date().getTime();
        const actualProps = {
            ...props,
            createdAt: currentDate,
        };
        return LinkEvent.create(NEW_ID, actualProps);
    }

    static create(id, props) {
        const validatedProps = LinkEvent.#VALIDATION_SCHEMA.validateSync(
            props,
            {
                abortEarly: false,
            }
        );

        LinkEvent.#isInternalConstructing = true;
        const instance = new LinkEvent(id, {
            ...validatedProps,
        });
        LinkEvent.#isInternalConstructing = false;
        return instance;
    }

    getLinkId() {
        return this._props.linkId;
    }

    getType() {
        return this._props.type;
    }

    getMetaInfo() {
        return { ...this._props.metaInfo };
    }

    getCreatedAt() {
        return new Date(this._props.createdAt);
    }

    toJSON() {
        return {
            ...this.toDto(),
            createdAt: this.getCreatedAt(),
        };
    }
}
