let url = new URL(document.location.href); 
let productId = url.searchParams.get('id')
let productData



/** Récupérer le produit via l'API */
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


/** Construction du contenu de la page produit*/
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

    // Construction du formulaire d'ajout au panier
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

/** Ecoute du choix de couleur */
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

/** Fonction pour réduire la quantité */
function decreaseCount(){
    const quantityValue = document.getElementById("quantity")
    if(quantityValue.value == 1){
        return;
    }
    else{
        quantityValue.value = parseInt(quantityValue.value)-1
    }
}

/** Fonction pour augmenter la quantité */
function increaseCount(){
    const quantityValue = document.getElementById("quantity")
    if( quantityValue.value < 101){
        quantityValue.value = parseInt(quantityValue.value)+1
    }
    else{
        return;
    }
}

/** Fonction pour ajouter le produit au panier */
function addCart(data){
    let productQuantity = document.getElementById('quantity').value;
    document.getElementById('alert-color').textContent = ""
    document.getElementById('alert-quantity').textContent = ""
    // Vérification si une couleur est selectionnée
    if(document.getElementsByClassName('active').length == 0 ){
        document.getElementById('alert-color').textContent = "Vous n'avez pas selectionné de couleur !";
        document.getElementById('alert-color').style.display = "block";
        document.getElementById('alert-quantity').style.display = "none";
        document.getElementById('add-cart').style.display = "none";
    }
    // Vérification si la quantité est valide
    else if(productQuantity < 1 || productQuantity >100){
        document.getElementById('alert-quantity').textContent = "La quantité selectionnée n'est pas valide !";
        document.getElementById('alert-quantity').style.display = "block";
        document.getElementById('alert-color').style.display = "none";
        document.getElementById('add-cart').style.display = "none";
    }
    // Ajout du produit au panier
    else{
        let productColor = document.getElementsByClassName('active')[0].classList[1];

        // Création de l'objet produit
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

        // Récupération du panier
        actualCart = localStorage.getItem('cart');
        // Si il n'existe pas on le crée
        if(actualCart === null){
            actualCart = [];
            localStorage.setItem("cart", JSON.stringify(actualCart));
        }
        actualCart = localStorage.getItem('cart');
        actualCart = JSON.parse(actualCart);

        // Check si le produit existe déjà
        const alreadyIn = actualCart.find(
            obj => obj.productId === newProduct.productId && obj.productColors === newProduct.productColors);
        
        // Si le produit existe déjà on update la quantité
        if (alreadyIn){
            let newQuantity = parseInt(newProduct.productQuantity) + parseInt(alreadyIn.productQuantity);
            alreadyIn.productQuantity = newQuantity;
            localStorage.setItem("cart", JSON.stringify(actualCart));
            document.getElementById('add-cart').style.display = "block";
            document.getElementById('alert-color').style.display = "none";
            document.getElementById('alert-quantity').style.display = "none";
        }

        // Si le produit n'existe pas déjà on l'ajoute au panier existant
        else {
            actualCart.push(newProduct);
            localStorage.setItem("cart", JSON.stringify(actualCart));

            document.getElementById('add-cart').textContent = "Vos produits ont bien été ajoutés au panier !";
            document.getElementById('add-cart').style.display = "block";
            document.getElementById('alert-color').style.display = "none";
            document.getElementById('alert-quantity').style.display = "none";
        }
    }
}