const prevPageBtn = document.querySelector('.prevPage');
const nextPageBtn = document.querySelector('.nextPage');
const popupClosedBtn = document.querySelector('.popup__close');
const slider = document.querySelector('.pets');
let pets = []; 
let fullPetsList = []; 
let currentPage = 1;
let itemsPerPage = 3; 

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
    const length = list.length; 

    for (let i = 0; i < (length / 6); i++) {
        const stepList = list.slice(i * 6, (i * 6) + 6);

        for (let j = 0; j < 6; j++) { 
            const duplicatedItem = stepList.find((item, ind) => {
                return item.name === stepList[j].name && (ind !== j);
            });

            if (duplicatedItem !== undefined) {
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
        document.querySelector('.pets')
        .insertAdjacentHTML("beforeend", createElements(pets[i], i));
    }     
}

const createElements = (pet) => {  
    return `
    <div class="card">
        <img class="card__img" id="pet-photo" src="${pet.img}" alt="pet-photo">
        <p class="card__title" id="pet-name"> ${pet.name} </p>
        <button class="card__button" onclick="createPopCard('${pet.name}')"> Learn More </button>
    </div> 
    `;
}

const createPopCard = (pet) => {	
	const modal = document.createElement('div');
	modal.classList.add('popup__wrapper');
	document.querySelector("body").classList.add('lock');

	for (let i = 0; i < pets.length; i++) { 
		if (pets[i].name === pet) {
			modal.insertAdjacentHTML('afterbegin', `
				<div class="pets__popup" id="pets__popup">
					<button class="popup__close" onclick="closePopBlock()"> x </button>
					<div class="popup__block">
							<img class="popup__img" src="${pets[i].img}" alt="${pets[i].name}">
							<div class="popup__info">
									<div class="popup__title">${pets[i].name}</div>
									<div class="popup__subtitle">${pets[i].type} - ${pets[i].breed}</div>
									<div class="pet-description">${pets[i].description}</div>
									<ul class="popup__list">
											<li class="popup__item">
													<span> Age: </span><span class="pet__age">${pets[i].age}</span>
											</li>
											<li class="popup__item">
													<span>Inoculations: </span><span class="pet__inoculations">${pets[i].inoculations}</span>
											</li>
											<li class="popup__item">
													<span>Diseases: </span><span class="pet__diseases">${pets[i].diseases}</span>
											</li>
											<li class="popup__item">
													<span> Parasites: </span><span class="pet__parasites">${pets[i].parasites}</span>
											</li>
									</ul>
							</div>
					</div>
				</div>
			`);

			document.body.appendChild(modal);
			return modal;
		}
	}
}

const closePopBlock = () => {
	document.querySelector("body").classList.remove('lock');

	const modal = document.querySelector('.popup__wrapper');
	modal.parentNode.removeChild(modal);
}

const checkItemsPerPage = () => {
    if (document.querySelector('body').offsetWidth > 767 && document.querySelector('body').offsetWidth < 1280) {
        itemsPerPage = 2;
    } else if (document.querySelector('body').offsetWidth <= 767) {
        itemsPerPage = 1;
    } else itemsPerPage = 3;
}

function removingClassesInMenu() {
    document.querySelector('.header__burger').classList.remove('active');
    document.querySelector('.header__nav').classList.remove('active');
    document.querySelector('body').classList.remove('lock');
}

prevPageBtn.addEventListener('click', (e) => {
    checkItemsPerPage(); 
    
    if (currentPage === 1) currentPage = (fullPetsList.length / itemsPerPage + 1); 
    if (currentPage > 1) currentPage--;

    slider.style.left = `calc(0px - ${320 * itemsPerPage * (currentPage - 1)}px)`;
    
});

nextPageBtn.addEventListener('click', (e) => {
   checkItemsPerPage(); 

    if (currentPage < fullPetsList.length / itemsPerPage) { 
        currentPage++;
    }
    if (currentPage === fullPetsList.length / itemsPerPage) currentPage = 1;    

    slider.style.left = `calc(0px - ${320 * itemsPerPage * (currentPage -1)}px)`;
});

document.querySelector('.header__burger').addEventListener('click', () => {
    document.querySelector('.header__burger').classList.toggle('active');
    document.querySelector('.header__nav').classList.toggle('active');
    document.querySelector('body').classList.toggle('lock');
});

document.querySelector('.header__item:nth-child(1)').addEventListener('click', removingClassesInMenu);
document.querySelector('.header__item:nth-child(2)').addEventListener('click', removingClassesInMenu);
document.querySelector('.header__item:nth-child(3)').addEventListener('click', removingClassesInMenu);
document.querySelector('.header__item:nth-child(4)').addEventListener('click', removingClassesInMenu);