# SimpleNLP
For now, this is just a script that uses an algorithm based on synonyms and definitions of words in order to compare the "meaning" of an input string to the "meaning" of the command string. This is about 70% accurate on the standard settings but altering the algorithm and the different weights could increase the accuracy.

# Example
For now the definition of the commands is done within the file but this can be changed later.
The output can also be assigned to a variable instead of being output to the console.
The script outputs the highest probability command based off the input.
``` 
Commands defined in this example:
["turn off the lights",
"create darkness",
"play some music"]

Code:
node finalProcessing.js 
> lights off
I am  74 % sure that you ment turn off the lights

```
# Installation
In order to use this file please download the dependencies listed in package.json
``` npm install package.json ```
and then run the script with the following command:
``` node finalProcessing.js  ```
The script relies on some local files for the wordlists it uses for the comparison so make sure these are avaiable in the same directory.

# Credits
@barttec and Stack overflow
