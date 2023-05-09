import { object, string } from 'yup';
import { Roles } from './role.js';
import { deepFreeze } from '../../../domain/common/service/utils.js';

export class UserPrinciple {
    static #VALIDATION_SCHEMA = object().shape({
        username: string().trim().required(),
        role: object().oneOf(Object.values(Roles)),
    });

    constructor({ username, role = Roles.Anonymous }) {
        UserPrinciple.#VALIDATION_SCHEMA.validateSync(
            { username, role },
            {
                abortEarly: false,
            }
        );
        this.username = username;
        this.role = role;
        deepFreeze(this);
    }
}
