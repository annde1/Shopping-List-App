window.addEventListener("load", () => {
  // Initialize the sum variable to keep track of the total cost.
  let sum = 0;
  const btn = document.querySelector("#addBtn");
  const sumArea = document.getElementById("total");
  sumArea.innerText = `The total sum is: ${sum} NIS`; // Display initial total cost
  const list = document.getElementById("theList");

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const itemInput = document.querySelector("#itemInput");
    const priceInput = document.getElementById("priceInput");

    const html = ` 
                  <div class="form-check mt-4" >
                    <input class="form-check-input theCheck " type="checkbox" value="" id="flexCheckDefault">
                    <label class="form-check-label theLabel" id="item-label" for="flexCheckDefault">
                        ${itemInput.value}
                    </label>
                  </div>
                  `;

    if (
      itemInput.value == "" ||
      priceInput.value == "" ||
      isNaN(parseFloat(priceInput.value))
    ) {
      itemInput.setAttribute("placeholder", "Please enter item name");
      priceInput.setAttribute("placeholder", "Please enter price");
    } else {
      list.insertAdjacentHTML("beforeend", html);
      sum = sum + parseFloat(priceInput.value);
      sumArea.innerText = `The total sum is: ${
        Math.floor(sum * 100) / 100
      } NIS `;
    }
  });

  list.addEventListener("change", (e) => {
    const target = e.target;
    const parent = target.closest(".form-check");
    if (target.classList.contains("form-check-input")) {
      const sibling = parent.children[1];
      sibling.classList.toggle("cross-out");
    }
  });

  const saveBtn = document.querySelector("#saveListBtn");
  saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const checkboxes = document.querySelectorAll(".theCheck");
    const items = Array.from(document.querySelectorAll(".theLabel"));

    const nodeArray = Array.from(checkboxes);
    let isChecked = [];
    let itemsArr = [];
    for (let i = 0; i < nodeArray.length; i++) {
      isChecked.push(nodeArray[i].checked);
      itemsArr.push(items[i].innerText);
    }

    //Create array for items to save in local storage
    const shoppingData = {
      items: itemsArr,
      totalSum: sum,
      state: isChecked,
    };
    const jsonStr = JSON.stringify(shoppingData);
    localStorage.setItem("data", jsonStr);
  });
  // Function to restore the shopping list data from local storage when the page loads.
  const restorePage = () => {
    sum = 0;
    const shoppingDataStr = localStorage.getItem("data");
    const shoppingListData = JSON.parse(shoppingDataStr);
    if (shoppingListData == null) {
      return;
    }

    for (let i = 0; i < shoppingListData.items.length; i++) {
      let html = `                <div class="form-check mt-4" >
                    <input class="form-check-input theCheck " type="checkbox" value="" id="flexCheckDefault">
                    <label class="form-check-label theLabel" id="item-label" for="flexCheckDefault">
                        ${shoppingListData.items[i]}
                    </label>
                  </div>`;
      list.insertAdjacentHTML("beforeend", html);
    }

    sum = shoppingListData.totalSum;
    let boxesState = shoppingListData.state;
    sumArea.innerText = `The total sum is: ${Math.floor(sum * 100) / 100} NIS`;
    const checkboxes = Array.from(document.querySelectorAll(".theCheck"));
    checkboxes.forEach((checkbox, index) => {
      checkbox.checked = boxesState[index];
      const label = checkbox.nextElementSibling;
      if (checkbox.checked) {
        label.classList.add("cross-out");
      }
    });
  };
  restorePage();
});
