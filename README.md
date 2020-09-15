# SimpleNLP
A simple non ai way to sort user input into pre defined commands. 
For now this is just a script that uses an algorithm based on synonyms and definitions of words in order to compare the "meaning" of an input string to the "meaning" of the command string. This is about 70% accurate on the standard settings but altering the algorithm and the diffrent weaights could increase the accuracy.

# Example
For now the definition of the commands is done within the file but this can be changed later.
The output can also be assigned to a variable instead of being outputed to the console.
The script outputs the highest probablility command based off the input.
``` 
Commands:
["turn off the lights",
"create darkness",
"play some music"]

node finalProcessing.js 
> lights off
I am  74 % sure that you ment turn off the lights

```
# Installation
In order to use this file please download the repository as a zip and use the following command to run the script:
``` node finalProcessing.js  ```
The script relies on some local files for the wordlists it uses for the comparison so make sure these are avaiable in the same directory.
