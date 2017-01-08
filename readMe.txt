Name: Alexei Tipenko
Date: Sunday, November 13th, 2016

* Developed in MacOS *
* Tested with Chrome browser *

Program: Interactive game using jQuery and node.js which is a single-player
         version of the memory match game "Concentration".
         (Server and Client-side)


Files (in folder a3):

1) app.js (server)
2) public_html folder
      - index.html (html page for the website)
      - gameCient.js (The javascript that makes changes to html file)
      - 404.html (Error html page displayed when page does not exit)
      - favicon.ico
      - style.css (styling sheet for html elements)
3) node_module folder
4) res folder (contains makeBoard.js file which creates a random board for server)
5) readMe.txt


Usage:

1) Navigate to proper directory/folder of the app.js file inside the terminal (a3).
2) type 'node' and enter (make sure node is installed on your computer)
3) type the following, then press enter:

    node app.js

(The console will display a message that the server is running)

4) Go to your browser (preferably Chrome) and type in "http://localhost:2406/"
   into the url bar. Press enter.


Notes:

Size of the board will go from 4 to 6 to 8 to 10.
Once it reaches 10, every new board will be the size of 10.
(because of formatting issues with having so many tiles on screen)
