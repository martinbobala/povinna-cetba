let otpValue
let emailG
let bookList
let selectedBooks = []
let formAlreadysent = false
let canDraw = false


const criteria = [
  { name: "Světová literatura 20. a 21. století", count: 4, currentCount: 0, errorMessage: "Vyberte minimálně 4 knihy z kategorie Světová literatura 20. a 21. století. \n" },
  { name: "Česká literatura 20. a 21. století", count: 5, currentCount: 0, errorMessage: "Vyberte minimálně 5 knih z kategorie Česká literatura 20. a 21. století.\n" },
  { name: "Světová a česká literatura 19. století", count: 3, currentCount: 0, errorMessage: "Vyberte minimálně 3 knihy z kategorie Světová a česká literatura 19. století.\n"},
  { name: "Světová a česká literatura do konce 18. století", count: 2, currentCount: 0, errorMessage: "Vyberte minimálně 2 khihy z kategorie Světová a česká literatura do konce 18. století.\n" },
  { name: "próza", count: 2, currentCount: 0, errorMessage: "Vyberte minimálně 2 díla z kategorie próza.\n" },
  { name: "poezie", count: 2, currentCount: 0, errorMessage: "Vyberte minimálně 2 díla z kategorie poesie.\n"},
  { name: "drama", count: 2, currentCount: 0, errorMessage: "Vyberte minimálně 2 díla z kategorie drama.\n"},
  { name: "počet knih", count: 20, currentCount: 0, errorMessage:"Vyberte alespoň 20 knih.\n" },
  { name: "autoři", currentCount: [], count: 2, errorMessage: "Můžete vybrat maximálně dvě knihy od stejného autora.\n" },

]


function drawAlert(warning, color) {
  if (canDraw) {
    let yellowColorB = "rgb(67, 53, 25)"
    let yellowColorD = "rgb(252, 225, 0)"

    let greenColorB = "rgb(57, 61, 27)"
    let greenColorD = "rgb(108, 203, 95)"

    let alert = document.querySelector("#alert")
    let paragraph = document.querySelector("#alertText")
 
    if (color == "green") {
      alert.style.setProperty("--backgroundColor", greenColorB)
      alert.style.setProperty("--dotColor", greenColorD)
      alert.style.setProperty("--iIcon", "none" )
      alert.style.setProperty("--checkmark", "1px")
    
    }else{
      alert.style.setProperty("--backgroundColor", yellowColorB)
      alert.style.setProperty("--dotColor", yellowColorD)
      alert.style.setProperty("--iIcon", "block" )
      alert.style.setProperty("--checkmark", "0px")

    }
    paragraph.textContent = warning
    alert.style.display = "flex"
    console.log('gfdsdf')
  }
  
  
  
  
}

function removeAlert() {
  let alert = document.querySelector("#alert")
  alert.style.display = "none"
}


function makeBookList() {
  
  fetch("https://script.google.com/macros/s/AKfycbwcnwHAjGUjS5OIApbrkRqbuqhIqE_B9MriFo3ofsQqftPAhi4hGcbYFNetHz1XLP4w/exec")
  .then(res=> res.json())
  .then(data => {

    
    bookList = data.data
    
    bookList.forEach(book => {
      
      if (book.genre !== "" || book.category !== "") {
        
        const listItem = document.createElement('li')
        
        listItem.innerHTML = `<input type='checkbox' class="checkbox" id="${book.name}" value='${book.name}'>
        <div class = "listText">
        <label class="book" for="${book.name}">${book.name}</label>
        <label class="author" for="${book.name}">${book.autor}(${book.genre})</label>
        </div>`
        
        document.getElementById(book.category).appendChild(listItem);
      }
      
      else{
        console.log("Chybí kategorie nebo žánr Knihy, Prosím zkontrolujte Google tabulku povinna cetba a jeji hodnoty u knihy " + book.name )
      }
    })
    
    onCheckboxChange()
    sendOtp()
    submit()
    submitForm()
    canDraw = true
    
  })
  
  
}

