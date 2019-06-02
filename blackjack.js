var deck = [];
var dealerHand = [];
var playerHand = [];
var dealerStand = false;
var playerStand = false;
var turn = "Dealer"
var gameOver = false;

function getCard() {
    var index = Math.floor(Math.random() * deck.length);
    var card = deck[index];
    deck.splice(index, 1);
    return card;
}

function getImage(hand) {
    var imageString = "";
    hand.forEach(card => {
        var src = "\'./Resources/" + card + ".png\'";
        var alt = "\'" + card + "\'";
        var width = "\'125px\'";
        var style = "\'padding:5px\'";
        // var heigth = "";
        imageString += `<img style=${style} src=${src} alt=${alt} width=${width}>`;
        // imageString += `<img width=${width}>`;
    })
    return imageString;
}

function updateElement(elementId, suffix, value) {
    var string = `document.getElementById(\"${elementId}\")${suffix} = \"${value}\"`
    eval(string);
}

function updateLabels() {
    // updateElement("turn", '.innerHTML', "Turn: " + turn);
    // updateElement("dealerHand", '.innerHTML', "Dealer's Hand (Total: " + calcSumHand(dealerHand) + "): " + dealerHand);
    // updateElement("playerHand", '.innerHTML', "Player's Hand (Total: " + calcSumHand(playerHand) + "): " + playerHand);
    if (turn == "Player") {
        updateElement("dealerTitle", '.innerHTML', "Dealer");
        updateElement("playerTitle", '.innerHTML', "(Player)");
    } else if (turn == "Dealer") {
        updateElement("dealerTitle", '.innerHTML', "(Dealer)");
        updateElement("playerTitle", '.innerHTML', "Player");
    }

    if (playerStand == true) {
        updateElement("hitMeBtn", '.disabled', true);
        updateElement("standBtn", '.disabled', true);
    }
    updateElement("dealerHandSum", '.innerHTML', calcSumHand(dealerHand));
    updateElement("playerHandSum", '.innerHTML', calcSumHand(playerHand));
    updateElement("dealerHandTemp", '.innerHTML', getImage(dealerHand));
    updateElement("playerHandTemp", '.innerHTML', getImage(playerHand));
}

function updateConsole(message) {
    updateElement("messageBox", '.innerHTML', "<b>Message:</b> " + message);
}

function endMove() {
    if (turn == "Player") {
        turn = "Dealer"
        document.getElementById("hitMeBtn").disabled = true;
        document.getElementById("standBtn").disabled = true;

        var sum = calcSumHand(playerHand)
        if (sum >= 21 && gameOver == false) {
            // updateElement("dealerHand", '.style.color', "green");
            // updateElement("playerHand", '.style.color', "red");
            updateElement("messageBox", ".style.color", "red")
            updateConsole("You busted with " + sum + ". The Dealer wins.");
            gameOver = true;
        }

        decideMove();

        updateLabels();

    } else {
        document.getElementById("hitMeBtn").disabled = false;
        document.getElementById("standBtn").disabled = false;
        turn = "Player"

        updateLabels();

        var sum = calcSumHand(dealerHand)
        if (sum >= 21 && gameOver == false) {
            // updateElement("dealerHand", '.style.color', "red")
            // updateElement("playerHand", '.style.color', "green")
            updateElement("messageBox", ".style.color", "green")
            updateConsole("The Dealer busted with " + sum + ". You win.");
            gameOver = true;
        }
        if (playerStand == true) {

            stand();
        }
    }

    if (dealerStand == true && playerStand == true) {
        // updateElement("dealerHand", '.style.color', "blue");
        // updateElement("playerHand", '.style.color', "blue");
        var sumDealer = calcSumHand(dealerHand)
        var sumPlayer = calcSumHand(playerHand)

        if (sumDealer == sumPlayer) {
            updateElement("messageBox", ".style.color", "blue")
            updateConsole("It's a tie!");
            gameOver = true;
        } else if (sumDealer > sumPlayer) {
            updateElement("messageBox", ".style.color", "red")
            updateConsole("The Dealer is closer to 21. The Dealer wins.");
            gameOver = true;
        } else if (sumDealer < sumPlayer) {
            updateElement("messageBox", ".style.color", "green")
            updateConsole("You are closer to 21. You win.");
            gameOver = true;
        }

    }

}

function decideMove() {
    if (gameOver == false) {
        if (calcSumHand(dealerHand) > 16) {
            stand();
            updateConsole("The Dealer decided to stand.");
        } else {
            hitMe();
            updateConsole("The Dealer selected Hit Me.");
        }
    }
}

function calcSumHand(hand) {
    var sum = 0;
    var newHand = hand;

    newHand.forEach(card => {
        if (card.includes("A")) {
            sum += 1;
        } else if (card.includes("J")) {
            sum += 11;
        } else if (card.includes("Q")) {
            sum += 12;
        } else if (card.includes("K")) {
            sum += 13;
        } else {
            sum += parseInt(card);
        }
    })
    return sum;
}

function startGame() {

    //Column titles
    updateElement("dealerTitle", '.innerHTML', "Dealer");
    updateElement("playerTitle", '.innerHTML', "Player");

    updateConsole("The game has started!")
    updateElement("messageBox", '.style.display', "block")

    //Create the deck
    for (var n = 1; n < 14; n++) {
        if (n == 1) {
            deck.push("AC", "AD", "AH", "AS");
        }
        else if (n == 11) {
            deck.push("JC", "JD", "JH", "JS");
        }
        else if (n == 12) {
            deck.push("QC", "QD", "QH", "QS");
        }
        else if (n == 13) {
            deck.push("KC", "KD", "KH", "KS");
        } else {
            deck.push(n + "C", n + "D", n + "H", n + "S");
        }
    }

    //Select 4 cards
    var tempHand = [getCard(), getCard(), getCard(), getCard()]

    //Deal the 4 cards
    playerHand = [tempHand[0], tempHand[2]]
    dealerHand = [tempHand[1], tempHand[3]]

    // playerHand = ["KC", "KD"]
    // dealerHand = ["KS", "KH"]

    //Disable Start Game button
    document.getElementById("startGameBtn").disabled = true;

    var sumDealer = calcSumHand(dealerHand)
    var sumPlayer = calcSumHand(playerHand)

    if (sumDealer >= 21 && sumPlayer >= 21) {
        updateElement("messageBox", ".style.color", "blue")
        updateConsole("It's a tie!");
        gameOver = true;
    } else if (sumDealer >= 21) {
        // updateElement("dealerHand", '.style.color', "red");
        // updateElement("playerHand", '.style.color', "green");
        updateElement("messageBox", ".style.color", "green")
        updateConsole("The Dealer busted with " + sumDealer + ". You win.");
        gameOver = true;
    } else if (sumPlayer >= 21) {
        // updateElement("dealerHand", '.style.color', "green");
        // updateElement("playerHand", '.style.color', "red");
        updateElement("messageBox", ".style.color", "red")
        updateConsole("You busted with " + sumPlayer + ". The Dealer wins.");
        gameOver = true;
    }
    endMove()
}

function hitMe() {
    if (gameOver == false) {
        if (turn == "Player") {
            playerHand.push(getCard());
            endMove();
        } else if (turn == "Dealer") {
            setTimeout(function () {
                dealerHand.push(getCard())
                endMove();
            }, 2000);
        }
    }
}

function stand() {
    if (gameOver == false) {
        if (turn == "Player") {
            playerStand = true;
            endMove();
        } else if (turn == "Dealer") {
            setTimeout(function () {
                dealerStand = true;
                endMove();
            }, 2000);
        }
    }
}