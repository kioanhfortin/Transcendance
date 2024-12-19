let nbrPlayers;
let usr = [];
let orderMatch = [];
//used when i want to check wich user to input the name
let iUsername = 1;
let iSameName = 1;
let round = 1;
// choose how many players it will have in the tournament default is 4
function TournamentNbrPlayers() {

    const tournamentIds = [4, 6, 8, 10, 12, 14, 16];

    tournamentIds.forEach(id => {
        document.getElementById(`tournament-${id}`).addEventListener('click', () => {
            // CreateTournamentModal(id);
            nbrPlayers = id;
        });
    });
    document.getElementById(`nbrPlayer-Btn`).addEventListener('click', () => {
        if (nbrPlayers == 0)
            nbrPlayers = 4;
    });
}

// validate the name for each players of the tournament
function validateName() {
    document.getElementById(`input-username-btn`).addEventListener('click', () => {
        let username = document.getElementById(`input-username-form`).value;
        //wrong username ; no input
        if (username == "")
            return ;
        username = checkIfAlreadyUse(username);
        usr.push(username);
        iUsername++;
        if (iUsername == nbrPlayers + 1)
        {
            document.getElementById(`input-Username`).style.display = 'none';
            document.getElementById(`input-Username-id`).style.display = 'none';
            document.getElementById(`input-Username-Finish`).style.display = 'block';   
            document.getElementById(`input-username-form`).style.display = 'none';
            document.getElementById(`input-username-btn`).style.display = 'none';
            document.getElementById(`start-tournament`).style.display = 'block';
        }
        else
            document.getElementById(`input-Username-id`).textContent = iUsername;
    });
}

// just the function called that containz almost everything in termes of tournament
export function TournamentManager() {
    resetTournament();
    TournamentNbrPlayers();
    validateName();
    checkResetTournament();
    startTournament();
}


// reset de tournament
function resetTournament() {
    if (orderMatch[0])
    {
        let winner = document.getElementById(`winnerTournament`);
        let currentText =  winner.textContent;
        winner.textContent = currentText.replace(orderMatch[0], '');
        console.log(document.getElementById(`winnerTournament`).textContent);
    }
    nbrPlayers = 0;
    usr.length = 0;
    iUsername = 1;
    iSameName = 0;
    iMatch = 0;
    round = 1;
    document.getElementById(`input-Username-id`).textContent = iUsername;

    // reset the hiden
    document.getElementById(`input-Username`).style.display = 'block';
    document.getElementById(`input-Username-id`).style.display = 'block';
    document.getElementById(`input-Username-Finish`).style.display = 'none';   
    document.getElementById(`input-username-form`).style.display = 'block';
    document.getElementById(`input-username-btn`).style.display = 'block';
    document.getElementById(`start-tournament`).style.display = 'none';

}

// check if it needs to reset the tournament exemple quit while creating
function checkResetTournament() {
    const ids = [`1modal-closeBtn`,`2modal-closeBtn`, `2modal-BackBtn`];

    ids.forEach(id => {
        document.getElementById(id).addEventListener('click', () => {
            resetTournament();
        });
    });
}

// la tu vois je garde un index de chaque fois que un nom est pareil
// et je le met par dessus le username comme ca pas de doublon
function checkIfAlreadyUse(username) {
    if (usr.includes(username)) {
        username = username + ' (' + ++iSameName + ')';
    }
    return username;
}

function startTournament() {
    document.getElementById(`start-tournament`).addEventListener('click', () => {
        document.getElementById(`tournament-info`).style.display = 'inline-block'
        DecideOrderMatch();
        document.getElementById(`PlayerOne`).style.display = 'block';
        document.getElementById(`PlayerTwo`).style.display = 'block';
        document.getElementById(`PlayerOne`).textContent = orderMatch[0];
        document.getElementById(`PlayerTwo`).textContent = orderMatch[1];
        document.getElementById(`menu`).style.display = 'none';
        document.getElementById(`start`).style.display = 'block';
    });
}

function DecideOrderMatch() {
    let orderMatchBuf;
    if (round == 1)
        orderMatchBuf = usr.slice();
    else
        orderMatchBuf = orderMatch.slice();
    orderMatch.length = 0;
    while (orderMatchBuf.length != 0) {
        let iRandome = getRandomValue(0, orderMatchBuf.length);
        orderMatch.push(orderMatchBuf[iRandome]);
        orderMatchBuf.splice(iRandome, 1);
    }
    console.log(orderMatch);
    displayMatchOrder();
}

function getRandomValue(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function displayMatchOrder() {
    let displayDiv = document.getElementById(`order-match-display`);
    for (let i = 0; i < nbrPlayers; i += 2) {
        let row = document.createElement('div');
        row.classList.add('row', 'my-3', 'nextToPlay');

        let col1 = document.createElement('div');
        col1.classList.add('col-5', 'text-center');
        col1.innerHTML = `<div class="text-dark">${orderMatch[i]}</div>`;

        let col2 = document.createElement('div');
        col2.classList.add('col-2', 'text-center');
        col2.innerHTML = `<div class="text-dark">VS</div>`;

        let col3 = document.createElement('div');
        col3.classList.add('col-5', 'text-center');
        col3.innerHTML = `<div class="text-dark">${orderMatch[i + 1]}</div>`;

        row.appendChild(col1);
        row.appendChild(col2);
        row.appendChild(col3);
        displayDiv.appendChild(row);
    }
}

let iMatch = 0;
export function newGame() {
    let displayDiv = document.getElementById(`order-match-display`);
    let rowToDel = displayDiv.querySelectorAll('.nextToPlay');
    console.log(orderMatch);
    if (rowToDel[1]) {
        document.getElementById(`PlayerOne`).textContent = orderMatch[iMatch];
        document.getElementById(`PlayerTwo`).textContent = orderMatch[iMatch + 1];
    }
    else
    {
        iMatch = 0;
        document.getElementById(`round-display-counter`).textContent = round++;
        DecideOrderMatch();
        document.getElementById(`PlayerOne`).textContent = orderMatch[0];
        document.getElementById(`PlayerTwo`).textContent = orderMatch[1];
    }
    displayDiv.removeChild(rowToDel[0]);
}
export function removeLoser(winner) {
    nbrPlayers--;
    // console.log(loser);
    console.log(iMatch,"IMATCHsdfsd");

    if (winner == 1) {
        orderMatch.splice(1 + iMatch, 1);
    }
    else {
        orderMatch.splice(0 + iMatch, 1);
    }
    iMatch++;

    if (orderMatch.length == 1) {
        endTournament();
    }
}

function endTournament() {
    document.getElementById(`tournament-info`).style.display = 'none';
    document.getElementById(`winnerTournament`).style.display = 'block';
    document.getElementById(`winnerTournament`).textContent += orderMatch[0];

    document.getElementById(`finishTournament`).style.display = 'block';
    document.getElementById(`start`).style.display = 'none';
    document.getElementById(`PlayerOne`).style.display = 'none';


    document.getElementById(`finishTournament`).addEventListener('click', () => {
        document.getElementById(`menu`).style.display = 'block';
        resetTournament();
        document.getElementById(`finishTournament`).style.display = 'none';
        document.getElementById(`winnerTournament`).style.display = 'none';
        let displayDiv = document.getElementById(`order-match-display`);
        let rowToDel = displayDiv.querySelectorAll('.nextToPlay');
        displayDiv.removeChild(rowToDel[0]);
    });

}

// les points apparaisse pas au debut