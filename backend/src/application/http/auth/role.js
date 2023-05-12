import { object, array, string, number } from 'yup';
import { allPermissions } from './permissions.js';
import { deepFreeze } from '../../../domain/common/service/utils.js';

class Role {
    static #VALIDATION_SCHEMA = object().shape({
        id: number().min(0).required(),
        name: string().trim().required(),
        permissions: array().of(string().trim().required()),
    });

    constructor({ id, name, permissions = [] }) {
        Role.#VALIDATION_SCHEMA.validateSync(
            { id, name, permissions },
            {
                abortEarly: false,
            }
        );

        this.id = id;
        this.name = name;
        this.permissions = permissions;
    }
}

export const Roles = deepFreeze({
    Anonymous: new Role({ id: 0, name: 'anonymous', permissions: [] }),
    Admin: new Role({ id: 1, name: 'admin', permissions: allPermissions }),
});
