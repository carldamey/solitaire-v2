/*----- constants -----*/
const SUITS = ["c", "d", "h", "s"]
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

/*----- state variables -----*/
let deck,
	tableau,
	stockPile,
	wastePile,
	acePiles,
	selectedLocation,
	selectedCard,
	targetCard,
	winState,
	moveCounter,
	timerMin,
	timerSec,
	timerInterval

/*----- cached elements  -----*/
const tableauDiv = document.getElementById("tableau")
const gameDiv = document.getElementById("game")
const columnDivArr = [
	document.getElementById("col0"),
	document.getElementById("col1"),
	document.getElementById("col2"),
	document.getElementById("col3"),
	document.getElementById("col4"),
	document.getElementById("col5"),
	document.getElementById("col6"),
]
const aceDivArr = [
	document.getElementById("ace0"),
	document.getElementById("ace1"),
	document.getElementById("ace2"),
	document.getElementById("ace3"),
]
const stockPileDiv = document.getElementById("stock-pile")
const wastePileDiv = document.getElementById("waste-pile")
const resetButton = document.getElementById("reset-button")
const timerEl = document.getElementById("timer")
const counterEl = document.getElementById("moves")
const menuBarEl = document.getElementById("menu-bar")

/*----- event listeners -----*/
gameDiv.addEventListener("click", (event) => selectCard(event))
stockPileDiv.addEventListener("click", draw)
resetButton.addEventListener("click", init)

/*----- functions -----*/
init()

function init() {
	winstate = false
	moveCounter = 0
	timerMin = 0
	timerSec = 0
	deck = []
	tableau = [[], [], [], [], [], [], []]
	stockPile = []
	wastePile = []
	acePiles = [[], [], [], []]
	// Fill the deck array with card objects
	for (let suit in SUITS) {
		for (let i = 0; i <= 12; i++) {
			SUITS[suit] === "c" || SUITS[suit] === "s"
				? (color = "black")
				: (color = "red")
			deck.push({
				suit: SUITS[suit],
				rank: RANKS[i],
				color,
			})
			// Add card element to the DOM
			const cardEl = document.createElement("div")
		}
	}
	// Shuffle the deck
	deck.sort(() => Math.random() - 0.5)
	// Fill the tableau with hidden cards
	for (let i = 0; i <= 6; i++) {
		while (tableau[i].length < i + 1)
			tableau[i].push({
				suit: "x",
				rank: "x",
			})
	}
	// Move 24 cards to the stockpile, leaving the remaining 28 to pull from when revealing cards
	for (let i = 0; i < 24; i++) {
		const stockCard = deck[0]
		deck.shift()
		stockPile.push(stockCard)
	}
	revealCards()
	render()

	timerEl.innerText = "TIME: 00:00"
	if (timerInterval) clearInterval(timerInterval)
	timerInterval = setInterval(incrementTimer, 1000)
}

function revealCards() {
	tableau.forEach((column) => {
		if (column.length > 0 && column[column.length - 1].suit === "x") {
			const revealedCard = deck[0]
			deck.shift()
			column[column.length - 1] = revealedCard
		}
	})
}

function draw() {
	if (stockPile.length >= 3) {
		for (let i = 1; i <= 3; i++) {
			const drawingCard = stockPile[0]
			stockPile.shift()
			wastePile.unshift(drawingCard)
		}
	} else if (stockPile.length > 0) {
		stockPile.forEach((card) => {
			stockPile.shift()
			wastePile.unshift(card)
		})
	} else if (stockPile.length === 0) {
		stockPile = [...wastePile].reverse()
		wastePile = []
	}
	moveCounter++
	render()
}

