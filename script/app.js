window.addEventListener("load", () => {
  let sum = 0;
  const btn = document.querySelector("#addBtn");
  const sumArea = document.getElementById("total");
  sumArea.innerText = `The total sum is: ${sum} NIS`;

  //when clicking on the submit button the list items get added to the list
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const itemInput = document.querySelector("#itemInput");
    const priceInput = document.getElementById("priceInput");
    const listNameInput = document.getElementById("listName");
    const list = document.getElementById("theList");
    const listTitle = document.getElementById("listTitle");

    const html = ` 
                  <div class="form-check mt-4" >
                    <input class="form-check-input theCheck " type="checkbox" value="" id="flexCheckDefault">
                    <label class="form-check-label theLabel" for="flexCheckDefault">
                        ${itemInput.value}
                    </label>
                  </div>
                  `;

    if (itemInput.value == "" || priceInput.value == "") {
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
  //when checking the checkbox remove the item from the list
  const list = document.getElementById("theList");
  list.addEventListener("change", (e) => {
    const target = e.target;
    const parent = target.closest(".form-check");
    if (target.classList.contains("form-check-input")) {
      // parent.remove();

      const sibling = parent.children[1];
      console.log(sibling);
      sibling.classList.toggle("cross-out");
    }
  });

  const saveBtn = document.querySelector("#saveListBtn");
  saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const list = document.getElementById("theList");
    const checkboxes = document.querySelectorAll(".theCheck");
    console.log(checkboxes);
    const nodeArray = Array.from(checkboxes);
    let isChecked = [];
    for (let i = 0; i < nodeArray.length; i++) {
      isChecked.push(nodeArray[i].checked);
    }
    console.log(nodeArray);
    console.log(isChecked);

    const shoppingData = {
      items: list.innerHTML,
      totalSum: sum,
      state: isChecked,
    };
    const jsonStr = JSON.stringify(shoppingData);
    console.log(jsonStr);
    console.log(shoppingData);
    localStorage.setItem("data", jsonStr);
  });
  const restorePage = () => {
    sum = 0;
    const shoppingDataStr = localStorage.getItem("data");
    const shoppingListData = JSON.parse(shoppingDataStr);
    if (shoppingListData == null) {
      return;
    }
    list.innerHTML = shoppingListData.items;
    sum = shoppingListData.totalSum;
    let boxesState = shoppingListData.state;
    sumArea.innerText = `The total sum is: ${Math.floor(sum * 100) / 100} NIS`;
    const checkboxes = Array.from(document.querySelectorAll(".theCheck"));
    checkboxes.forEach((checkbox, index) => {
      checkbox.checked = boxesState[index];
    });
  };
  restorePage();
});
