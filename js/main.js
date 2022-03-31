/** Récupérer les produits via l'API */
fetch("http://localhost:3000/api/products")
    .then(function (response) {
    if (response.ok) {
        return response.json();
    }
    })
    .then(function (data) {
        productBlocks(data);
    })
    .catch(function (error) {});



/** Construction des blocks de produits */
function productBlocks(data){
    for (product of data){
        let productsList = document.querySelector('#products-list')
        let template = document.querySelector('#product-block')
        let clone = document.importNode(template.content, true);
        clone.querySelector("a").setAttribute("href",`./front/html/product.html?id=${product._id}`);
        clone.querySelector("img").setAttribute("src", product.imageUrl);
        clone.querySelector("img").setAttribute("alt", product.altTxt);
        clone.querySelector("h2").textContent = product.name;
        clone.querySelectorAll("p")[0].textContent = product.description;
        clone.querySelectorAll("p")[1].textContent = `${product.price} €`;

        productsList.appendChild(clone);
    }
}