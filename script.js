document.addEventListener("DOMContentLoaded", function () {
  let bookList;
  let selectedBooks = [];
  const listedBooks = [];
  let formAlreadysent = false;
  let canDraw = false;

  const criteria = [
    {
      name: "Světová literatura 20. a 21. století",
      count: 4,
      currentCount: 0,
      errorMessage:
        "Vyberte minimálně 4 knihy z kategorie Světová literatura 20. a 21. století.\n",
    },
    {
      name: "Česká literatura 20. a 21. století",
      count: 5,
      currentCount: 0,
      errorMessage:
        "Vyberte minimálně 5 knih z kategorie Česká literatura 20. a 21. století.\n",
    },
    {
      name: "Světová a česká literatura 19. století",
      count: 3,
      currentCount: 0,
      errorMessage:
        "Vyberte minimálně 3 knihy z kategorie Světová a česká literatura 19. století.\n",
    },
    {
      name: "Světová a česká literatura do konce 18. století",
      count: 2,
      currentCount: 0,
      errorMessage:
        "Vyberte minimálně 2 knihy z kategorie Světová a česká literatura do konce 18. století.\n",
    },
    {
      name: "próza",
      count: 2,
      currentCount: 0,
      errorMessage: "Vyberte minimálně 2 díla z kategorie próza.\n",
    },
    {
      name: "poezie",
      count: 2,
      currentCount: 0,
      errorMessage: "Vyberte minimálně 2 díla z kategorie poesie.\n",
    },
    {
      name: "drama",
      count: 2,
      currentCount: 0,
      errorMessage: "Vyberte minimálně 2 díla z kategorie drama.\n",
    },
    {
      name: "autoři",
      currentCount: [],
      count: 2,
      errorMessage: "Můžete vybrat maximálně dvě knihy od stejného autora.\n",
    },
  ];

  function drawPicked() {
    let pickedBooks = document.querySelector("#bookdiv");
    pickedBooks.style.display = "block";
  }

  function drawAlert(warning, color) {
    if (canDraw) {
      let yellowColorB = "rgb(67, 53, 25)";
      let yellowColorD = "rgb(252, 225, 0)";
      let greenColorB = "rgb(57, 61, 27)";
      let greenColorD = "rgb(108, 203, 95)";
      let alert = document.querySelector("#alert");
      let paragraph = document.querySelector("#alertText");

      if (color == "green") {
        alert.style.setProperty("--backgroundColor", greenColorB);
        alert.style.setProperty("--dotColor", greenColorD);
        alert.style.setProperty("--iIcon", "none");
        alert.style.setProperty("--checkmark", "1px");
      } else {
        alert.style.setProperty("--backgroundColor", yellowColorB);
        alert.style.setProperty("--dotColor", yellowColorD);
        alert.style.setProperty("--iIcon", "block");
        alert.style.setProperty("--checkmark", "0px");
      }
      paragraph.textContent = warning;
      alert.style.display = "flex";
    }
  }

  function removeAlert() {
    let alert = document.querySelector("#alert");
    alert.style.display = "none";
  }

  function makeBookList() {
    fetch(
      "https://script.google.com/macros/s/AKfycbwcnwHAjGUjS5OIApbrkRqbuqhIqE_B9MriFo3ofsQqftPAhi4hGcbYFNetHz1XLP4w/exec"
    )
      .then((res) => res.json())
      .then((data) => {
        bookList = data.data;

        bookList.forEach((book) => {
          if (book.genre !== "" || book.category !== "") {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<input type='checkbox' class="checkbox" id="${book.name}" value='${book.name}'>
            <div class = "listText">
            <label class="book" for="${book.name}">${book.name}</label>
            <label class="author" for="${book.name}">${book.autor}(${book.genre})</label>
            </div>`;
            document.getElementById(book.category).appendChild(listItem);
          } else {
            console.log(
              "Chybí kategorie nebo žánr Knihy, Prosím zkontrolujte Google tabulku povinna cetba a jeji hodnoty u knihy " +
                book.name
            );
          }
        });

        onCheckboxChange();
        submit();
        submitForm();
        setupCopyButton();
        canDraw = true;
      });
  }

  function getObjectByName(name, arr) {
    return arr.find((item) => item.name === name);
  }

  function onCheckboxChange() {
    function handleCheckboxChange(event) {
      removeAlert();
      const book = getObjectByName(event.target.value, bookList);
      const genreCriterium = getObjectByName(book.genre, criteria);
      const categoryCriterium = getObjectByName(book.category, criteria);
      const countCriterium = getObjectByName("počet knih", criteria);
      const autorCriterium = getObjectByName("autoři", criteria);
      const autorArr = autorCriterium.currentCount;
      const criteriaArr = [genreCriterium, categoryCriterium, countCriterium];

      function removeData() {
        const index = autorArr.indexOf(book.autor);
        const bookIndex = selectedBooks.indexOf(book.name);
        if (index !== -1) {
          autorArr.splice(index, 1);
          selectedBooks.splice(bookIndex, 1);
        }

        criteriaArr.forEach((criterum) => {
          if (criterum) {
            criterum.currentCount -= 1;
          }
        });
      }

      if (event.target.checked) {
        autorArr.push(book.autor);
        selectedBooks.push(book.name);
        criteriaArr.forEach((criterum) => {
          if (criterum) {
            criterum.currentCount += 1;
          }
        });

        const count = {};

        autorArr.forEach((autor) => {
          count[autor] = (count[autor] || 0) + 1;
          if (count[autor] > autorCriterium.count) {
            event.target.checked = false;

            const checkbox = event.target;
            checkbox.classList.add("highlight");
            setTimeout(() => {
              checkbox.classList.remove("highlight");
            }, 500);

            removeData();
            drawAlert(autorCriterium.errorMessage);
          }
        });
      } else {
        removeData();
      }
    }

    const checkBoxes = document.querySelectorAll('input[type="checkbox"]');

    checkBoxes.forEach((checkbox) => {
      checkbox.addEventListener("change", handleCheckboxChange);
    });
  }

  function submitForm() {
    const otpButton = document.getElementById("otpButton");
    if (otpButton) {
      otpButton.addEventListener("click", function (e) {
        e.preventDefault();
      });
    }
  }

  function setupCopyButton() {
    const copyButton = document.getElementById("copyButton");
    if (copyButton) {
      copyButton.addEventListener("click", function (e) {
        e.preventDefault();

        function copyListItems() {
          const listItems = document.querySelectorAll("#bookSheet li");
          let textToCopy = "";

          selectedBooks.forEach((item) => {
            // Remove extra spaces and newlines
            textToCopy += item.trim() + "\n";
          });

          // Remove last newline
          textToCopy = textToCopy.trim();

          // Create a temporary textarea element
          const textarea = document.createElement("textarea");
          textarea.value = textToCopy;
          textarea.setAttribute("readonly", ""); // Make it readonly
          textarea.style.position = "absolute";
          textarea.style.left = "-9999px"; // Move it outside of view

          document.body.appendChild(textarea);
          textarea.select();

          try {
            // Execute copy command
            document.execCommand("copy");
            document.body.removeChild(textarea);
          } catch (err) {
            console.error("Failed to copy text:", err);
          }
        }

        copyListItems();
      });
    }
  }

  function submit() {
    const submitButton = document.getElementById("submitButton");
    if (submitButton) {
      submitButton.addEventListener("click", function (e) {
        e.preventDefault();

        let missingCriteria = [];

        function createSheet() {
          selectedBooks.forEach((book) => {
            const listItem = document.createElement("li");
            listItem.className = "li2";
            listItem.innerHTML = `<label class="gridBook">${book}</label>`;
            listedBooks.push(listItem);
            document.getElementById("bookSheet").appendChild(listItem);
          });
        }

        function checkCriteria() {
          criteria.slice(0, -1).forEach((criterium) => {
            if (criterium.count <= criterium.currentCount) {
              // Criteria met
            } else {
              drawAlert(criterium.errorMessage);
              missingCriteria.push(criterium.errorMessage);
            }
          });

          if (missingCriteria.length === 0) {
            if (selectedBooks.length > 20) {
              drawAlert(
                "Vyberte maximálně 20 knih. Aktuální počet vybraných knih:" +
                  selectedBooks.length
              );
            } else if (selectedBooks.length < 20) {
              drawAlert(
                "Vyberte alespoň 1 knihu. Aktuální počet vybraných knih:" +
                  selectedBooks.length
              );
            } else {
              return true;
            }
          } else {
            drawAlert(missingCriteria.join("\n"));
            return false;
          }
        }

        if (checkCriteria()) {
          if (formAlreadysent === false) {
            formAlreadysent = true;
            drawAlert("Tabulka byla úspěšně vytvořena", "green");
            createSheet();
            drawPicked();
          } else if (formAlreadysent === true) {
            listedBooks.forEach((listItem) => {
              listItem.remove();
            });
            drawAlert("Tabulka byla úspěšně aktualizována", "green");
            createSheet();
            drawPicked();
          } else {
            console.log("chyba v criteriaCheck");
          }
        }
      });
    }
  }

  makeBookList();
});
