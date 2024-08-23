class TitleService {
    constructor() {
        this.titles = null
    }

    async getTitles() {
        if (this.titles == null) {
            this.titles = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.']
        }
        
        return this.titles
    }
}

module.exports = TitleService;
