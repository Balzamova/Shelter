const firstPageBtn = document.querySelector('.firstPage');
const prevPageBtn = document.querySelector('.prevPage');
const numberBtn = document.querySelector('.numberPage');
const nextPageBtn = document.querySelector('.nextPage');
const lastPageBtn = document.querySelector('.lastPage');
const popupClosedBtn = document.querySelector('.popup__close');

const slider = document.querySelector('.pets');
let pets = []; 
let fullPetsList = []; //48 карточек = 8 шт*6 стр
let currentPage = 1;
let itemsPerPage = 8; //по умолчанию большой экран с 8 питомцами

const request = new XMLHttpRequest(); 
request.open('GET', './pets.json');  

request.onload = () => { 
    pets = JSON.parse(request.response); 

    fullPetsList = (() => {
        let tempArr = [];
        for (let i = 0; i < 6; i++) {
            const newPets = pets; //генерируем массив из случайных эл-тов (выборка по 8 pets)

            for (let j = pets.length; j > 0; j--) {
                let randInd = Math.floor(Math.random() * j); //берем рандомный индекс
                const randElem = newPets.splice(randInd, 1)[0]; //берем элемент из pets с рандомным индексом
                newPets.push(randElem); //пушим в новый массив 
            }
            tempArr = [...tempArr, ...newPets]; //получаем массив из 8 рандомно расположенных элементов 
        }
        return tempArr;
    })();

    fullPetsList = sort863(fullPetsList); //сортируем список с учетом 8-6-3 повторений

    createPets(fullPetsList); // создадим животных рандомно = 8
} 

const sort863 = (list) => {
    list = sort6recursively(list);
    return list;
}

const sort6recursively = (list) => {
    const length = list.length; //48 шт = все элементы

    for (let i = 0; i < (length / 6); i++) {
        const stepList = list.slice(i * 6, (i * 6) + 6); //берем шаги по 6 шт

        for (let j = 0; j < 6; j++) { //ищу первый дублируемый элемент (по имени)
            const duplicatedItem = stepList.find((item, ind) => {
                return item.name === stepList[j].name && (ind !== j);
            });

            if (duplicatedItem !== undefined) { //определяю в какой 8-ке находится первый дублируемый и ставлю его на первое место в 8-ке
                const ind = (i * 6) + j;
                const which8OfList = Math.trunc(ind / 8);
                const slider = list.splice(ind, 1)[0];
                list.splice(which8OfList * 8, 0, slider)

                sort6recursively(list);
            }
        }
    }
    return list;
}

request.send();

const createPets = (pets) => { 
    for (let i = 0; i < pets.length; i++) {
        slider.insertAdjacentHTML("beforeend", createElements(pets[i], i));
    }     
}

const createElements = (pet, i) => {  
    return `
    <div class="card">
        <img class="card__img" id="pet-photo" src="${pet.img}" alt="pet-photo">
        <p class="card__title" id="pet-name"> ${pet.name} </p>
        <button class="card__button" onclick="openPopBlock(${i})"> Learn More </button>
    </div> 

    <div class="popup__wrapper innactive">
        <div class="pets__popup innactive" id="pets__popup${[i]}">
            <button class="popup__close" onclick="closePopBlock(${i})"> x </button>
            <div class="popup__block">
                <img class="popup__img" src="${pet.img}" alt="${pet.name}">
                <div class="popup__info">
                    <div class="popup__title" id="pet-name">${pet.name}</div>
                    <div class="popup__subtitle">${pet.type} - ${pet.breed}</div>
                    <div class="pet-description">${pet.description}</div>
                    <ul class="popup__list">
                        <li class="popup__item">
                            <span> Age: </span><span class="pet__age">${pet.age}</span>
                        </li>
                        <li class="popup__item">
                            <span>Inoculations: </span><span class="pet__inoculations">${pet.inoculations}</span>
                        </li>
                        <li class="popup__item">
                            <span>Diseases: </span><span class="pet__diseases">${pet.diseases}</span>
                        </li>
                        <li class="popup__item">
                            <span> Parasites: </span><span class="pet__parasites">${pet.parasites}</span>
                        </li>
                    </ul>
                </div>                 
            </div>
        </div>
    </div>   
    `;
}

