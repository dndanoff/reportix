export const mockInstance = (c) => {
    const result = {};
    for (const key of Object.getOwnPropertyNames(c.prototype)) {
        result[key] = jest.fn(() => {
            throw new Error(`Not mocked method called: ${c.name}.${key}`);
        });
    }
    return result;
};
