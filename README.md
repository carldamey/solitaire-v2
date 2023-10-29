# Solitaire v2
https://carldamey.github.io/solitaire-v2/

![Solitaire Screenshot](/public/images/Solitaire%20Screenshot.png)
Klondike solitaire is the most commonly known and played version of the Solitaire family of card games. It is fondly remembered by those who grew up on older Windows operating systems, especially those without internet access, as many of these operating systems came with it installed alongside lackluster video editing software and strange royalty-free mp3s.

This game was independently developed over the course of a week as a bootcamp submission, capping off a unit on front end languages, and has since been updated into this new project.

## Technologies Used
### Languages: 
- Javascript
- HTML
- CSS
###  Frameworks: 
- CSS Card Library - https://github.com/jhdo95/War/tree/main/css/card-library
### Software:
- VSCodium - https://vscodium.com/


## Getting Started
As the game begins, you are dealt 28 cards across 7 columns, these cards are only revealed once they have reached the bottom of their respective column. The remaining 24 cards are placed into the Stockpile.

Your goal is to move all cards from all 7 columns and the Stockpile into the 4 ace slots above the tableau. To do this, click on a card to select it, it will become highlighted, click again to deselect, or click another card to make a move using those two selections.

When clicking the Stockpile, the top 3 cards (or all of them if less than 3 cards remain) are moved to the Waste Pile one at a time. The top card can be selected and played from the Waste Pile, at which point the card below it is revealed. Once the Stockpile is empty, the Waste Pile can be turned over into a new Stockpile.

If you manage to win, you will receive a score based on the amount of moves (card moves and Stockpile draws) and the time taken.

### The legal Moves are:

#### From the Tableau & Waste Pile:
- Any non-ace card, to any Tableau card that is one rank higher and the opposite suit color
- An ace to an empty Ace Pile
- A king to an empty Tableau column
- A non-ace card to an ace pile, which is currently one rank lower and the same suit

#### From the Ace Piles:
- An ace to a different empty Ace Pile (this feature is entirely useless but I for some reason put effort into implementing it)
- A non-ace card to a Tableau card that is one rank higher and the opposite suit color

## Icebox Features
- Add consistency in CSS color formats
- Move Draw & Waste Piles above Tableau
- Add Ability to View Rules During Gameplay
- Display the top 3 Waste Pile cards as opposed to just the top one
- Improve styling with gradients and other similar changes
- Make card size responsive to view window size
- Add audio feedback to moves
- Fix minor issue with moving kings to ace slots
- Improve visuals of final score card
- Allow resetting after win in a clean fashion

## Current Bugs
- Timer continues to run after game ends
- Victory screen does not reset when resetting game
- Final King takes multiple moves to get into ace pile (does it use a move?)

## Update Log
### v2.0 - 10/29/2023:
- Moves game to MEN stack format
- Shortens space between cards to save screen space

## Original Pitch

Klondike solitaire is the most commonly known and played version of the Solitaire family of card games. It is fondly remembered by those who grew up on older Windows operating systems, especially those without internet access, as many of these operating systems came with it installed alongside lackluster video editing software and strange royalty-free mp3s.

![Solitaire Wireframe](/public/images/Solitaire%20Wireframe.png)

### MVP

To reach MVP, this project will need:

 - A CSS grid or canvas layout for tableau, deck, and ace piles
 - A system for detecting and executing requested legal moves
 - A system for properly drawing from the deck
 - A system for moving cards to legal spaces

### Stretch Goals

If time permits it, I would like to add:

 - A responsive design
 - Audio feedback
 - Timer & Move Counter
 - Loss Detection
 - Visuals that mimic the Windows 98/XP releases of solitaire
 - Settings for minor gameplay variations such as draw rules or the enforcement of alternating suit colors

### Tech Stack

 - HTML, CSS, JS
 - CSS Card Library
 - VSCodium


### Potential Roadblocks
The biggest difficulties in this project are likely to be:

 - The canvas/grid layout
 - Formatting and displaying cards in their proper layout legibly
 - Implementing a system for detecting whether cards on the tableau should be hidden or visible
