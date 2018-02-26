const possibleNumbers = {};
for (var i = 1; i < 76; i++) {
	let letter;
	if (i < 16) {
		letter = 'b';
	} else if (i < 31) {
		letter = 'i';
	} else if (i < 46) {
		letter = 'n';
	} else if (i < 61) {
		letter = 'g';
	} else {
		letter = 'o';
	}
	possibleNumbers[i] = {text: `${letter}${i}`, number: i, letter, used: false};
}

const selectNumber = (candidateNumbers, letter) => {
	let lower = 1;
	let upper = 75;

	switch (letter) {
		case 'b':
			lower = 1;
			upper = 15;
			break;
		case 'i':
			lower = 16;
			upper = 30;
			break;
		case 'n':
			lower = 31;
			upper = 45;
			break;
		case 'g':
			lower = 46;
			upper = 60;
			break;
		case 'o':
			lower = 61;
			upper = 75;
			break;
		default:
			lower = 1;
			upper = 75;
	}

	const num = _.random(lower, upper);

	if (candidateNumbers[num].used) {
		return selectNumber(candidateNumbers, letter);
	}

	candidateNumbers[num].used = true;
	return candidateNumbers[num];
}

const resetNumbers = (possibleNumbers) => {
	for (var i = 1; i < 76; i++) {
		possibleNumbers[i].used = false;
	}

	return possibleNumbers;
}

const addSquare = (number) => {
	const numText = document.createTextNode(number.number);
	const numLi = document.createElement('li');
	numLi.appendChild(numText);
	console.log(`#board .${number.letter}`)
	document.querySelector(`#board .${number.letter}`).appendChild(numLi);
}

const fillBoard = (possibleNumbers) => {
	for (let i = 1; i < 26; i++) {
		let number;
		if (i <= 5) {
			number = selectNumber(possibleNumbers, 'b');
		} else if (i <= 10) {
			number = selectNumber(possibleNumbers, 'i');
		} else if (i <= 15) {
			number = selectNumber(possibleNumbers, 'n');
		} else if (i <= 20) {
			number = selectNumber(possibleNumbers, 'g');
		} else {
			number = selectNumber(possibleNumbers, 'o');
		}
		addSquare(number);
	}
}

fillBoard(possibleNumbers);
possibleNumbers = resetNumbers(possibleNumbers);

const callNumber = (possibleNumbers) => {
	const newNumber = selectNumber(possibleNumbers);
	const numText = document.createTextNode(newNumber.text);
	const utterThis = new SpeechSynthesisUtterance(newNumber.text);
	synth.speak(utterThis);
	const numLi = document.createElement('li');
	const numDiv = document.createElement('div');
	numDiv.appendChild(numText)
	numLi.appendChild(numDiv);
	document.querySelector('#numbers').appendChild(numLi);
}

const synth = window.speechSynthesis;
const playButton = document.querySelector('#play');
const pauseButton = document.querySelector('#pause');
let paused = false;

const pause = () => {
	window.clearTimeout(timeout);
	paused = true;
}

const play = () => {
	paused = false;
	callNext();
}
let timeout;
const callNext = () => {
	if (!paused) {
		callNumber(possibleNumbers);

		const time = document.querySelector('#timeout').value;
		timeout = window.setTimeout(callNext, time * 1000);
	}
}

playButton.addEventListener('click', play);
pauseButton.addEventListener('click', pause);
