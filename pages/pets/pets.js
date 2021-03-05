const firstPageBtn = document.querySelector('.firstPage');
const prevPageBtn = document.querySelector('.prevPage');
const numberBtn = document.querySelector('.numberPage');
const nextPageBtn = document.querySelector('.nextPage');
const lastPageBtn = document.querySelector('.lastPage');
const popupClosedBtn = document.querySelector('.popup__close');

let pets = [];
let fullPetsList = []; //все 48 животных = 8*6 стр
let currentPage = 1;
let itemsPerPage = 8; //по умолчанию большой экран с 8 питомцами


const request = new XMLHttpRequest(); //запрос к списку JSON
request.open('GET', './pets.json'); //открыть файл JSON 
request.onload = () => { //посмотреть, что придет в ответе
    pets = JSON.parse(request.response); //если посмотреть в консоли, увидим массив объектов, распакованный из JSON

    fullPetsList = (() => {
        let tempArr = [];
        for (let i = 0; i < 6; i++) {
            const newPets = pets; //генерируем массив из случайных эл-тов (выборка 8)

            for (let j = pets.length; j > 0; j--) {
                let randInd = Math.floor(Math.random() * j); //берем рандомный индекс
                const randElem = newPets.splice(randInd, 1)[0]; //берем элемент из pets с рандомным индексом
                newPets.push(randElem); //пушим в новый массив 
            }
            tempArr = [...tempArr, ...newPets]; //получаем массив из 8 рандомно расположенных элементов 
        }
        return tempArr;
    })();

    fullPetsList = sort863(fullPetsList); //сортируем список с учетом 8-6-3 неповторений

    createPets(fullPetsList); // создадим животных рандом = 8

    for (let i = 0; i < (fullPetsList.length / 6); i++) { //проверяю и подсвечиваю совпадения 6-рок на границах 8-рок
        const stepList = fullPetsList.slice(i * 6, (i * 6) + 6);

        for (let j = 0; j < 6; j++) {
            stepList.forEach((item, ind) => {
                if (item.name === stepList[j].name && (ind !== j)) {
                    document.querySelector('#pets').children[(i * 6) + j].style.border = '5px solid red';
                }
            })
        }
    }
}

request.send();

const createPets = (petsList) => {
    const elem = document.querySelector('.pets');
    elem.innerHTML += createElements(petsList);
   //  console.log(elem);
}

const createElements = (petsList) => {
    let str = ''; //создаем строку, циклом заполняем ее картинками с животными
    for (let i = 0; i < petsList.length; i++) {
        str += `
        <div class="card">
        <img class="card__img" id="pet-photo" src="${petsList[i].img}" alt="pet-photo">
        <p class="card__title" id="pet-name"> ${petsList[i].name} </p>
        <button class="card__button"> Learn More </button>
        </div> `;
    }
    return str; //возвращаем строку с животными
}

const sort863 = (list) => {
    list = sort6recursively(list);
    return list;
}

const sort6recursively = (list) => {
    const length = list.length; //48 шт - все элементы

    for (let i = 0; i < (length / 6); i++) {
        const stepList = list.slice(i * 6, (i * 6) + 6); //берем шаги по 6 шт

        for (let j = 0; j < 6; j++) { //ищу первый дублируемый элемент (по имени)
            const duplicatedItem = stepList.find((item, ind) => {
                return item.name === stepList[j].name && (ind !== j);
            });

            if (duplicatedItem !== undefined) { //определяю в какой 8-ке находится первый дублируемый и ставлю его на первое место в 8-ке
                const ind = (i * 6) + j;
                const which8OfList = Math.trunc(ind / 8);

                const elem = list.splice(ind, 1)[0];
                list.splice(which8OfList * 8, 0, elem)

                sort6recursively(list);
            }
        }
    }
    return list;
}

const checkItemsPerPage = () => {     //проверка количества страниц для загрузки в зависимости от размера экрана
    if (document.querySelector('body').offsetWidth > 768 && document.querySelector('body').offsetWidth < 1280) {
        itemsPerPage = 6;
    } else if (document.querySelector('body').offsetWidth <= 768) {
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

    document.querySelector('.pets').style.top = `calc(0px - ${930 * (currentPage - 1)}px)`;
    
    checkBtnsDisabled();
});

nextPageBtn.addEventListener('click', (e) => {
    checkItemsPerPage(); 

    if (currentPage < fullPetsList.length / itemsPerPage) {
        currentPage++;
        numberBtn.textContent = currentPage;
    }
    document.querySelector('.pets').style.top = `calc(0px - ${930 * (currentPage -1)}px)`;

    checkBtnsDisabled();
});

firstPageBtn.addEventListener('click', (e) => {
    checkItemsPerPage();

    if (currentPage > 1) currentPage = 1;
    numberBtn.textContent = currentPage;

    document.querySelector('.pets').style.top = `calc(0px)`;

    checkBtnsDisabled();
});

lastPageBtn.addEventListener('click', (e) => {
    checkItemsPerPage(); 

    if (currentPage < fullPetsList.length / itemsPerPage) {
        currentPage = fullPetsList.length / itemsPerPage;
        numberBtn.textContent = currentPage;
    }
    document.querySelector('.pets').style.top = `calc(0px - ${930 * (currentPage -1)}px)`;
    checkBtnsDisabled();
});

