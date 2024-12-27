# Contract-Editor

TODO: start work on building backend (i.e. parser functions)!!!
1. txt (i.e. the DSL language i create) --> JSON
2. JSON --> PDF / DOCX


## Overview

An app for lawyers to draft contracts programmatically; an IDE for lawyers to draft contracts programatically (incl. the programmatic language).

>"there is a crucial similarity between lawyers and programmers: the way they use words. Computer science and law are both linguistic professions. Programmers and lawyers use language to create, manipulate, and interpret complex abstractions. A programmer who uses the right words in the right way makes a computer do something. A lawyer who uses the right words in the right way changes people’s rights and obligations. There is a nearly exact analogy between the text of a program and the text of a law.": [[grimmelmannProgrammingLanguagesLaw2022]]

## How I see it working

A code editor for lawyers. This editor will have the lawyer draft contracts in the same manner a software developer would code. It is simply a tool to draft contracts. The code will contain the drafting of a contract along with all the code necessary to format the contract. The human-readable contract will appear adjacent to your code and will live-update with every amendment to your drafting. 

The far right hand side will show the lawyer the data stored in the contract. For example, it will show all defined terms instantiated. This would be similar to the 'environment' pane in RStudio.

The language to generate the contract may be approached in a couple different ways:
* The code may be a Domain Specific Language which specifies how you want your contract to be generated. This would then be parsed/compiled to generate the contract. This would involve creating a brand new language and create a new compiler/interpreter.
* It may be something like the mdx project. In that project, markdown (ordinary text) is mixed with react components (javascript code), allowing your text to have interactive components interlaced. 
	* This could be implemented similarly to how the Accord Project builds their templating project. The text for Accord Project templates is written using markdown. It builds on the CommonMark standard so that any CommonMark document is valid text for a template or contract. Accord Project uses two extensions to CommonMark: CiceroMark for the contract text, and TemplateMark for the template grammar.
	* Also, I could add parameters to these 'clause' blocks (e.g. a random ID, a clause reference) so that you can make cross references
		* to allow for dynamic cross references, you would add event listeners to each clause block, and where the new state (i.e. the clause number) is different to the past state (i.e. the clause number before you made the amendment), you would update the cross reference

It would be a 'hybrid' contract. It would not be 'smart' and self-executable, however it could be adapted to do so.

The code will be written in separate files, similar to a web application framework. There will be a config file (where you can set the formatting options), a main file, a data file (if necessary), etc. This project could evolve to something similar to LaTeX where you can include separate files and sections for your one thesis: https://www.youtube.com/watch?v=zqQM66uAig0&t=383s&ab_channel=Dr.TreforBazett


## Mock-up

[Project Mock-up](<Contract Editor project wireframe.pdf>)


