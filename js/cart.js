updateCart()


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
                    <div id="alert-quantity"></div>
                </div>
            </article>`



        };
        document.getElementById("total-price-container").innerHTML = totalPrice + "€";
    }
}


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

function updateQuantity(updateProductId, updateProductColor){
    
    console.log(updateProductId)
    console.log(updateProductColor)
    // Récupération du produit à modifier
    let actualCart = JSON.parse(localStorage.getItem("cart"));
    let product = actualCart.find(
        obj => obj.productId === updateProductId && obj.productColors === updateProductColor);

    // Update de la nouvelle quantité dans le panier
    let idProduct = product.productId +"-"+ product.productColors;
    console.log(idProduct);
    let newQuantity = document.getElementById(idProduct).children[1].value;
    console.log(newQuantity);
    if(newQuantity < 1 || newQuantity >100){
        document.getElementById('alert-quantity').innerHTML = "Quantité invalide !";
        document.getElementById('alert-quantity').style.display = "block";
    }
    else{
        product.productQuantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(actualCart));
        document.getElementById('alert-quantity').style.display = "none";
        updateCart()
    }
    
}




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

function removeProduct(updateProductId, updateProductColor){
    // Récupération du produit à modifier
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


function validateOrder(){

    const firstname = document.getElementById("firstName");
    const lastname = document.getElementById("lastName");
    const email = document.getElementById("email");
    const address = document.getElementById("address");
    const city = document.getElementById("city");

    let firstNameRGEX = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,100}$/u;
    let lastNameRGEX = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]{2,100}$/u;
    let emailRGEX = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    let addressRGEX = /[0-9]+\s[a-z]+\s[a-zéèêçàï\s\-]+$/;;
    let cityRGEX = /^[a-zA-Z',.\s-]{1,100}$/;
    
    if(firstNameRGEX.test(firstname.value) == false){
        firstname.style.borderColor == "red";
    };



}

