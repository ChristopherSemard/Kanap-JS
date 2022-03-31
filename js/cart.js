// Affichage du panier lors du chargement de la page
updateCart()

/** Fonction d'affichage du panier */
function updateCart(){
    let actualCart = JSON.parse(localStorage.getItem("cart"));
    let productsList = document.querySelector('#products-list');
    let template = document.querySelector('#product-block');
    let totalPrice = 0
    if (actualCart === null || actualCart.length == 0){

        document.getElementById('empty-cart-alert').style.display = "block";
        document.getElementById('total-price').style.display = "none";
        document.getElementById('form').style.display = "none";
        document.getElementById('send').style.display = "none";
    }
    else{
        productsList.textContent = "";
        for(product of actualCart){
            totalPrice = totalPrice + (parseInt(product.productPrice) * parseInt(product.productQuantity))
            let idProduct = product.productId +"-"+ product.productColors;

            let clone = document.importNode(template.content, true);
            
            clone.querySelector("img").setAttribute("src", product.productImg);
            clone.querySelector("img").setAttribute("alt", product.productTxt);
            clone.querySelector("h2").textContent = product.productName;
            clone.querySelector("#product-description").children[1].textContent = product.productColors;
            clone.querySelector(".price").textContent = `${product.productPrice} €`;
            clone.querySelector("#quantity").value = product.productQuantity;
            clone.querySelector(".quantity-selector").id = idProduct;
        

            productsList.appendChild(clone);
        };
        document.getElementById("total-price-container").textContent = totalPrice + "€";
    }
}

/** Ecoute d'un changement de quantité */
document.addEventListener("change", event => {
    let targetProduct = event.target;
    let targetProductParent = targetProduct.parentElement;
    if (targetProductParent.className.includes('quantity') )  {
        targetProductParent = targetProductParent.id.split('-');
        let updateProductId = targetProductParent[0];
        let updateProductColor = targetProductParent[1];
        console.log(updateProductId);
        updateQuantity(updateProductId, updateProductColor);
    }
})

/** Fonction pour modifier la quantité 
 * @constructor
 * @param {int} updateProductId - L'ID du produit.
 * @param {int} updateProductColor - La couleur du produit.
*/
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
        if (actualCart[i].productId === updateProductId && actualCart[i].productColors === updateProductColor){
            indexBlock = i
        }
    }
    // Update de la nouvelle quantité dans le panier si le nombre est valide
    if(newQuantity < 1 || newQuantity >100){
        updateCart()
        document.getElementsByClassName('alert-quantity')[indexBlock].textContent = "Quantité invalide !";
        document.getElementsByClassName('alert-quantity')[indexBlock].style.display = "block";
    }
    else{
        product.productQuantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(actualCart));
        document.getElementsByClassName('alert-quantity')[indexBlock].style.display = "none";
        updateCart()
    }
    
}

/** Ecoute de la suppression d'un produit */
document.addEventListener("click", event => {
    let targetProduct = event.target;
    let targetProductParent = targetProduct.parentElement.parentElement;
    if (targetProduct.className.includes('fa-solid'))  {
        targetProductParent = targetProductParent.id.split('-');
        let updateProductId = targetProductParent[0]
        let updateProductColor = targetProductParent[1]
        removeProduct(updateProductId, updateProductColor);
    }
})

/** Fonction pour supprimer le produit du panier 
 * @constructor
 * @param {int} updateProductId - L'ID du produit.
 * @param {int} updateProductColor - La couleur du produit.
*/
function removeProduct(updateProductId, updateProductColor){
    let actualCart = JSON.parse(localStorage.getItem("cart"));
    for(var i = 0; i < actualCart.length; i++){
        if (actualCart[i].productId === updateProductId && actualCart[i].productColors === updateProductColor){
            actualCart.splice(i, 1);
            localStorage.setItem("cart", JSON.stringify(actualCart));
            let deleteBlock = document.getElementsByClassName('product-article')[i].remove();
            updateCart()
            return
        }

    }
    
}

/** Ecoute de la validation du panier */
document.getElementById("send").addEventListener("click", function(event){
    let contactObject;
    let checkValidityCart = checkValidity(contactObject);
    if(checkValidityCart == false){
        event.preventDefault();
    }
    else{
        event.preventDefault();
        createOrder(checkValidityCart);
    }
})

/** Check des informations du formulaire */
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
    return contact ;
}


/** Création de la commande 
 * @constructor
 * @param {object} contact - Liste des informations de contact du formulaire.
 */
function createOrder(contact){
    let actualCart = JSON.parse(localStorage.getItem("cart"));
    
    // Assemblage de la liste des produits
    let products = [];
    actualCart.forEach((orderProduct) =>{
        products.push(orderProduct.productId);
    });

    // Assemblage des informations de contact et de la liste des produits
    let orderObject = {contact, products};

    // Envoi de la commande
    let order =  fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(orderObject),
        headers: {
            Accept : 'application/json',
            'Content-Type' : 'application/json',
        }, 
    })
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
        })
    .then(function (data) {
            localStorage.setItem("order", JSON.stringify(data.orderId));

    })
    .catch(function (error) {});

    // Redirection vers confirmation
    window.location.href = "confirmation.html";
    


}