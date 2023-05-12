import { ValidationError } from 'yup';
import { mockInstance } from '../../../../../../tests/mocks.js';
import { CreateContentLink } from '../createContentLink.js';
import { ContentLinkRepo } from '../../../../application/repository/aws/contentLinkRepo.js';

const testSetup = (contentLinkRepo = mockInstance(ContentLinkRepo)) => {
    const objUnderTest = new CreateContentLink({
        contentLinkRepo,
    });
    return { objUnderTest, contentLinkRepo };
};

describe('CreateContentLink', () => {
    it('should throw validation error when recipient is missing', async () => {
        const { objUnderTest } = testSetup();

        const res = objUnderTest.execute({
            company: 'Company A',
            sourceUrl: 'http://www.udemy.com/courses/aws-saa-doe',
            name: '2023 Q1 Report',
            expireAfter: 90,
        });

        await expect(res).rejects.toThrow(ValidationError);
    });
});
