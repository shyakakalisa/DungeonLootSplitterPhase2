
// The loot array is the single source of truth for loot data.
let loot = [];

// Select the existing HTML elements.
let partySize = document.getElementById("partySize");
let lootName = document.getElementById("lootName");
let lootValue = document.getElementById("lootValue");
let lootQuantity = document.getElementById("lootQuantity");

let addLootBtn = document.getElementById("addLootBtn");
let splitLootBtn = document.getElementById("splitLootBtn");

let partyError = document.getElementById("partyError");
let lootError = document.getElementById("lootError");

let lootRows = document.getElementById("lootRows");
let lootTable = document.getElementById("lootTable");
let noLootMessage = document.getElementById("noLootMessage");

let lootTotalRow = document.getElementById("lootTotalRow");
let totalLoot = document.getElementById("totalLoot");

let splitResults = document.getElementById("splitResults");
let splitTotal = document.getElementById("splitTotal");
let lootPerMember = document.getElementById("lootPerMember");

// Validate input before adding an item to the array.
function addLoot() {
    let name = lootName.value.trim();
    let value = Number(lootValue.value);
    let quantity = Number(lootQuantity.value);

    lootError.textContent = "";

    if (name === "") {
        lootError.textContent = "Please enter a loot name.";
        return;
    }

    if (lootValue.value === "" ||
        !Number.isFinite(value) ||
        value < 0 ||
        !lootValue.validity.valid) {
        lootError.textContent = "Please enter a valid nonnegative loot value.";
        return;
    }

    if (lootQuantity.value === "" ||
        !Number.isInteger(quantity) ||
        quantity < 1) {
        lootError.textContent = "Quantity must be a whole number of at least 1.";
        return;
    }

    // Store each valid item as a plain object.
    let item = {
        name: name,
        value: value,
        quantity: quantity
    };

    loot.push(item);

    // Refresh the interface after changing the array.
    updateUI();

    // Clear the fields for the next item.
    lootName.value = "";
    lootValue.value = "";
    lootQuantity.value = "1";
}

// Remove the selected item and refresh the interface.
function removeLoot(index) {
    loot.splice(index, 1);
    updateUI();
}

// Centralize calculations and state-based rendering.
function updateUI() {
    let total = 0;
    let members = Number(partySize.value);
    let validParty = Number.isInteger(members) && members >= 1;

    // 1. Calculate the total currency value from the array.
    for (let i = 0; i < loot.length; i++) {
        total += loot[i].value * loot[i].quantity;
    }

    totalLoot.textContent = total.toFixed(2);
    splitTotal.textContent = total.toFixed(2);

    // 2. Rebuild the loot list from the current array.
    lootRows.innerHTML = "";

    for (let i = 0; i < loot.length; i++) {
        let row = document.createElement("tr");

        let nameCell = document.createElement("td");
        nameCell.textContent = loot[i].name;

        let valueCell = document.createElement("td");
        valueCell.textContent = "$" + loot[i].value.toFixed(2);

        let quantityCell = document.createElement("td");
        quantityCell.textContent = loot[i].quantity;

        let actionCell = document.createElement("td");

        let removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.textContent = "Remove";

        removeBtn.setAttribute(
            "aria-label",
            "Remove " + loot[i].name
        );

        removeBtn.addEventListener("click", function () {
            removeLoot(i);
        });

        actionCell.appendChild(removeBtn);

        row.appendChild(nameCell);
        row.appendChild(valueCell);
        row.appendChild(quantityCell);
        row.appendChild(actionCell);

        lootRows.appendChild(row);
    }

    // Display a helpful message for an invalid party size.
    if (partySize.value !== "" && !validParty) {
        partyError.textContent =
            "Party size must be a whole number of at least 1.";
    } else {
        partyError.textContent = "";
    }

    // 3. Calculate the split only when the state is valid.
    if (loot.length > 0 && validParty) {
        let share = total / members;
        lootPerMember.textContent = share.toFixed(2);
    } else {
        lootPerMember.textContent = "";
    }

    // 4. Enable or disable the Split Loot button.
    if (loot.length > 0 && validParty) {
        splitLootBtn.disabled = false;
    } else {
        splitLootBtn.disabled = true;
    }

    // 5. Control visibility based on application state.
    if (loot.length === 0) {
        noLootMessage.classList.remove("hidden");
        lootTable.classList.add("hidden");
        lootTotalRow.classList.add("hidden");
    } else {
        noLootMessage.classList.add("hidden");
        lootTable.classList.remove("hidden");
        lootTotalRow.classList.remove("hidden");
    }

    if (loot.length > 0 && validParty) {
        splitResults.classList.remove("hidden");
    } else {
        splitResults.classList.add("hidden");
    }
}

// Register event listeners outside the HTML.
addLootBtn.addEventListener("click", addLoot);
splitLootBtn.addEventListener("click", updateUI);
partySize.addEventListener("input", updateUI);

// Initialize the interface when the page loads.
updateUI();