function openPopBlock(i) { 
    let activePet = document.querySelectorAll(`.pets__popup`)[i];
    let activeWrapper = document.querySelectorAll(".popup__wrapper")[i];

    activePet.classList.remove('innactive');
    activeWrapper.classList.remove('innactive');
    
    document.querySelector("body").classList.toggle('lock');
}

function closePopBlock(i) {     
    let activePet = document.querySelectorAll(`.pets__popup`)[i];
    let activeWrapper = document.querySelectorAll(".popup__wrapper")[i];

    activePet.classList.add('innactive');
    activeWrapper.classList.add('innactive');

    document.querySelector("body").classList.toggle('lock');
}

const checkItemsPerPage = () => {     //проверка количества страниц для загрузки в зависимости от размера экрана
    if (document.querySelector('body').offsetWidth > 767 && document.querySelector('body').offsetWidth < 1280) {
        itemsPerPage = 6;
    } else if (document.querySelector('body').offsetWidth <= 767) {
        itemsPerPage = 3;
    } else itemsPerPage = 8;
}

const checkBtnsDisabled = () => {
    if (currentPage === 1) {
        firstPageBtn.classList.add('disabled');
        prevPageBtn.classList.add('disabled');
    } else {
        firstPageBtn.classList.remove('disabled');
        prevPageBtn.classList.remove('disabled');
    }

    if (currentPage === fullPetsList.length / itemsPerPage) {
        lastPageBtn.classList.add('disabled');
        nextPageBtn.classList.add('disabled');
    } else {
        lastPageBtn.classList.remove('disabled');
        nextPageBtn.classList.remove('disabled');
    }
}

checkBtnsDisabled();

prevPageBtn.addEventListener('click', (e) => {
    checkItemsPerPage(); 

    if (currentPage > 1) currentPage--;
    numberBtn.textContent = currentPage;

    slider.style.top = `calc(0px - ${930 * (currentPage - 1)}px)`;
    
    checkBtnsDisabled();
});

nextPageBtn.addEventListener('click', (e) => {
    checkItemsPerPage(); 

    if (currentPage < fullPetsList.length / itemsPerPage) {
        currentPage++;
        numberBtn.textContent = currentPage;
    }

    slider.style.top = `calc(0px - ${930 * (currentPage -1)}px)`;
    slider.style.opacity = 1 ;

    checkBtnsDisabled();
});

firstPageBtn.addEventListener('click', (e) => {
    checkItemsPerPage();

    if (currentPage > 1) currentPage = 1;
    numberBtn.textContent = currentPage;

    slider.style.top = `calc(0px)`;

    checkBtnsDisabled();
});

lastPageBtn.addEventListener('click', (e) => {
    checkItemsPerPage(); 

    if (currentPage < fullPetsList.length / itemsPerPage) {
        currentPage = fullPetsList.length / itemsPerPage;
        numberBtn.textContent = currentPage;
    }
    slider.style.top = `calc(0px - ${930 * (currentPage -1)}px)`;
    checkBtnsDisabled();
});

document.querySelector('.header__burger').addEventListener('click', () => {
    document.querySelector('.header__burger').classList.toggle('active');
    document.querySelector('.header__nav').classList.toggle('active');
    document.querySelector('body').classList.toggle('lock');
});

document.querySelector('.header__item:nth-child(4n)').addEventListener('click', () => {
       document.querySelector('.header__burger').classList.remove('active');
    document.querySelector('.header__nav').classList.remove('active');
    document.querySelector('body').classList.remove('lock');
});