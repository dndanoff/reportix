/* eslint-disable max-classes-per-file */
class CustomError extends Error {
    constructor({ msg, name, options }) {
        super(msg, options);
        if (this.constructor === CustomError) {
            throw new Error("Can't instantiate abstract class!");
        }
        this.name = name;
    }
}

export class AuthenticationError extends CustomError {
    constructor(msg = 'Authentication failed') {
        super({ msg, name: 'AuthenticationError' });
    }
}

export class AuthorizationError extends CustomError {
    constructor(msg = 'Authorization failed') {
        super({ msg, name: 'AuthorizationError' });
    }
}

export class UnknownOperation extends CustomError {
    constructor(msg = 'Uknown Operation') {
        super({ msg, name: 'UnknownOperation' });
    }
}
