updateCart()


function updateCart(){
    let actualCart = JSON.parse(localStorage.getItem("cart"));
    console.log(actualCart)
    const productListDiv = document.getElementById("products-list");
    for(product of actualCart){
        let idProduct = product.productId +"-"+ product.productColors;
        productListDiv.innerHTML += `
        <article id="${idProduct}">
            <img src="${product.productImg}" alt="${product.productTxt}">
            <div id="product-description">
                <h2>${product.productName}</h2>
                <p>${product.productColors}</p>
            </div>
            <div id="product-price">
                <p class="price">${product.productPrice} €</p>
            </div>
            <div id="product-quantity">
                <span id="moins" onclick="decreaseCount()" >-</span>
                <input type="number" id="quantity" onchange="updateQuantity()" value="${product.productQuantity}">
                <span id="plus" onclick="increaseCount()" >+</span>
                <span id="delete" onclick="deleteProduct()" >X</span>
                <div id="alert-quantity"></div>
            </div>
        </article>`
    };
}













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


function updateQuantity(){
    
    let actualCart = JSON.parse(localStorage.getItem("cart"));
    console.log(document)
    const product = actualCart.find(
        obj => obj.productId === newProduct.productId && obj.productColors === newProduct.productColors);

    let newQuantity = document.getElementById('quantity').value;

    localStorage.setItem("cart", JSON.stringify(actualCart));
}