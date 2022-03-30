// Affichage du panier lors du chargement de la page
updateCart()


// Fonction d'affichage du panier
function updateCart(){
    let actualCart = JSON.parse(localStorage.getItem("cart"));
    const productListDiv = document.getElementById("products-list");
    let totalPrice = 0
    if (actualCart === null || actualCart.length == 0){

        document.getElementById('empty-cart-alert').style.display = "block";
        document.getElementById('total-price').style.display = "none";
        document.getElementById('form').style.display = "none";
        document.getElementById('send').style.display = "none";
    }
    else{
        productListDiv.innerHTML = ""
        for(product of actualCart){
            
            totalPrice = totalPrice + (parseInt(product.productPrice) * parseInt(product.productQuantity))
            let idProduct = product.productId +"-"+ product.productColors;
            productListDiv.innerHTML += `
            <article class="product-article">
                <img src="${product.productImg}" alt="${product.productTxt}">
                <div id="product-description">
                    <h2>${product.productName}</h2>
                    <p>${product.productColors}</p>
                </div>
                <div id="product-price">
                    <p class="price">${product.productPrice} €</p>
                </div>
                <div id="${idProduct}" class="quantity-selector">
                    <p class="quantity-label">Quantité : </p>
                    <input type="number" id="quantity" class="quantity" required value="${product.productQuantity}">
                    <span id="delete" class="delete-product"><i class="fa-solid fa-xmark"></i></span>
                    <div class="alert-quantity"></div>
                </div>
            </article>`
        };
        document.getElementById("total-price-container").innerHTML = totalPrice + "€";
    }
}

// Ecoute d'un changement de quantité
document.addEventListener("change", event => {
    let targetProduct = event.target;
    let targetProductParent = targetProduct.parentElement;
    if (targetProduct.className.includes('quantity') )  {
        targetProductParent = targetProductParent.id.split('-');
        let updateProductId = targetProductParent[0]
        let updateProductColor = targetProductParent[1]
        updateQuantity(updateProductId, updateProductColor);
    }
})

// Fonction pour modifier la quantité
function updateQuantity(updateProductId, updateProductColor){
    // Récupération du produit à modifier
    let actualCart = JSON.parse(localStorage.getItem("cart"));
    let product = actualCart.find(
        obj => obj.productId === updateProductId && obj.productColors === updateProductColor);
    let idProduct = product.productId +"-"+ product.productColors;
    let newQuantity = document.getElementById(idProduct).children[1].value;
    // Récupération du block à modifier pour l'alerte
    let indexBlock
    for(var i = 0; i < actualCart.length; i++){
        console.log(actualCart[i])
        if (actualCart[i].productId === updateProductId && actualCart[i].productColors === updateProductColor){
            indexBlock = i
        }
    }
    // Update de la nouvelle quantité dans le panier si le nombre est valide
    if(newQuantity < 1 || newQuantity >100){
        updateCart()
        document.getElementsByClassName('alert-quantity')[indexBlock].innerHTML = "Quantité invalide !";
        document.getElementsByClassName('alert-quantity')[indexBlock].style.display = "block";
    }
    else{
        product.productQuantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(actualCart));
        document.getElementsByClassName('alert-quantity')[indexBlock].style.display = "none";
        updateCart()
    }
    
}





// Ecoute de la suppression d'un produit
document.addEventListener("click", event => {
    let targetProduct = event.target;
    let targetProductParent = targetProduct.parentElement;
    if (targetProduct.className.includes('delete-product') )  {
        targetProductParent = targetProductParent.id.split('-');
        let updateProductId = targetProductParent[0]
        let updateProductColor = targetProductParent[1]

        removeProduct(updateProductId, updateProductColor);
    }
})

// Fonction pour supprimer le produit
function removeProduct(updateProductId, updateProductColor){
    let actualCart = JSON.parse(localStorage.getItem("cart"));
    for(var i = 0; i < actualCart.length; i++){
        console.log(actualCart[i])
        if (actualCart[i].productId === updateProductId && actualCart[i].productColors === updateProductColor){
            actualCart.splice(i, 1);
            localStorage.setItem("cart", JSON.stringify(actualCart));
            let deleteBlock = document.getElementsByClassName('product-article')[i].remove();
            updateCart()
            return
        }

    }
    
}




// Ecoute de la validation du panier
document.getElementById("send").addEventListener("click", function(event){
    let contactObject;
    let checkValidityCart = checkValidity(contactObject);
    if(checkValidityCart == false){
        event.preventDefault();
        console.log("Formulaire non valide");
    }
    else{
        event.preventDefault();
        console.log("Formulaire valide");
        createOrder(checkValidityCart);
    }
})

// Check des informations du formulaire
function checkValidity(){
   
    // Liste des informations
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const email = document.getElementById("email");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    let inputs = [firstname, lastname, email, address, city]

    // Liste des regex
    const firstNameRGEX = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,100}$/u;
    const lastNameRGEX = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,100}$/u;
    const emailRGEX = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    const addressRGEX = /[0-9]+\s[a-z]+\s[a-zéèêçàï\s\-]+$/;;
    const cityRGEX = /^[a-zA-Z',.\s-]{1,100}$/;
    let regex = [firstNameRGEX, lastNameRGEX, emailRGEX, addressRGEX, cityRGEX]

    // Check si les infos sont valides
    let validity = 0
    for(var i = 0; i < inputs.length; i++){
        inputs[i].setCustomValidity('');
        if(!regex[i].test(inputs[i].value)) {
            inputs[i].setCustomValidity('Invalide');
            validity += 1
        }
    }
    if(validity > 0){
        return false
    }

    // Création de l'objet contact
    let contact = {
        firstName: firstname.value,
        lastName: lastname.value,
        address: address.value,
        city: city.value,
        email: email.value,
    };
    console.log(contact);
    return contact ;
}


// Création de la commande
function createOrder(contact){
    let actualCart = JSON.parse(localStorage.getItem("cart"));
    
    // Assemblage de la liste des produits
    let products = [];
    actualCart.forEach((orderProduct) =>{
        products.push(orderProduct.productId);
    });

    // Assemblage des informations de contact et de la liste des produits
    let orderObject = {contact, products};
    console.log(orderObject);
    // Envoi de la commande
    let order = fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(orderObject),
        headers: {
            Accept : 'application/json',
            'Content-Type' : 'application/json',
        },
        
    })



    console.log(order);

}