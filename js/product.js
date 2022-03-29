let url = new URL(document.location.href); 
let productId = url.searchParams.get('id')
let productData

class Products {
    constructor(id, name, imageUrl, description, altTxt, price, colors){
    this.id = id;
    this.name = name; 
    this.imageUrl = imageUrl;
    this.description = description;
    this.altTxt = altTxt;
    this.price = price;
    this.colors = colors;
    }
}


// Récupérer le produit via l'API
fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function (response) {
    if (response.ok) {
        return response.json();
    }
    })
    .then(function (data) {
        console.log(data)
        productData = data;
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
        <div class="colorBlocks">${colorsBlocks}<div id="alert-color"></div></div>
        
        <h3>Sélectionnez la quantité</h3>
        <div id="quantity-selector">
            <span id="moins" onclick="decreaseCount()" >-</span>
            <input type="number" id="quantity" value="1">
            <span id="plus" onclick="increaseCount()" >+</span>
            <div id="alert-quantity"></div>
        </div>
        <input id="send" onclick="addCart(productData)" value="Ajouter au panier" readonly/>
        <div id="add-cart"></div>
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
        return;
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
        return;
    }
}

function addCart(data){

    let productQuantity = document.getElementById('quantity').value;
    document.getElementById('alert-color').innerHTML = ""
    document.getElementById('alert-quantity').innerHTML = ""
    if(document.getElementsByClassName('active').length == 0 ){
        document.getElementById('alert-color').innerHTML = "Vous n'avez pas selectionné de couleur !";
        document.getElementById('alert-color').style.display = "block";
        document.getElementById('alert-quantity').style.display = "none";
        document.getElementById('add-cart').style.display = "none";
    }
    else if(productQuantity < 1 || productQuantity >100){
        document.getElementById('alert-quantity').innerHTML = "La quantité selectionnée n'est pas valide !";
        document.getElementById('alert-quantity').style.display = "block";
        document.getElementById('alert-color').style.display = "none";
        document.getElementById('add-cart').style.display = "none";
    }
    else{
        let productColor = document.getElementsByClassName('active')[0].classList[1];


        let newProduct = {
            productId,
            productName : data.name,
            productImg : data.imageUrl,
            productDescription : data.description,
            productTxt : data.altTxt,
            productPrice : data.price,
            productColors : productColor,
            productQuantity : productQuantity
        };


        actualCart = localStorage.getItem('cart');
        if(actualCart === null){
            actualCart = [];
            localStorage.setItem("cart", JSON.stringify(actualCart));
        }
        actualCart = localStorage.getItem('cart');
        actualCart = JSON.parse(actualCart);


        const alreadyIn = actualCart.find(
            obj => obj.productId === newProduct.productId && obj.productColors === newProduct.productColors);

        if (alreadyIn){
            let newQuantity = parseInt(newProduct.productQuantity) + parseInt(alreadyIn.productQuantity);
            alreadyIn.productQuantity = newQuantity;
            localStorage.setItem("cart", JSON.stringify(actualCart));
            document.getElementById('add-cart').style.display = "block";
            document.getElementById('alert-color').style.display = "none";
            document.getElementById('alert-quantity').style.display = "none";
        }

        else {
            actualCart.push(newProduct);
            localStorage.setItem("cart", JSON.stringify(actualCart));

            document.getElementById('add-cart').innerHTML = "Vos produits ont bien été ajoutés au panier !";
            document.getElementById('add-cart').style.display = "block";
            document.getElementById('alert-color').style.display = "none";
            document.getElementById('alert-quantity').style.display = "none";
        }
    }
}