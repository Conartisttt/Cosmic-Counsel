// __________________________________________SAM BRESLIN_____________________________________________________

// **** Working Horoscope ****

// established variables using HTML id selectors
const dropDown = document.getElementById('dropdown');
const viewHoroscopeBtn = document.getElementById('dailybutton');
const title = document.getElementById('zodiac');
const date = document.getElementById('date');
const horoscope = document.getElementById('horoscope');

// function that fetches data and saves to local storage
function findHoroscope() {
    const sign = dropDown.value;
    console.log(sign, typeof sign);
    let todaysDate = dayjs();
    let today = todaysDate.format('YYYY-MM-DD');
    fetch('https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=' + sign + '&day=' + today)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            const dailyHoroscope = data.data.horoscope_data;
            // console.log(dailyHoroscope);
            localStorage.setItem('dailyHoroscope', dailyHoroscope);
        })
}

// function that displays the zodiac sign, current date, and daily horoscope
function displayHoroscope() {
    title.textContent = dropDown.value + " ⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆";
    let date = dayjs()
    $('#date').text(date.format('dddd, MMM D, YYYY'));
    const storedHoroscope = localStorage.getItem('dailyHoroscope');
    console.log(storedHoroscope);
    horoscope.textContent = storedHoroscope;
};

// event listeners for changes to dropdown list value and the 'View Your Horoscope' button
dropDown.addEventListener('change', findHoroscope);
viewHoroscopeBtn.addEventListener('click', displayHoroscope);


// ******** NEW MOON PHASE *************** DAELYN HIDUCHICK & SAM BRESLIN

const authString = btoa(`dded7d1b-9092-4ba7-b4c2-7d8ecd9f4b55:f90d146b196dce687aed0a82ef0915f1134236174b57a8df181b3ba88200c77a6a8d85c25c56451b5ac08c94cc3227fc6e62e81fae94e2c9c7cfd3ad92e50c9466fb5db2fc7dbb52ba712aa0b1336384b062f7fcf8c86408c47c755000bd4bc9b7850de3d5414ad3f35a91d82b45c6a9`);

// sets the parameters for the api using variables to establish user's location and date
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const moonDate = dayjs();
        //   .add(-1, 'day');


        const data = {
            format: 'png',
            observer: {
                date: moonDate,
                latitude: latitude,
                longitude: longitude
            },
            style: {
                backgroundColor: 'red',
                backgroundStyle: 'stars',
                headingColor: 'white',
                moonStyle: 'sketch',
                textColor: 'white'
            },
            view: {
                type: 'portrait-simple'
            }
        }
        //comment
        //   call to api using set credentials
        fetch("https://api.astronomyapi.com/api/v2/studio/moon-phase", {
            method: "POST",
            headers: {
                'Authorization': "Basic " + authString,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            console.log(data.data);
            // creates and appends image tag to html
            const imageSource = data.data.imageUrl;
            console.log(imageSource);
            const imageElement = document.createElement("img");
            imageElement.src = imageSource;
            const moons = document.getElementById('moons');
            moons.appendChild(imageElement);
            imageElement.style.height = '500px';
            imageElement.style.width = '300px';
        })
    });
} else {
    console.log("Geolocation is not supported by this browser.");
}


// _________________________________________SAM BRESLIN____________________________________________________


//__________________________________________CONNER MARTIN__________________________________________________

// Working Tarot Card

//establish variables using html id selectors
const tarotImage = document.getElementById("tarot-card-img");
const cardDiv = document.getElementById("card-div");
const pullCardBtn = document.getElementById("pull-card-btn");
const buyBtn = document.getElementById("buy-cards-btn");
const savedBtn = document.getElementById("saved-cards-btn");

//event listeners for buttons
savedBtn.addEventListener("click", goToSavedCards);
buyBtn.addEventListener("click", goToAvailableDecks)
pullCardBtn.addEventListener("click", generateCard);

//create elements for tarot card
const titleEl = document.createElement("h2");
const cardDesc = document.createElement("p");

//tarot card array
const cardsArr = [];

//local storage array
const savedCards = JSON.parse(localStorage.getItem("savedcards")) || [];

function init() {
    findTarot();
}


//fetch tarot card data from API and call function createArray
function findTarot() {
    fetch('https://tarot-api-3hv5.onrender.com/api/v1')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            createArray(data);
        })
};

//push tarot card data to an array and log to console
function createArray(cards) {
    const tarotCardsArr = cards.cards;
    cardsArr.push(...tarotCardsArr);
    console.log("We've got the cards.");
}


//choose random tarot card and add data to the screen
function generateCard() {
    const tarotCardDiv = document.getElementById("columnTwo");
    tarotImage.classList.remove("image-flip");
    const oldSaveButton = document.getElementById("save-card");
    if (oldSaveButton) {
        oldSaveButton.remove();
    }
    cardDesc.textContent = "";
    titleEl.textContent = "";
    const meaningArr = [];
    const cardsArrLength = cardsArr.length;
    const randomCardIndex = Math.floor(Math.random() * cardsArrLength);
    const randomCard = cardsArr[randomCardIndex];
    meaningArr.push(randomCard.meaning_up);
    meaningArr.push(randomCard.meaning_rev);
    const meaningLength = meaningArr.length
    const randomDirectionIndex = Math.floor(Math.random() * meaningLength);
    titleEl.textContent = randomCard.name;
    cardDiv.prepend(titleEl);
    cardDesc.textContent = meaningArr[randomDirectionIndex];
    cardDiv.appendChild(cardDesc);
    tarotImage.setAttribute("src", "./assets/images/" + randomCardIndex + ".jpg");
    if (randomDirectionIndex === 1) {
        tarotImage.classList.add("image-flip");
        titleEl.textContent = randomCard.name + " - Reverse Pull";
    };
    const saveButton = document.createElement("button");
    saveButton.setAttribute("id", "save-card");
    saveButton.classList.add("button", "is-medium");
    saveButton.textContent = "Save Your Card";
    saveButton.addEventListener("click", storeData);
    tarotCardDiv.appendChild(saveButton);
};


//add card to local storage
function storeData() {
    const saveTarotButton = document.getElementById("save-card").disabled = true;
    const currentCard = document.getElementById("tarot-card");
    savedCards.push(currentCard.innerHTML)
    localStorage.setItem("savedcards", JSON.stringify(savedCards));
}

//function to redirect to savedCards html page
function goToSavedCards() {
    window.location.href = "savedCards.html"
}

//function to redirect to buyCards html page
function goToAvailableDecks() {
    window.location.href = "buyCards.html"
}


init();
//__________________________________________CONNER MARTIN__________________________________________________