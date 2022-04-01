let lang = document.querySelector('html').lang

// Display the cart when we load the page
updateCart()

/** Function for displaying the cart */
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

/** Listening a quantity change */
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

/** Function for updating the quantity
 * @constructor
 * @param {int} updateProductId - The product ID.
 * @param {int} updateProductColor - The product color
*/
function updateQuantity(updateProductId, updateProductColor){
    // Retrieve the product to update
    let actualCart = JSON.parse(localStorage.getItem("cart"));
    let product = actualCart.find(
        obj => obj.productId === updateProductId && obj.productColors === updateProductColor);
    let idProduct = product.productId +"-"+ product.productColors;
    let newQuantity = document.getElementById(idProduct).children[1].value;
    // Retrieve the alert block to modify
    let indexBlock
    for(var i = 0; i < actualCart.length; i++){
        if (actualCart[i].productId === updateProductId && actualCart[i].productColors === updateProductColor){
            indexBlock = i
        }
    }
    // Update the new quantity in the cart if the new quantity is valid
    if(newQuantity < 1 || newQuantity >100){
        updateCart()
        if (lang == "fr"){
            document.getElementsByClassName('alert-quantity')[indexBlock].textContent = "Quantité invalide !";
        }
        else if (lang == "en"){
            document.getElementsByClassName('alert-quantity')[indexBlock].textContent = "Invalid quantity !";
        }
        document.getElementsByClassName('alert-quantity')[indexBlock].style.display = "block";
    }
    else{
        product.productQuantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(actualCart));
        document.getElementsByClassName('alert-quantity')[indexBlock].style.display = "none";
        updateCart()
    }
    
}

/** Listening delete the product */
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

/** Function for delete the product from the cart
 * @constructor
 * @param {int} updateProductId - The product ID.
 * @param {int} updateProductColor - The product color.
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

/** Listening the validation of the cart*/
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

/** Check the informations of the form */
function checkValidity(){

    // List of informations
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const email = document.getElementById("email");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    let inputs = [firstname, lastname, email, address, city]

    // List of regex
    const firstNameRGEX = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,100}$/u;
    const lastNameRGEX = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,100}$/u;
    const emailRGEX = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    const addressRGEX = /[0-9]+\s[a-z]+\s[a-zéèêçàï\s\-]+$/;;
    const cityRGEX = /^[a-zA-Z',.\s-]{1,100}$/;
    let regex = [firstNameRGEX, lastNameRGEX, emailRGEX, addressRGEX, cityRGEX]

    // Check if the informations are valid
    let validity = 0
    for(var i = 0; i < inputs.length; i++){
        inputs[i].setCustomValidity('');
        if(!regex[i].test(inputs[i].value)) {
            
            if (lang == "fr"){
                inputs[i].setCustomValidity('Invalide');
            }
            else if (lang == "en"){
                inputs[i].setCustomValidity('Invalid');
            }
            validity += 1
        }
    }
    if(validity > 0){
        return false
    }

    // Creation of the contact object
    let contact = {
        firstName: firstname.value,
        lastName: lastname.value,
        address: address.value,
        city: city.value,
        email: email.value,
    };
    return contact ;
}


/** Function for creating the order
 * @constructor
 * @param {object} contact - List of contact informations
 */
function createOrder(contact){
    let actualCart = JSON.parse(localStorage.getItem("cart"));
    
    // Assembly the list of products
    let products = [];
    actualCart.forEach((orderProduct) =>{
        products.push(orderProduct.productId);
    });

    // Assembly of contact informations and products list
    let orderObject = {contact, products};

    // Send the order
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

    // Redirect to the confirmation
    
    if (lang == "fr"){
        window.location.href = "confirmation.html";
    }
    else if (lang == "en"){
        window.location.href = "confirmation-en.html";
    }
    


}