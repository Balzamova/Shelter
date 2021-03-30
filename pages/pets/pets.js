const firstPageBtn = document.querySelector('.firstPage');
const prevPageBtn = document.querySelector('.prevPage');
const numberBtn = document.querySelector('.numberPage');
const nextPageBtn = document.querySelector('.nextPage');
const lastPageBtn = document.querySelector('.lastPage');
const popupClosedBtn = document.querySelector('.popup__close');

const slider = document.querySelector('.pets');
let pets = [];
let fullPetsList = [];
let currentPage = 1;
let itemsPerPage = 8;

const request = new XMLHttpRequest();
request.open('GET', './pets.json');

request.onload = () => {
	pets = JSON.parse(request.response);

	fullPetsList = (() => {
		let tempArr = [];
		for (let i = 0; i < 6; i++) {
			const newPets = pets;

			for (let j = pets.length; j > 0; j--) {
				let randInd = Math.floor(Math.random() * j);
				const randElem = newPets.splice(randInd, 1)[0];
				newPets.push(randElem);
			}
			tempArr = [...tempArr, ...newPets];
		}
		return tempArr;
	})();

	fullPetsList = sort863(fullPetsList);

	createPets(fullPetsList);
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
		slider.insertAdjacentHTML("beforeend", createElements(pets[i], i));
	}
}

const createElements = (pet) => {
	return `
    <div class="card">
        <img class="card__img" id="pet-photo" src="${pet.img}" alt="pet-photo">
        <p class="card__title"> ${pet.name} </p>
        <button class="card__button" onclick= "createPopCard('${pet.name}')"> Learn More </button>
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

	slider.style.top = `calc(0px - ${930 * (currentPage - 1)}px)`;
	slider.style.opacity = 1;

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
	slider.style.top = `calc(0px - ${930 * (currentPage - 1)}px)`;
	checkBtnsDisabled();
});

document.querySelector('.header__burger').addEventListener('click', () => {
	document.querySelector('.header__burger').classList.toggle('active');
	document.querySelector('.header__nav').classList.toggle('active');
	document.querySelector('body').classList.toggle('lock');
});

document.querySelector('.header__item:nth-child(2n)').addEventListener('click', () => {
	document.querySelector('.header__burger').classList.remove('active');
	document.querySelector('.header__nav').classList.remove('active');
	document.querySelector('body').classList.remove('lock');
});

document.querySelector('.header__item:nth-child(4n)').addEventListener('click', () => {
	document.querySelector('.header__burger').classList.remove('active');
	document.querySelector('.header__nav').classList.remove('active');
	document.querySelector('body').classList.remove('lock');
});
