import { deepFreeze } from '../../../domain/common/service/utils.js';

export const allPermissions = deepFreeze(['links.read', 'links.update']);
export const checkPermission = (perm, permissions) => {
    for (current of permissions) {
        if (perm === current) {
            return true;
        }
    }

    return false;
};
