# SimpleNLP
A simple non ai way to sort user input into pre defined commands.

# Example
``` 
const user = require("simplenlp");

var commands = [
  "Please turn off the lights",
  "Pick the flowers",
  "Play me a song"
]

var input = "Shut the lights"

var command = user.understand(input, commands)
// returns
{
  top: "Please turn off the lights",
  probability: {
    "Please turn off the lights": 0.7,
    "Pick the flowers": 0.2,
    "Play me a song": 0.1,  
  }
}

```

# Installation

``` npm install simplenlp ```
