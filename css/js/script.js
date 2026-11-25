
"use strict";

// This array stores the loot items between button clicks.
const loot = [];

const addButton = document.getElementById("addButton");
const splitButton = document.getElementById("splitButton");

function calculateTotal() {
    let total = 0;

    // Add the value of every item in the loot array.
    for (let i = 0; i < loot.length; i++) {
        total += loot[i].value;
    }

    return total;
}

function addLoot() {
    const name = document.getElementById("lootName").value.trim();
    const valueInput = document.getElementById("lootValue").value.trim();
    const message = document.getElementById("addMessage");

    if (name === "") {
        message.textContent = "Please enter a loot name.";
        return;
    }

    if (valueInput === "" || !Number.isFinite(Number(valueInput))) {
        message.textContent = "Please enter a valid loot value.";
        return;
    }

    const value = Number(valueInput);

    if (value < 0 || !Number.isInteger(value * 100)) {
        message.textContent = "Enter a nonnegative value with up to two decimal places.";
        return;
    }

    // Store the name and value together in one object.
    const item = {
        name: name,
        value: value
    };

    loot.push(item);

    document.getElementById("lootName").value = "";
    document.getElementById("lootValue").value = "";

    message.textContent = "Loot added successfully.";

    renderLoot();

    // Clear the old split because the total has changed.
    document.getElementById("splitTotal").textContent = "0.00";
    document.getElementById("perMember").textContent = "0.00";
    document.getElementById("splitMessage").textContent =
        "Loot changed. Click Split Loot to calculate again.";
}

function renderLoot() {
    const list = document.getElementById("lootList");

    list.textContent = "";

    if (loot.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.textContent = "No loot added yet.";
        list.appendChild(emptyItem);
    }

    // Create a list item for each object in the array.
    for (let i = 0; i < loot.length; i++) {
        const listItem = document.createElement("li");

        listItem.textContent =
            loot[i].name + " - $" + loot[i].value.toFixed(2);

        list.appendChild(listItem);
    }

    document.getElementById("runningTotal").textContent =
        calculateTotal().toFixed(2);
}

function splitLoot() {
    const partyInput = document.getElementById("partySize").value.trim();
    const message = document.getElementById("splitMessage");

    // Reset previous results before checking the inputs.
    document.getElementById("splitTotal").textContent = "0.00";
    document.getElementById("perMember").textContent = "0.00";

    if (partyInput === "") {
        message.textContent = "Please enter the party size.";
        return;
    }

    const partySize = Number(partyInput);

    if (!Number.isInteger(partySize) || partySize < 1) {
        message.textContent =
            "Party size must be a whole number of at least 1.";
        return;
    }

    if (loot.length === 0) {
        message.textContent = "Please add loot before splitting.";
        return;
    }

    const total = calculateTotal();
    const share = total / partySize;

    document.getElementById("splitTotal").textContent =
        total.toFixed(2);

    document.getElementById("perMember").textContent =
        share.toFixed(2);

    message.textContent = "Loot split calculated successfully.";
}

// Buttons run their functions when clicked.
addButton.addEventListener("click", addLoot);
splitButton.addEventListener("click", splitLoot);

renderLoot();
