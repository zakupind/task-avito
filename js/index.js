import { DBService } from './api.js';

const resultSearchList = document.querySelector('.result-search_list'),
      pagination = document.querySelector('.pagination'),

      searchForm = document.querySelector('.search__form'),
      searchInput = document.querySelector('.search_form-input'),
      resultSearchHead = document.querySelector('.result-search_head');

      let sessionPage = sessionStorage.getItem('numPage'),
          sessionQuery = sessionStorage.getItem('searchQuery');


let responseG = []; 
let numPage;

const renderRep = (response, target) => {

    resultSearchList.textContent = '';
    pagination.textContent = '';
  
    if (!response.total_count) {
    //   loading.remove();
      resultSearchHead.textContent = 'К сожалению по Вашему запросу ничего не найдено';
      return;
    }

    resultSearchHead.textContent = target ? target.textContent : `Результат поиска по запросу: ${sessionStorage.getItem('searchQuery')}`;

    response.items.forEach((item) => {
        const {name, stargazers_count, pushed_at, html_url} = item;
        responseG.push(item);

        let datePushed = new Date(pushed_at).toLocaleString('ru', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
    

        const cardRep = document.createElement('li');
        cardRep.classList.add('result-search_item');

        cardRep.innerHTML = `
        <span class="name-rep"><a href="#" class="name-rep-a">${name}</a></span>
        <div class="stars-container">
            <span class="number-stars">${stargazers_count}</span>
            <img class="stars-img" src="img/star.svg" alt="stars">
        </div>
        <div class="date-commit-wraper">
          <span class="date-commit__text">Дата последнего коммита</span>
          <span class="date-commit__date">${datePushed}</span>
        </div>
        <a class="link-git" href="${html_url}">${html_url}</a>`;

        resultSearchList.append(cardRep);
    })
    const nameRepA = document.querySelectorAll('.name-rep-a');

    const { total_count: pages } = response;

    renderPagination(pages);

    nameRepA.forEach((item) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        
        let name = item.textContent;

        responseG.forEach((item) => {
          if (item.name == name) {
            sessionStorage.setItem('url', item.url);
      
            document.location.href = 'rep.html';
          } 
        })
      })
    })


}


const renderPagination = (pages) => {
  let endPage = Math.floor(pages / 10);
    
  if (endPage > 100) {
      endPage = 100;
  }

  pagination.textContent = '';
  let page = sessionStorage.getItem('numPage');
  let a;
  let b;

  if ( endPage - page <= 3) {
    a = page - 5;
    b = endPage;
  } else {
    a = page - 2;
    b = parseInt(page) + 2;
  }

  if (pages > 1) {
    if (!page || page < 4) {
      for (let i = 1; i <= 5; i++) {
        pagination.innerHTML += `<li><a href="#" class="pagination-pages">${i}</a></li>`
      }
      pagination.innerHTML += `<li><a href="#" class="pagination-pages">${endPage}</a></li>`
    } else {
        pagination.innerHTML += `<li><a href="#" class="pagination-pages">1</a></li>`
      for (let i = a; i <= b; i++) {
        if (i == page) {
          pagination.innerHTML += `<li><a href="#" class="pagination-pages active">${i}</a></li>`
        } else {
          pagination.innerHTML += `<li><a href="#" class="pagination-pages">${i}</a></li>`
        }
      }
      if ( b != endPage) {
        pagination.innerHTML += `<li><a href="#" class="pagination-pages">${endPage}</a></li>`
      }
    }
  }
}


pagination.addEventListener('click', (event) => {
    event.preventDefault();
    const { target } = event;
    if (target.classList.contains('pagination-pages')) { // проверяем клик по li (по нумерации страниц)
        numPage = target.textContent;
        sessionStorage.setItem('numPage', numPage);
        new DBService().getPageReboot(sessionQuery, numPage) // передаем номер страницы
        .then(renderRep);
    }
  })

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
  
    const value = searchInput.value.trim();

    if (value == '') {
      resultSearchHead.textContent = 'Вы ничего не ввели';
    } else {
      sessionStorage.setItem('searchQuery', value)
      sessionStorage.setItem('numPage', 1);

      new DBService().getSearchResult(value)
            .then(renderRep);
    
      searchInput.value = ''; // очищает input поиска
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    
    if (sessionPage) {
        new DBService().getPageReboot(sessionQuery, sessionPage)
                .then(renderRep);
    } else if (sessionQuery) {
        new DBService().getSearchResult(sessionQuery)
                .then(renderRep);
    }

  });



