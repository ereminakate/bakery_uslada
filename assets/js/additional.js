/* -----------------------------------------------------------------------------

пекарня Услада

File:           JS additional
Version:        1.10

-------------------------------------------------------------------------------- */

"use strict";

(function () {

    var cartProductTemplate = document.querySelector('#cart-product-template').content,
        panelCartContent = document.querySelector('.panel-cart-content'),
        panelCartSum = panelCartContent.querySelector('.panel-cart-sum'),
        tableCart = panelCartContent.querySelector('.table-cart'),
        cartSummaryTemplate = document.querySelector('#cart-summary-template').content;

    var arrProducts = [];

    var fragment = document.createDocumentFragment();
    
  window.additional = {

    // Функция заполнения элемента массива продуктов в корзине
    renderNewProduct: function (el) {

        var newProduct = {
            id: window.additional.getIDProduct(el),
            name: window.additional.getNameProduct(el),
            description: window.additional.getDescriptionProduct(el),
            price: window.additional.getPriceProduct(el)*window.additional.getCountProduct(el),
            count: window.additional.getCountProduct(el)
        } 

        return newProduct;
    },


    // Функция заполнения строки корзины
    renderCartProduct: function (productElement) {

      var cartProductElement = cartProductTemplate.cloneNode(true);

        $('.action-delete', cartProductElement).attr('data-id', productElement.id);
        cartProductElement.querySelector('.name').textContent = productElement.name;
        cartProductElement.querySelector('.text-muted').textContent = productElement.description;
        cartProductElement.querySelector('.price').textContent = productElement.price + " руб.";
        cartProductElement.querySelector('.count').textContent = productElement.count;

        $('.action-delete', cartProductElement).on('click', window.additional.deleteProductOfCart);

      return cartProductElement;
    },
    //

    // Функция заполнения итоговых сумм корзины
    renderCartSummary:  function (productElement) {

      var cartProductElement = cartProductTemplate.cloneNode(true);

        cartProductElement.querySelector('.name').textContent = productElement.name;
        cartProductElement.querySelector('.text-muted').textContent = productElement.description;
        cartProductElement.querySelector('.price').textContent = productElement.price;
        cartProductElement.querySelector('.count').textContent = productElement.count;

      return cartProductElement;
    },
    //

    //Функция заполнения корзины
    renderPanelCart: function () {
        var sum = 0,
            deliverySum = 50,
            summary = 0,
            newEl,
            serialSum,
            serialCount,
            sumCount = 0,
            isCheckout = false;

        var cartSummary = cartSummaryTemplate.cloneNode(true);

        tableCart.innerHTML = '';
        panelCartSum.innerHTML = '';
        
        if (document.URL.indexOf("checkout.html") > -1) {
            
            var panelCheckout = document.querySelector('.checkout'),
                checkoutTableCart = panelCheckout.querySelector('.table-cart'),
                checkoutCartSum = panelCheckout.querySelector('.panel-cart-sum');
                
            isCheckout = true;
            checkoutCartSum.innerHTML = '';
        };

        for (var i = 0; i < localStorage.length; i++) {

            if ((localStorage.key(i) !== 'sum') && (localStorage.key(i) !== 'sumCount')) {
                newEl = JSON.parse(localStorage.getItem(localStorage.key(i)));

                sum = sum + Number(newEl.price);
                summary = sum + deliverySum;
                sumCount = sumCount + Number(newEl.count);

                fragment.appendChild(window.additional.renderCartProduct(newEl));
                tableCart.appendChild(fragment);
                
                if (isCheckout) {
                    
                    checkoutTableCart.innerHTML = '';
                    
                    fragment.appendChild(window.additional.renderCartProduct(newEl));
                    checkoutTableCart.appendChild(fragment);
                }
            }

        };

        if (sum !== 0) {
            cartSummary.querySelector('.sum strong').textContent = sum + " руб.";
            cartSummary.querySelector('.delivery-sum strong').textContent = deliverySum + " руб.";
            cartSummary.querySelector('.summary strong').textContent = summary + " руб.";

            fragment.appendChild(cartSummary);
            panelCartSum.appendChild(fragment);

            if (isCheckout) {
                
                cartSummary = cartSummaryTemplate.cloneNode(true);

                cartSummary.querySelector('.sum strong').textContent = sum + " руб.";
                cartSummary.querySelector('.delivery-sum strong').textContent = deliverySum + " руб.";
                cartSummary.querySelector('.summary strong').textContent = summary + " руб.";

                fragment.appendChild(cartSummary);
                checkoutCartSum.appendChild(fragment);
            }
        } 
        else {
            var cartEmpty = document.querySelector('#cart-empty-template').content.cloneNode(true);
            fragment.appendChild(cartEmpty);
            tableCart.appendChild(fragment);
            
            if (isCheckout) {
                checkoutTableCart.innerHTML = '';
                var cartEmpty = document.querySelector('#cart-empty-template').content.cloneNode(true);
                fragment.appendChild(cartEmpty);
                checkoutTableCart.appendChild(fragment);
            }
        } 
        
        $('#header').find('.cart-value').text(sum);
        $('#header').find('.notification').text(sumCount);
        $('#header-mobile').find('.notification').text(sumCount);

        //Добавим общую сумму в хранилище
        serialSum = JSON.stringify(sum); //сериализуем
        localStorage.setItem("sum", serialSum); //запишем его в хранилище по ключу "sum"

        //Добавим общее количество в хранилище
        serialCount = JSON.stringify(sumCount); //сериализуем
        localStorage.setItem("sumCount", serialCount); //запишем его в хранилище по ключу "sum"

    },
    //

    //Функции получения данных продукта
    getIDProduct: function (el) {
        return $('[data-target="#productModal"]', el).attr('data-id');
    },

    getNameProduct: function (el) {
        return $('h6', el).text();
    },

    getPriceProduct: function (el) {
        return $('.text-md.mr-4 .price', el).text();
    },

    getDescriptionProduct: function (el) {
        return $('.text-muted.text-sm', el).text();
    },

    getCountProduct: function (el) {
        return $('.item_quantity',el).val();
    },
    //
        
      
    //Удаление продукта из корзины               
    deleteProductOfCart: function(e) {
      e.preventDefault();
      var $target = $(this),
          elementLS,
          nameTarget = $target.find('#productModal');
        
      for (var i = 0; i < localStorage.length; i++) {
            debugger;
            elementLS = JSON.parse(localStorage.getItem(localStorage.key(i)));

            if (elementLS.id === $target.attr('data-id')) {

                localStorage.removeItem(elementLS.id);
            };
        };
        window.additional.renderPanelCart();

    }

  }
  
// Открытие модального окна продукта при нажатии на кнопку "В корзину" и добавления продукта в корзину
$('.menu-category-content').find('[data-toggle="modal"]').on('click', function(elm) {
    elm.preventDefault();
    var $target = $(this).parents('.menu-item'),
    text = window.additional.getNameProduct($target),
    price = window.additional.getPriceProduct($target),
    description = window.additional.getDescriptionProduct($target),
    count = window.additional.getCountProduct($target);
 
     //
     $('h6', '.modal-dialog').text(text);
     $('.modal-price', '.modal-dialog').text(price*count);
     $('span.text-muted', '.modal-dialog').text(description);
     $('.count', '.modal-dialog').text(count + " шт");
    
    var newElement = window.additional.renderNewProduct($target),
        elementLS,
        isElement = false,
        newCount =0,
        price = 0;
    
    for (var i = 0; i < localStorage.length; i++) {
    
        elementLS = JSON.parse(localStorage.getItem(localStorage.key(i)));
        
        if (elementLS.id === newElement.id) {
            isElement = true;
            
            price = elementLS.price / elementLS.count;
            newCount = Number(elementLS.count) + Number(newElement.count);
            elementLS.count = newCount;
            elementLS.price = newCount * price;
            
            // Перезапишем элемент с измененным количеством в локал сторадж
            localStorage.removeItem(elementLS.id);
            var serialObj = JSON.stringify(elementLS); //сериализуем его
            localStorage.setItem(elementLS.id, serialObj);
        };
    }
        
    if (!isElement) {
        var newSerialObj = JSON.stringify(newElement); //сериализуем его
        localStorage.setItem(newElement.id, newSerialObj); //запишем его в хранилище по ключу id
    };

    window.additional.renderPanelCart();
});


    //Функция увеличения и уменьшения колиества товара
    $('.buybox button').click(function(e) {
            e.preventDefault();
            var currentQty = Number($(this).parent().find('.item_quantity').val());
            if (currentQty <= 0) {
                $(this).parent().find('.item_quantity').val(1);
            } else {

                if ($(this).hasClass("add")) {
                    $(this).parent().find('.item_quantity').val(currentQty + 1);
                }
                if ($(this).hasClass("remove")) {
                    $(this).parent().find('.item_quantity').val(currentQty - 1);
                }
            }
        });
})();