let url = new URL(document.location.href); 
let idProduct = url.searchParams.get('id')


// Récupérer le produit via l'API
fetch(`http://localhost:3000/api/products/${idProduct}`)
    .then(function (response) {
    if (response.ok) {
        return response.json();
    }
    })
    .then(function (data) {
        console.log(data)
        productBlock(data);
    })
    .catch(function (error) {});


// Construction du block produit
function productBlock(data){
    const productBlockDiv = document.getElementById("product-page");
    
    let colorsBlocks = ""
    for(color of data.colors ){
        newColor = color.replace('/', '');
        colorsBlocks += `<div class="color ${newColor}"></div>`
    }

    productBlockDiv.innerHTML = `
    <article>
        <img src="${data.imageUrl}" alt="${data.altTxt}">
        <div id="product-description">
            <h2>${data.name}</h2>
            <p>${data.description}</p>
            <p class="price">${data.price} €</p>
        </div>
    </article>
    <form>
        <h3>Sélectionnez la couleur</h3>
        <div class="colorBlocks">${colorsBlocks}</div>
        <div id="alertColor"></div>
        <h3>Sélectionnez la quantité</h3>
        <div id="quantity-selector">
            <span id="moins" onclick="decreaseCount()" >-</span>
            <input type="number" id="quantity" value="1">
            <span id="plus" onclick="increaseCount()" >+</span>
        </div>
        <input id="send" onclick="addBasket()" value="Ajouter au panier" readonly/>
    </form>
    `
}


document.addEventListener("click", event => {
    const target = event.target;
    if (target.className.includes('color') && !target.className.includes('colorBlocks'))  {
        const radioButtons = document.getElementsByClassName("color")
        for(button of radioButtons){
            button.classList.remove("active");
        }
        target.classList.toggle("active");
    }
})

function decreaseCount(){
    const quantityValue = document.getElementById("quantity")
    if(quantityValue.value == 1){
        return
    }
    else{
        quantityValue.value = parseInt(quantityValue.value)-1
    }
}


function increaseCount(){
    const quantityValue = document.getElementById("quantity")
    if( quantityValue.value < 101){
        quantityValue.value = parseInt(quantityValue.value)+1
    }
    else{
        return
    }
}


function addBasket(){
    
}