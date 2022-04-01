let url = new URL(document.location.href); 
let productId = url.searchParams.get('id')
let productData
let lang = document.querySelector('html').lang

/** Retrieve the product via the API */
fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function (response) {
    if (response.ok) {
        return response.json();
    }
    })
    .then(function (data) {
        productData = data;
        productBlock(data);
    })
    .catch(function (error) {});


/** Construction of the content of the product page */
function productBlock(data){

    // Construction du bloc produit
    let productPage = document.querySelector('#product-page')
    let template = document.querySelector('#product-block')
    let clone = document.importNode(template.content, true);
    clone.querySelector("img").setAttribute("src", data.imageUrl);
    clone.querySelector("img").setAttribute("alt", data.altTxt);
    clone.querySelector("h2").textContent = data.name;
    clone.querySelectorAll("p")[0].textContent = data.description;
    clone.querySelectorAll("p")[1].textContent = `${data.price} €`;

    productPage.appendChild(clone);

    // Construction of the form for adding the product in the cart
    let productForm = document.querySelector('#product-page')
    let templateForm = document.querySelector('#product-add-cart')
    let cloneForm = document.importNode(templateForm.content, true);
    productForm.appendChild(cloneForm);
    let listColors = document.querySelector('.colorBlocks')
    for(color of data.colors ){
        newColor = color.replace('/', '_');
        let newDiv = document.createElement("div");
        newDiv.classList.add(`color`)
        newDiv.classList.add(newColor)
        listColors.appendChild(newDiv);
    }
    let newDivAlert = document.createElement("div");
    newDivAlert.setAttribute("id", `alert-color`)
    listColors.appendChild(newDivAlert);

}

/** Listening the choice of colors */
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

/** Function for reducing the quantity */
function decreaseCount(){
    const quantityValue = document.getElementById("quantity")
    if(quantityValue.value == 1){
        return;
    }
    else{
        quantityValue.value = parseInt(quantityValue.value)-1
    }
}

/** Function for increasing the quantity */
function increaseCount(){
    const quantityValue = document.getElementById("quantity")
    if( quantityValue.value < 101){
        quantityValue.value = parseInt(quantityValue.value)+1
    }
    else{
        return;
    }
}

/** Function for adding the product in the cart */
function addCart(data){
    let productQuantity = document.getElementById('quantity').value;
    document.getElementById('alert-color').textContent = ""
    document.getElementById('alert-quantity').textContent = ""
    // Verify if a color is selected
    if(document.getElementsByClassName('active').length == 0 ){
        
        if (lang == "fr"){
            document.getElementById('alert-color').textContent = "Vous n'avez pas selectionné de couleur !";
        }
        else if (lang == "en"){
            document.getElementById('alert-color').textContent = "You didn't select the color !";
        }
        document.getElementById('alert-color').style.display = "block";
        document.getElementById('alert-quantity').style.display = "none";
        document.getElementById('add-cart').style.display = "none";
    }
    // Verify if the quantity selected is valid
    else if(productQuantity < 1 || productQuantity >100){
        if (lang == "fr"){
            document.getElementById('alert-quantity').textContent = "Vous n'avez pas selectionné de couleur !";
        }
        else if (lang == "en"){
            document.getElementById('alert-quantity').textContent = "The quantity value is not valid !";
        }
        document.getElementById('alert-quantity').style.display = "block";
        document.getElementById('alert-color').style.display = "none";
        document.getElementById('add-cart').style.display = "none";
    }
    // Add the product in the cart
    else{
        let productColor = document.getElementsByClassName('active')[0].classList[1];

        // Create the product object
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

        // Retrieve the actual cart
        actualCart = localStorage.getItem('cart');
        // If it doesn't exist we create it
        if(actualCart === null){
            actualCart = [];
            localStorage.setItem("cart", JSON.stringify(actualCart));
        }
        actualCart = localStorage.getItem('cart');
        actualCart = JSON.parse(actualCart);

        // Check if the product is already in the cart
        const alreadyIn = actualCart.find(
            obj => obj.productId === newProduct.productId && obj.productColors === newProduct.productColors);
        
        // If the product already exists we only update the quantity
        if (alreadyIn){
            let newQuantity = parseInt(newProduct.productQuantity) + parseInt(alreadyIn.productQuantity);
            alreadyIn.productQuantity = newQuantity;
            localStorage.setItem("cart", JSON.stringify(actualCart));
            document.getElementById('add-cart').style.display = "block";
            document.getElementById('alert-color').style.display = "none";
            document.getElementById('alert-quantity').style.display = "none";
        }

        // If the product doesn't exist we add it
        else {
            actualCart.push(newProduct);
            localStorage.setItem("cart", JSON.stringify(actualCart));

            if (lang == "fr"){
                document.getElementById('add-cart').textContent = "Vos produits ont bien été ajoutés au panier !";
            }
            else if (lang == "en"){
                document.getElementById('add-cart').textContent = "Your products have been added to your cart !";
            }
            document.getElementById('add-cart').style.display = "block";
            document.getElementById('alert-color').style.display = "none";
            document.getElementById('alert-quantity').style.display = "none";
        }
    }
}