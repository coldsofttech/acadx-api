const TitleService = require('../../src/services/titles');

describe('Functional', () => {
    let service;

    beforeEach(() => {
        service = new TitleService();
    });

    test('GET /titles should return default titles on first call', async () => {
        const titles = await service.getTitles();
        expect(titles).toEqual(['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.']);
    });

    test('GET /titles should return same titles on subsequent calls', async () => {
        service.getTitles();
        const titles = await service.getTitles();
        expect(titles).toEqual(['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.']);
    });

    test('GET /titles should return title values after initialization', async () => {
        await service.getTitles();
        expect(service.titles).toEqual(['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.']);
    });

    test('GET /titles should return a promise that resolves to titles', async() => {
        await expect(service.getTitles()).resolves.toEqual(['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.']);
    });
});

describe('Performance', () => {
    let service;

    beforeEach(() => {
        service = new TitleService();
    });

    test('GET /titles should return response in less than 200ms', async () => {
        const start = performance.now();
        await service.getTitles();
        const end = performance.now();
        const duration = end - start;
        expect(duration).toBeLessThan(200);
    });
});

describe('Load', () => {
    let service;
    
    beforeEach(() => {
        service = new TitleService();
    });

    test('GET /titles handle multiple concurrent requests', async () => {
        const requests = []
        for (let i = 0; i < 1000; i++) {
            requests.push(service.getTitles());
        }
        
        const responses = await Promise.all(requests);
        responses.forEach(titles => {
            expect(titles).toEqual(['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.']);
        });
    });
});
