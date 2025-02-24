// Open Product Detail Popup
const gridProducts = document.querySelectorAll('.grid-product');
const gridProductPopups = document.querySelectorAll('.grid-product__icon');
gridProductPopups.forEach((productIcon) => {
    productIcon.addEventListener('click', (e) => {
        const currentProductPopup = e.currentTarget.parentNode.nextElementSibling;
        currentProductPopup.style.display = 'block';
        const bodySelector = document.querySelector('body');
        bodySelector.classList.add('popup-open');
    });
});
// Close Product Detail Popup
const closeSelectors = document.querySelectorAll('.grid-product-popup, .grid-product-popup__close--svg');
closeSelectors.forEach(closeSelector => {
    closeSelector.addEventListener('click', (e) => {
        if(e.target.classList.contains('grid-product-popup')){
            closeSelector.style.display = 'none';
            const bodySelector = document.querySelector('body');
            bodySelector.classList.remove('popup-open');
        } 
         if (e.target.classList.contains('grid-product-popup__close--svg')){
            e.target.parentNode.parentNode.parentNode.style.display = 'none';
            const bodySelector = document.querySelector('body');
            bodySelector.classList.remove('popup-open');
        } 
    });
});

// Product Detail Popup - Select Color
function selectColor(el){
    const selectedColor = el.getAttribute('data-variant-color');
    const selectedColorButtons = document.querySelectorAll('.cta-variant');
    selectedColorButtons.forEach((button) => {
        button.classList.remove('selected');
    });
    el.classList.add('selected');
}
const colorSelectors = document.querySelectorAll('.cta-variant');
function pickSize(el){
    const selectedSize = el.value;
}
//  Add to Cart Functionality with UpSell item
async function addToCart(el){

    const mainProduct = el.parentNode.parentNode.parentNode;
    const productJson = mainProduct.querySelector('script[type="application/json"]');
    const jsonParsed = JSON.parse(productJson.textContent)

    // Check if Color and Size is selected
    if(mainProduct.querySelector('.cta-variant.selected') == null){
        alert('Please select a color');
        return;
    }
    if(mainProduct.querySelector('.select-option-dropdown').value == 'null'){
        alert('Please select a size');
        return;
    }

    // Get Selected Color and Size
    const selectedColor = mainProduct.querySelector('.cta-variant.selected').getAttribute('data-variant-color');
    const selectedSize = mainProduct.querySelector('.select-option-dropdown').value;
    const selectedVariant = jsonParsed.find((variant) => {
        return variant.option1 == selectedSize && variant.option2 ==  selectedColor;
    });

    // Check if Medium and White variant is added then add Soft Winter Jacket UpSell
    let upSellProduct = false;
    if(selectedColor === 'White' && selectedSize === 'M'){
        upSellProduct = true;
    }
    let cartData = {}
    if(upSellProduct){
        cartData = {
            items: [
                {
                    id: selectedVariant.id,
                    quantity: 1
                },
                {
                    id: 43117936902195,
                    quantity: 1
                }
            ]
        }
    } else {
        cartData = {
            items: [
                {
                    id: selectedVariant.id,
                    quantity: 1
                }
            ]
    }
}
await fetch(window.Shopify.routes.root + 'cart/add.js', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(cartData)
    })
    .then(response => {
        return response.json();
    }).then(parsedState => {
        let modal = document.getElementById("cart-model");
        setTimeout(()=>{
            // Open Bottom Model
            modal.style.display = "block";
            //closer Popup
            document.querySelector("body").classList.remove('popup-open');
            document.querySelectorAll(".grid-product-popup").forEach((popup) => {
            popup.style.display = 'none';

        })
        }, 1000)
        

        // Update Cart Model
         parsedState.items.map((item) => {
            modal.querySelector('.modal-body').innerHTML += `
            <div class="cart-item">
         
                <div class="cart-item__details">
                    <h3>${item.title}</h3>

                </div>
            `
        })
        
        setTimeout(()=>{
            let modal = document.getElementById("cart-model");
        
            modal.style.display = "none";
        
        }, 5000)
            

      })
    .catch((error) => {
        console.error('Error:', error);
});
}