function sendOtp() {
  
  let emailAlreadySent = false
  
  document.getElementById("otpButton").addEventListener("click", function () {
    
    function generateOTP() {
      const digits = 6
      const min = Math.pow(10, digits - 1)
      const max = Math.pow(10, digits) - 1 
      return Math.floor(Math.random() * (max - min + 1)) + min
      
    }
    
    otpValue = generateOTP()
    
    
    let emailbody = `Váš ověřovací kód je: <h2>${otpValue}</h2>` 
    let emailValue = document.getElementById("email")
    
    function validateEmail(email) {
      
      let emailPattern = /^[a-z]+\.[a-z]+@tznj\.cz$/
      
      if (emailPattern.test(email.value) && emailAlreadySent === false) {
        
        drawAlert("E-mail byl úspěšně odeslán na adresu " + email.value + ". Prosím, zkontrolujte složku s nevyžádanou poštou spam, pokud e-mail není v doručené poště.", "green")
        emailAlreadySent = true
        emailG = emailValue
        return true
        
      } else if(emailAlreadySent === true){
        
        drawAlert("E-mail již byl úspěšně odeslán. Prosím, zkontrolujte složku s nevyžádanou poštou (spam), pokud e-mail není v doručené poště.")
        return false
        
      } else {
        
        drawAlert("Zadaný email není ve správném formátu nebo nepatří do domény tznj.cz.");
        return false
      }
    }
    
    if (validateEmail(emailValue)) {
      
      Email.send({
        SecureToken : "0d855591-c712-4eff-9dbd-8468ce2b569c",
        To : emailG.value,
        From : "martin.bobala@tznj.cz",
        Subject : "Ověřovací kód",
        Body : emailbody}).then(
          message => console.log(message));
          
        }
        
      })
      
    }
    
    function getObjectByName(name, arr) {
      return arr.find(item => item.name === name)
    }
    
    
    function onCheckboxChange() {
      
      function handleCheckboxChange(event) {
        
        removeAlert()
        const book = getObjectByName(event.target.value, bookList)
        
        
        
        const genreCriterium = getObjectByName(book.genre, criteria)
        const categoryCriterium = getObjectByName(book.category, criteria)
        const countCriterium = getObjectByName("počet knih", criteria)
        
        const autorCriterium = getObjectByName("autoři", criteria)
        const autorArr = autorCriterium.currentCount
        
        const criteriaArr = [genreCriterium, categoryCriterium, countCriterium]
        
        
        function removeData(){
          const index = autorArr.indexOf(book.autor);
          const bookIndex = selectedBooks.indexOf(book.name)
          if (index !== -1) {
            autorArr.splice(index, 1)
            selectedBooks.splice(bookIndex, 1)
          }
          
          criteriaArr.forEach(criterum =>{
            
            criterum.currentCount -= 1
          })
          
        }
        
        if (event.target.checked) {
          
          autorArr.push(book.autor)
          selectedBooks.push(book.name) //pokud bude potreba pridat i autora
          criteriaArr.forEach(criterum =>{
            
            criterum.currentCount += 1
          })
          
          const count = {}
          
          autorArr.forEach(autor => {
            count[autor] = (count[autor] || 0) +1
            if (count[autor] > autorCriterium.count) {
              removeData()
              event.target.checked = false
              drawAlert(autorCriterium.errorMessage)
            }
            
          })
          
        } else {
          
          removeData()
          
        }
        
      }
      
      
      
      
      const checkBoxes = document.querySelectorAll('input[type="checkbox"]')
      
      checkBoxes.forEach(checkbox => {
        checkbox.addEventListener("change", handleCheckboxChange)
      })
    }
    
    function submitForm() {
      document.getElementById("otpButton").addEventListener("click", function(e) {
        e.preventDefault()
      })
    }
    
    
    function submit(){
      document.getElementById("submitButton").addEventListener("click", function(e) {
        e.preventDefault()
        
        let missingCriteria = []
        
        
        function checkCriteria() {
          criteria.slice(0, -1).forEach(criterium => {
            if (criterium.count <= criterium.currentCount) {
              
              
            }else{
              
              missingCriteria.push(criterium.errorMessage)
            }
          })
          
          if (missingCriteria.length == []) {
            return true
          } else {
            drawAlert(missingCriteria)
            return false
          }
        }
        
        
        
        if (checkCriteria() ) {
          console.log(formAlreadysent)
          if (otpValue === parseInt(document.getElementById("otpinput").value) && formAlreadysent === false ) {
            
            formAlreadysent = true
            
            
            function extractNameFromEmail() {
              
              let parts = emailG.value.split('@')[0].split('.')
              parts = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1))
              
              return parts.join(' ')
              
            }
            
            let bookSting = selectedBooks.join("&")
            
            let formDataString = "" + extractNameFromEmail() + "&" + emailG.value + "&" + bookSting + ""
            
            drawAlert("odesílání..", "green")
            
            fetch("https://script.google.com/macros/s/AKfycbwzSjPQyE-1w9uNlx_tuPudBVhgYED874Rp6JcZr87Rcg5roaTP6qBYSrB4fRHa3UIYGw/exec",
            {
              method:"POST",
          body: (formDataString),
          
          
          
        }).then(res => res.text())
        .then(res => drawAlert("Odesláno"), "green") 
        
      } else if(formAlreadysent){
        drawAlert("Formulář byl již odeslán.")
      } else {
        drawAlert("Ověřovací kód je neplatný.")
      }
      
    } 
  }) 
}





document.addEventListener("DOMContentLoaded", function() {
  
  

})


makeBookList()



