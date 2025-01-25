# AI + ME

This projct would not be possible with out my ai coding companion.

This file is for me to write my ideas for the project, so that you can better help me. Thanks!

---

Step 1

Create a simple three page website, following the SLEET_DESIGN.md
The index file should have large button links to to the pages.
Footer should have links to all pages.
Other than that ther will be no menu.


web_playground
    ├── css
    │   └── index.css
    ├── index.html
    ├── js
    └── pages
        ├── account.html
        └── sub.html


----

Step 2 add elements to the account html

We need to have something that resembles a form
- we will need a text input
- and then a button that says create
- we will also need a connect wallet button
- and then a button or toggle switch for toggling between testnet and mainnet, will add funinality to that later
- will also need a save button

 the wallet connect and network toggle button can be at the top, then text input and create button, then save button
 make is look beautiful with css


---

Step three add functionality

i decide to remove the save button since we don't need that.
now it is time to add functionality.
this will be tool for creating new near accounts using near api js.
the reason they will need to connect their wallet is becuase I think there is a fee for createing near accounts, also i relize that we will need to turn this into a disconnect button once their wallet it conneced. and use the new near wallet connect
the user can choose what network they want to create a new account on, i think they will have choose network before they connect their wallet?
then they can type in whatever they want as long as it is valid i think dashes and spaces are not allowed, as well as accounts that have already been taken.
then when they click the create button a wallet promt should pop up to pay fee for creating the new near account.
once the new near account has been created the account info should appear just below the create button, this info will have the near address, public key, private key, seed phrase, and message to save this info in a save place

give me the js and any addition css or html to make this work beatifully.
I am not sure how all the specifics work, and if all the js needs to all be in one file, but you can figure it out.
thank you so much!