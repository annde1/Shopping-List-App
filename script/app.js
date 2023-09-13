window.addEventListener("load", () => {
  //Variables:

  // Initialize the sum variable to keep track of the total cost.
  let sum = 0;
  const addBtn = document.querySelector("#addBtn");
  const saveBtn = document.querySelector("#saveListBtn");
  const sumArea = document.getElementById("total");
  const list = document.getElementById("theList");

  // Display initial total cost
  sumArea.innerText = `The total sum is: ${sum} NIS`;

  //Functions:

  // Function to create a new list item
  const createListItem = () => {
    // Get user input for item name and price
    const itemInput = document.querySelector("#itemInput");
    const priceInput = document.getElementById("priceInput");
    // Replace commas with periods in the price input in case user uses "," instead of "."
    priceInput.value = priceInput.value.replace(",", ".");
    // Define HTML for the new list item
    const html = ` 
                  <div class="form-check mt-4" >
                    <input class="form-check-input theCheck " type="checkbox" value="" id="flexCheckDefault">
                    <label class="form-check-label theLabel" id="item-label" for="flexCheckDefault">
                        ${itemInput.value}
                    </label>
                  </div>
                  `;
    // Validate user input
    if (
      itemInput.value == "" ||
      priceInput.value == "" ||
      isNaN(parseFloat(priceInput.value))
    ) {
      // Provide feedback to the user if input is missing or price is not a number
      itemInput.setAttribute("placeholder", "Please enter item name");
      priceInput.setAttribute("placeholder", "Please enter price");
    } else {
      // Add the new list item to the DOM
      list.insertAdjacentHTML("beforeend", html);
      // Update the total cost
      sum = sum + parseFloat(priceInput.value);
      sum = parseFloat(sum.toFixed(2));
      sumArea.innerText = `The total sum is: ${sum} NIS `;
    }
  };

  // Function to toggle the 'crossed-out' appearance of items
  const toggleCrossed = (e) => {
    const target = e.target;
    const parent = target.closest(".form-check");
    if (target.classList.contains("form-check-input")) {
      const sibling = parent.children[1];
      sibling.classList.toggle("cross-out");
    }
  };

  // Function to save the shopping list to local storage
  const saveList = () => {
    const checkboxes = Array.from(document.querySelectorAll(".theCheck"));
    const items = Array.from(document.querySelectorAll(".theLabel"));
    // Check if there are any items in the list to save
    if (!items.length) {
      return; //exit if there is nothing to save
    }
    // Initialize arrays to store checkbox state and item names
    let isChecked = [];
    let itemsArr = [];
    // Loop through checkboxes and item labels
    for (let i = 0; i < checkboxes.length; i++) {
      isChecked.push(checkboxes[i].checked);
      itemsArr.push(items[i].innerText);
    }
    // Create a shopping data object
    const shoppingData = {
      items: itemsArr,
      totalSum: sum,
      state: isChecked,
    };
    // Convert shopping data to a JSON string
    const jsonStr = JSON.stringify(shoppingData);
    // Save the JSON string to local storage
    localStorage.setItem("data", jsonStr);
  };
  // Function to restore the shopping list data from local storage when the page loads.
  const restoreList = () => {
    // Reset the total sum
    sum = 0;
    // Get the shopping list data from local storage
    const shoppingDataStr = localStorage.getItem("data");
    const shoppingListData = JSON.parse(shoppingDataStr);
    // Check if there is shopping list data in local storage
    if (!shoppingListData) {
      return; // Exit if there's no data to restore
    }

    // Loop through the saved items and add them to the list
    for (let i = 0; i < shoppingListData.items.length; i++) {
      let html = `<div class="form-check mt-4" >
                    <input class="form-check-input theCheck " type="checkbox" value="" id="flexCheckDefault">
                    <label class="form-check-label theLabel" id="item-label" for="flexCheckDefault">
                        ${shoppingListData.items[i]}
                    </label>
                  </div>`;
      // Add the restored item to the DOM
      list.insertAdjacentHTML("beforeend", html);
    }
    // Update the total sum
    sum = shoppingListData.totalSum;
    sumArea.innerText = `The total sum is: ${Math.floor(sum * 100) / 100} NIS`;

    // Set checkbox states based on the restored data
    const checkboxes = Array.from(document.querySelectorAll(".theCheck"));
    let boxesState = shoppingListData.state;
    checkboxes.forEach((checkbox, index) => {
      checkbox.checked = boxesState[index];

      // Get the sibling element (label) and apply 'cross-out' if checked
      const label = checkbox.nextElementSibling;
      if (checkbox.checked) {
        label.classList.add("cross-out");
      }
    });
  };

  //Event listeners:

  // Event listener for the "Add Item" button
  addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    createListItem();
  });
  // Event listener for changes in the shopping list (to toggle 'cross-out' effect)
  list.addEventListener("change", (e) => {
    toggleCrossed(e);
  });
  // Event listener for the "Save List" button
  saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    saveList();
  });
  // Restore the shopping list data when the page loads
  restoreList();
});
