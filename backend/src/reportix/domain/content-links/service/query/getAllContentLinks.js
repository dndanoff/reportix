export class GetAllContentLinks {
    #contentLinkRepo;

    constructor({ contentLinkRepo }) {
        this.#contentLinkRepo = contentLinkRepo;
    }

    async execute() {
        return this.#contentLinkRepo.getAll(validatedId);
    }
}
