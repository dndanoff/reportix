/* eslint-disable no-underscore-dangle */
import { object, string, number, bool } from 'yup';
import { BaseEntity, NEW_ID } from '../../common/model/baseEntity.js';

export class ContentLink extends BaseEntity {
    static #isInternalConstructing = false;

    static ONE_DAY = 24 * 60 * 60 * 1000;

    static #VALIDATION_SCHEMA = object().shape({
        company: string().trim().required(),
        name: string().trim().required(),
        sourceUrl: string().trim().required(),
        recipient: string().trim().email().required(),
        expireAfter: number().default(-1),
        redirect: bool().default(false),
        createdAt: number().required(),
        updatedAt: number().required(),
    });

    constructor(id, props) {
        if (!ContentLink.#isInternalConstructing) {
            throw new TypeError('Invoking private constructor');
        }
        super(id, props);
    }

    static copy(contentLink, updatedProps = {}) {
        return ContentLink.create(
            updatedProps.id ? updatedProps.id : contentLink.getId(),
            {
                ...contentLink._props,
                ...updatedProps,
            }
        );
    }

    static createNew(props) {
        const currentDate = new Date().getTime();
        const actualProps = {
            ...props,
            createdAt: currentDate,
            updatedAt: currentDate,
        };
        return ContentLink.create(NEW_ID, actualProps);
    }

    static create(id, props) {
        const validatedProps = ContentLink.#VALIDATION_SCHEMA.validateSync(
            props,
            {
                abortEarly: false,
                stripUnknown: true,
            }
        );

        ContentLink.#isInternalConstructing = true;
        const instance = new ContentLink(id, {
            ...validatedProps,
        });
        ContentLink.#isInternalConstructing = false;
        return instance;
    }

    getCompany() {
        return this._props.company;
    }

    getName() {
        return this._props.name;
    }

    getSourceUrl() {
        return this._props.sourceUrl;
    }

    getExpireAfter() {
        return this._props.expireAfter;
    }

    getRecipient() {
        return this._props.recipient;
    }

    getCreatedAt() {
        return new Date(this._props.createdAt);
    }

    getUpdatedAt() {
        return new Date(this._props.updatedAt);
    }

    isRedirect() {
        return this._props.redirect;
    }

    isExpired() {
        const currentDate = new Date().getTime();
        return (
            this._props.createdAt +
                this._props.expireAfter * ContentLink.ONE_DAY <
            currentDate
        );
    }

    toJSON() {
        return {
            ...this.toDto(),
            createdAt: this.getCreatedAt(),
            updatedAt: this.getUpdatedAt(),
        };
    }
}
