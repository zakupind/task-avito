export class DBService {
    constructor() {
        this.SERVER = 'https://api.github.com';
        this.TOKEN = '7d6952f0034a4c82993b8c18cc742d309f51932a';
    }

    getData = async (url) => {
        await fetch(`${this.SERVER}?access_token=${this.TOKEN}`);
        const response = await fetch(url);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      }

    getSearchResult = (query) => {
        this.temp = `${this.SERVER}/search/repositories?q=${query}&sort=stars&order=desc&per_page=10`;
        return this.getData(this.temp) // ПОИСК
      }

    getNextPage = (page) => {
        return this.getData(`${this.temp}&page=${page}`); // pagination method
      }

    getPageReboot = (query, page) => {
      return this.getData(`${this.SERVER}/search/repositories?q=${query}&sort=stars&order=desc&per_page=10&page=${page}`);
    }

}