function move(selectedCard, targetCard) {
	if (selectedCard !== targetCard) {
		if (selectedCard.location === tableau) {
			// Stack from Tableau to Tableau
			if (
				selectedCard.rank > 1 &&
				selectedCard.color !== targetCard.color &&
				selectedCard.rank === targetCard.rank - 1
			) {
				tableau[targetCard.arrIdx].push(
					...tableau[selectedCard.arrIdx].splice(selectedCard.cardIdx),
				)
			}
			// King from Tableau to Empty Column
			else if (
				selectedCard.rank === 13 &&
				tableau[targetCard.arrIdx].length === 0
			) {
				tableau[targetCard.arrIdx].push(
					...tableau[selectedCard.arrIdx].splice(selectedCard.cardIdx),
				)
			}
			// Card from Tableau to Ace Pile
			else if (
				(targetCard.location === acePiles &&
					acePiles[targetCard.arrIdx].length === 0 &&
					selectedCard.rank === 1) ||
				(targetCard.rank === selectedCard.rank - 1 &&
					targetCard.suit === selectedCard.suit)
			) {
				acePiles[targetCard.arrIdx].push(
					tableau[selectedCard.arrIdx][selectedCard.cardIdx],
				)
				tableau[selectedCard.arrIdx].pop()
			}
		} else if (selectedCard.location === acePiles) {
			// Ace from Ace Pile to Blank Ace Pile
			if (
				selectedCard.rank === 1 &&
				targetCard.location === acePiles &&
				acePiles[targetCard.arrIdx].length === 0
			) {
				acePiles[targetCard.arrIdx].push(acePiles[selectedCard.arrIdx][0])
				acePiles[selectedCard.arrIdx].pop()
			}
			// Non-Ace from Ace Pile to Tableau
			else if (
				selectedCard.rank > 1 &&
				targetCard.location === tableau &&
				selectedCard.color !== targetCard.color &&
				selectedCard.rank === targetCard.rank - 1
			) {
				tableau[targetCard.arrIdx].push(
					acePiles[selectedCard.arrIdx][
						acePiles[selectedCard.arrIdx].length - 1
					],
				)
				acePiles[selectedCard.arrIdx].pop()
			}
		} else if (selectedCard.location === wastePile) {
			// Non-Ace Card from Waste to Tableau
			if (
				wastePile[0].rank > 1 &&
				targetCard.location === tableau &&
				targetCard.rank === wastePile[0].rank + 1 &&
				targetCard.color !== wastePile[0].color
			) {
				tableau[targetCard.arrIdx].push(wastePile[0])
				wastePile.shift()
			}
			// Card from Waste Pile to Ace Pile
			else if (
				(targetCard.location === acePiles &&
					wastePile[0].rank === 1 &&
					acePiles[targetCard.arrIdx].length === 0) ||
				(targetCard.rank === wastePile[0].rank - 1 &&
					targetCard.suit === wastePile[0].suit)
			) {
				acePiles[targetCard.arrIdx].push(wastePile[0])
				wastePile.shift()
			}
			// King from Waste Pile to Blank Column
			else if (
				wastePile[0].rank === 13 &&
				tableau[targetCard.arrIdx].length === 0
			) {
				tableau[targetCard.arrIdx].push(wastePile[0])
				wastePile.shift()
			}
		}
		moveCounter++
		checkWin()
		revealCards()
		render()
	}
}

