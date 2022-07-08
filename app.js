let $row = $('.row');
let $flexboxContainer;
let $card;
let $cardHeader;
let $h2;
let $cardBody;
let $img;
let $cardFooter;
let $h3;
let $thumbsUp;
let $imgModal;
let likedImg = [];

function createCard(element) {
    $flexboxContainer = $('<div class="d-flex col-md-6 col-xl-4 col-xxl-3 justify-content-center"></div>');
    $row.append($flexboxContainer);

    $card = $('<div class="card border-success m-3 border-white border-end-0 border-bottom-0"></div>');
    $flexboxContainer.append($card);

    $cardHeader = $('<div class="card-header bg-transparent border-success"></div>');
    $card.append($cardHeader);

    $h2 = $(`<h2 class="card-title">${
        element.author
    }</h2>`);
    $cardHeader.append($h2);

    $cardBody = $('<div class="card-body"></div>');
    $card.append($cardBody);

    $img = $(`<img src="${
        element.download_url
    }" class="card-img-top img-fluid rounded" alt="">`);
    $cardBody.append($img);

    $cardFooter = $('<div class="card-footer bg-transparent border-success d-flex justify-content-between"></div>');
    $card.append($cardFooter);

    $h3 = $(`<h3>ID: ${
        element.id
    }</h3>`);
    $thumbsUp = $(`<i class="bi bi-hand-thumbs-up-fill"></i>`)
    $cardFooter.append($h3);
    $cardFooter.append($thumbsUp);

    // FEATURE1: USERS CAN CLICK TO LIKE AND UNLIKE A IMAGE
    $thumbsUp.click(function () {
        $(this).toggleClass('checked');
        $imgModal = $(`<img class="img-fluid" src=${
            element.download_url
        } alt="">`)
        if ($(this).hasClass('checked')) {
            $(this).css('color', 'blue');
            likedImg.push(element);
        } else {
            $(this).css('color', 'gray');
            likedImg.splice($.inArray(element, likedImg), 1);
        }
    });

}

// Use AJAX to call API
$.get("https://picsum.photos/v2/list?limit=100", function (data) {
    data.map(element => {
        createCard(element);
    });
});

// FEATURE 2: USERS CAN SEE LIKED IMAGES
let $likedImgNav = $('.nav-link');
$likedImgNav.click(function () {
    $('.modal-body').empty();
    likedImg.forEach(element => {
        let $imgModal = $(`<img class="img-fluid" src=${
            element.download_url
        } alt="">`)
        $('.modal-body').append($imgModal);
    });
});


// FEATURE 3: USER SCROLL DOWN TO LOAD MORE IMAGES

let count = 0;

$(window).on("scroll", function () {
    let scrollHeight = $(document).height();
    let scrollPos = $(window).height() + $(window).scrollTop();
    if (((scrollHeight - 300) >= scrollPos) / scrollHeight == 0) {
        count++;
        $.get(`https://picsum.photos/v2/list?page=${
            count + 10
        }&limit=10`, function (data) {
            data.forEach(element => {
                createCard(element);
            });

        });
    }


});


// FEATURE 4: DARK MODE SWITCH
let $switch = $('#flexSwitchCheckDefault');
$switch.click(function () {
    $switch.toggleClass('dark');
    if ($switch.hasClass('dark')) {
        $('body').css('background-image', `url(https://images.unsplash.com/photo-1611416457332-946853cc75d6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1571&q=80)`);
        $('body').css('color', `white`);
        $('.navbar').css('color', `white`);
        $('.nav-link').css('color', `white`);
        $('.darkMode').css('visibility', 'visible')


    } else {
        $('body').css('background-image', `url(https://images.unsplash.com/photo-1634655377962-e6e7b446e7e9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1364&q=80)`);
        $('body').css('color', `black`);
        $('.navbar').css('color', `black`);
        $('.nav-link').css('color', `black`);
        $('.darkMode').css('visibility', 'hidden')


    }
});

// FEATURE 5: SEARCH IMG BY ID
$('.search-button').click(() => {
    $('.modal-found').empty();
    let $inputValue = $('.form-control').val();
    if ($.isNumeric(parseInt($inputValue))) { // $('.modal-found').empty();

        let foundLink = `https://picsum.photos/id/${$inputValue}/2500/1667`;
        let $imgFoundModal = $(`<img class="img-fluid" src=${foundLink} alt="">`)
        let $thumbsUp = $(`<i class="bi bi-hand-thumbs-up-fill"></i>`);

        $thumbsUp.click(function () {
            $thumbsUp.toggleClass('checked');

            if ($thumbsUp.hasClass('checked')) {
                $thumbsUp.css('color', 'blue');
            } else {
                $thumbsUp.css('color', 'gray');
                // $('#liked-modal').remove($imgFoundModal);
            }
        });
        $('#liked-modal').append($imgFoundModal);

        $('.modal-found').prepend($imgFoundModal);
        $('.modal-found').append($thumbsUp);

    } else {
        $.get("https://picsum.photos/v2/list?limit=100", function (data) {
            data.forEach(element => {
                $thumbsUp = $(`<i class="bi bi-hand-thumbs-up-fill"></i>`)

                if ($inputValue.toLowerCase() === element.author.toLowerCase()) {
                    let $imgFoundModal = $(`<img class="img-fluid" src=${
                        element.download_url
                    } alt="">`)
                    $thumbsUp.click(function () {
                        $(this).toggleClass('checked');
                        $imgModal = $(`<img class="img-fluid" src=${
                            element.download_url
                        } alt="">`)
                        if ($(this).hasClass('checked')) {
                            $(this).css('color', 'blue');
                            likedImg.push(element);
                        } else {
                            $(this).css('color', 'gray');
                            likedImg.splice($.inArray(element, likedImg), 1);
                        }
                    });
                    $('.modal-found').append($imgFoundModal);
                    $('.modal-found').append($thumbsUp);
                }
            });
        });
    }
})
