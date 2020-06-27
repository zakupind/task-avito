import { DBService } from './api.js'

const nameReposit = document.querySelector('.page-repositorie__name'),
      description = document.querySelector('.page-repositorie__description'),
      numStars = document.querySelector('.stars-container__num-stars'),
      dateCommit = document.querySelector('.page-repositorie__date-commit'),
      listLanguage = document.querySelector('.page-repositorie__list-language'),
      nickname = document.querySelector('.repositorie-autor__nickname'),
      avatar = document.querySelector('.repositorie-autor__avatar'),
      url = sessionStorage.getItem('url'),
      contributorsList = document.querySelector('.contributors__list'),
      back = document.querySelector('.back');

let contributors_url;

back.addEventListener('click', () => {
  document.location.href = 'index.html';
})

  const renderCardRep = (response) => {
    let datePushed = new Date(response.pushed_at).toLocaleString('ru', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    nickname.textContent = response.owner.login;
    avatar.src = response.owner.avatar_url;
    nameReposit.textContent = response.name;
    description.textContent = response.description;
    numStars.textContent = response.stargazers_count;
    dateCommit.textContent = datePushed;
    listLanguage.textContent = response.language;

    
    contributors_url = response.contributors_url;
    new DBService().getData(contributors_url).then(renderContributors);
  }

  const renderContributors = (response) => {
      let i = 0;
      response.forEach((item, i) => {
        if (i < 10) {
          const { login, avatar_url, html_url} = item;

          const cardContributor = document.createElement('li');
          cardContributor.classList.add('contributors__item');

          cardContributor.innerHTML = `
          <img src="${avatar_url}" alt="${login}" class="contributors-item__avatar">
          <span class="contributors-item__login">
            <a href="${html_url}" class="contributors-item__login_link">${login}</a>
          </span>`;

          contributorsList.append(cardContributor);

          i++;
        }
      })
  }

  new DBService().getData(url).then(renderCardRep);
 