function selectCard(event) {
	// Identify which arrays cards are being interacted with from
	if (event.target.parentNode.parentNode.id === "tableau") {
		selectedLocation = tableau
		arrIdx = event.target.parentNode.id[3]
	}
	if (event.target.parentNode.parentNode.id === "ace-piles") {
		selectedLocation = acePiles
		arrIdx = event.target.parentNode.id[3]
	} else if (event.target.id === "waste-pile") {
		arrIdx = 0
		selectedLocation = wastePile
	}

	if (
		!selectedCard &&
		event.target.classList.contains("card") &&
		!event.target.classList.contains("xx") &&
		!event.target.classList.contains("outline") &&
		event.target.id !== "stock-pile"
	) {
		selectedCard = {
			location: selectedLocation,
			arrIdx: event.target.parentNode.id[3],
			cardIdx: Array.from(event.target.parentNode.children).indexOf(
				event.target,
			),
			suit: event.target.id[0],
			rank: parseInt(event.target.id[1]),
		}
		if (selectedCard.suit === "c" || selectedCard.suit === "s")
			selectedCard.color = "black"
		else selectedCard.color = "red"
		if (event.target.id.length === 3)
			selectedCard.rank = parseInt(event.target.id[1] + event.target.id[2])
		event.target.style.border = ".5vmin double red"
	} else if (
		selectedCard &&
		!targetCard &&
		event.target.classList.contains("card") &&
		!event.target.classList.contains("xx") &&
		!event.target.parentNode.classList.contains("draw-piles")
	) {
		targetCard = {
			location: selectedLocation,
			arrIdx: event.target.parentNode.id[3],
			cardIdx: Array.from(event.target.parentNode.children).indexOf(
				event.target,
			),
			suit: event.target.id[0],
			rank: parseInt(event.target.id[1]),
		}
		if (targetCard.suit === "c" || targetCard.suit === "s")
			targetCard.color = "black"
		else targetCard.color = "red"
		if (event.target.id.length === 3)
			targetCard.rank = parseInt(event.target.id[1] + event.target.id[2])
	}
	if (selectedCard && targetCard) {
		move(selectedCard, targetCard)
		selectedCard = null
		targetCard = null
	}
}

function render() {
	// Render Ace Piles
	aceDivArr.forEach((aceDiv) => (aceDiv.innerHTML = ""))
	acePiles.forEach((acePile) => {
		const newCardEl = document.createElement("div")
		if (acePile.length === 0)
			newCardEl.classList.add("card", "large", "outline")
		else if (acePile.length > 0) {
			newCardEl.classList.add(
				"card",
				"large",
				`${acePile[acePile.length - 1].suit}${
					acePile[acePile.length - 1].rank
				}`,
			)
			newCardEl.id = `${acePile[acePile.length - 1].suit}${
				acePile[acePile.length - 1].rank
			}`
		}

		aceDivArr[acePiles.indexOf(acePile)].appendChild(newCardEl)
	})
	// Render Tableau
	columnDivArr.forEach((columnDiv) => (columnDiv.innerHTML = ""))
	tableau.forEach((column) => {
		if (column.length === 0) {
			const newCardEl = document.createElement("div")
			newCardEl.classList.add("card", "large", "outline")
			columnDivArr[tableau.indexOf(column)].appendChild(newCardEl)
		} else
			column.forEach((card) => {
				const newCardEl = document.createElement("div")
				newCardEl.classList.add("card", "large", `${card.suit}${card.rank}`)
				newCardEl.id = `${card.suit}${card.rank}`
				columnDivArr[tableau.indexOf(column)].appendChild(newCardEl)
			})
	})
	// Render Stock Pile
	stockPileDiv.classList.remove("outline", "xx")
	if (stockPile.length === 0) stockPileDiv.classList.add("outline")
	else if (stockPile.length > 0) stockPileDiv.classList.add("xx")

	// Render Waste Pile
	wastePileDiv.className = "card xlarge"
	if (wastePile.length === 0) wastePileDiv.classList.add("outline")
	else if (wastePile.length > 0)
		wastePileDiv.classList.add(`${wastePile[0].suit}${wastePile[0].rank}`)
	wastePileDiv.style.border = null

	// Render Move Counter
	counterEl.innerText = `MOVES: ${moveCounter}`

	// Display Win Message
	if (winState) {
		clearInterval(timerInterval)
		game.innerHTML = `<h1>YOUR SCORE IS: ${Math.trunc(
			(30 - timerMin / moveCounter) * 10,
		)}<h1>`
	}
}

function checkWin() {
	if (acePiles.every((acePile) => acePile.length === 13)) winState = true
}

function incrementTimer() {
	timerSec++
	if (timerSec === 60) {
		timerSec = 0
		timerMin++
	}
	timerEl.innerText = `TIME: ${String(timerMin).padStart(2, 0)}:${String(
		timerSec,
	).padStart(2, 0)}`
}

// force win for debugging
// acePiles = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,]]
// checkWin()
