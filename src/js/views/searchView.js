import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {elements.searchInput.value = '';};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resArr = Array.from(document.querySelectorAll('.results__link--active'));
    resArr.forEach(e => {
        e.classList.remove('results__link--active');
    });
    
    document.querySelector(`a[href*="#${id}"]`).classList.add('results__link--active');
}

const limitRecipeTitle = (title, limit = 20) => {
    if(title.length > limit){
        const newTitle = [];
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length + 1 <= limit){
                newTitle.push(cur);
                return acc + cur.length + 1;
            }
        }, 0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

const renderRecipe = recipe => {
    const markup = `<li>
                        <a class="results__link" href="#${recipe.recipe_id}">
                            <figure class="results__fig">
                                <img src="${recipe.image_url}" alt="${recipe.title}">
                            </figure>
                            <div class="results__data">
                                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                                <p class="results__author">${recipe.publisher}</p>
                            </div>
                        </a>
                    </li>`;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// type is either 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page-1 : page + 1}</span>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults/resPerPage);
    let button;
    if (page === 1 && pages > 1){
        // Only button to go to the next page
        button = createButton(page, 'next');
    } else if (page === pages && pages > 1) {
        // Only button to go to the previous page
        button = createButton(page, 'prev');
    } else {
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    }
    
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // render result of the current page
    const start = (page-1) * resPerPage;
    const end = page * resPerPage;
    
    recipes.slice(start,end).forEach(renderRecipe);
    
    //render the pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};