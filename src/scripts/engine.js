const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardsSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card")
    },

    button: document.getElementById("next-duel"),

}

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: "./src/assets/icons/dragon.png",
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: "./src/assets/icons/magician.png",
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: "./src/assets/icons/exodia.png",
        WinOf: [0],
        LoseOf: [1]
    },
]

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards"
}

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IDCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id",IDCard);
    cardImage.classList.add("card");

    if(fieldSide === playerSides.player1){
        cardImage.addEventListener("click", ()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        })
    

    cardImage.addEventListener("mouseover",()=>{
        drawSelectCard(IDCard);
    });
}

    return cardImage;
}

async function setCardsField(cardId) {

    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    console.log("TESTEeeeeeeeeeee")
    console.log(cardData[cardId])

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawButton(text){
    state.button.innerText = text;
    state.button.style.display = "block"
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Draw";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "win";
        await playAudio(duelResults)
        state.score.playerScore++;
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "lose";
        await playAudio(duelResults)

        state.score.computerScore++;
    }

    return duelResults;
}

async function removeAllCardsImages() {
    let cards = document.querySelector("#player-cards");
    let imgElements = cards.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())

    cards = document.querySelector("#computer-cards");
    imgElements = cards.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())

}

async function drawSelectCard(index) {
    state.cardsSprites.avatar.src = cardData[index].img;
    state.cardsSprites.name.innerText = cardData[index].name;
    state.cardsSprites.type.innerText = "Attribute: "+ cardData[index].type;
}


async function drawCards(cardNumber, fieldSide){
    for(let i = 0; i < cardNumber; i++){
        const randomIDCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIDCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel(){
    state.cardsSprites.avatar.src = "";
    state.button.style.display = "none";

    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"

    state.cardsSprites.name.innerText = "Selecione"
    state.cardsSprites.type.innerText = "Uma Carta"

    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)    
    audio.play()
}


function init(){


    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);


}

init();