

// 인스타그램 슬라이드
function instaData(url) {
    let instaToken;
    $.ajax({
        type: "GET",
        url: "https://www.pawrest.co.kr/api/v1/insta/token",
        dataType: "json",
        async: false,
        success: function(res) {
            instaToken = res.token;
        },
        error: function(res) {
            console.log(res)
        }
    });

    if (url == null) {
        url = "https://graph.instagram.com/me/media?access_token=" + instaToken + "&fields=id,caption,media_type,media_url,permalink";
    }
    let instaImgList;

    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: url,
        success: function(res) {
            instaImgList = res.data;

            function instaSlide(contentName){
                for(let i=0; i<instaImgList.length; i++){
                    $(contentName+' .swiper-wrapper').append(`<div class="swiper-slide"><a href="${instaImgList[i].permalink}" target="_blank"><img src="${instaImgList[i].media_url}" alt="pawrest instagram img"></a></div>`);
                }
                let instaSlide = new Swiper(contentName, {
                    autoplay: {
                        delay: 0,
                        disableOnInteraction: false,
                    },
                    spaceBetween: 15,
                    speed: 5000,
                    loop: true,
                    loopAdditionalSlides: 1,
                    slidesPerView: 2,
                    allowTouchMove: false
                });
            }
            instaSlide('.insta-slide');
            instaSlide('.insta-slide-reverse');
        },
        error: function(res) {
            console.log(res)
        }
    });
}

// location-col info-list-wrap 영역 스크롤
function locationScroll(){
    const infoListWrap = document.querySelector('.info-list-wrap');

    const scrollElement = document.querySelector('.scroll');

    infoListWrap.addEventListener('scroll', function() {
        const scrollPercentage = (infoListWrap.scrollLeft / (infoListWrap.scrollWidth - infoListWrap.clientWidth)) * 100;
        const maxScrollPercentage = 100 - (scrollElement.offsetWidth / infoListWrap.offsetWidth) * 100;
        const scrollPosition = Math.min(scrollPercentage, maxScrollPercentage);
        scrollElement.style.left = `${scrollPosition}%`;
    });
}
$(document).ready(function(){  
    instaData();
    locationScroll();
    
    // 메인섹션
    let scrollBoolean = true;
    let body = $("html, body");
    let mainSlide = new Swiper(".main-slide", {
        slidesPerView: 1,
        mousewheel: true,
        direction: "vertical",
        pagination: {
            el: ".swiper-pagination",
        },
        effect: "fade",
        on: {
            slideChange : function() {
                body.css('overflow','hidden');
                scrollBoolean = true
                // 마지막 슬라이드가 되면 스크롤위치를 두번째 섹션으로 변경 후 go-reserve 페이드인
                if(mainSlide.realIndex == 4 && scrollBoolean){
                    let thisHeight = $('.main-slide').height()
                    body.css('overflow','auto')
                    scrollBoolean = false;
                    body.stop().delay(1000).animate({scrollTop:thisHeight}, 500,function(){
                        $('.go-reserve').fadeIn();
                    });
                }
            },
        },
    });

    // 두번째섹션 > 첫번째섹션(메인) 이동시 동작
    $(window).scroll(function(){
        let body = $("html, body");
        let st = $(this).scrollTop();
        let spaceTop = $('.space-col').offset().top;

        if(st >= spaceTop){
            scrollBoolean = true;
        }
        if(st < spaceTop && st !== 0 && scrollBoolean){
            mainSlide.slideTo(0, 10, false);

            body.stop().animate({scrollTop:0},500,'linear');
            $('.go-reserve').fadeOut();
            scrollBoolean = false;
        }
    });

    function createSwiper(selector) {
        return new Swiper(selector, {
          slidesPerView: 1,
          spaceBetween: 30,
          observer: true,
          observeParents: true,
          pagination: {
            el: ".swiper-pagination",
          }
        });
      }
      let medicalSlide01 = createSwiper(".medical01-slide");
      let medicalSlide02 = createSwiper(".medical02-slide");
      let medicalSlide03 = createSwiper(".medical03-slide");
      let groomingSlide01 = createSwiper(".grooming01-slide");
      let groomingSlide02 = createSwiper(".grooming02-slide");
      let groomingSlide03 = createSwiper(".grooming03-slide");
      let groomingSlide04 = createSwiper(".grooming04-slide");

    function createSwiper02(selector) {
        return new Swiper(selector, {
            slidesPerView: 1,
            spaceBetween: 15,
            observer: true,
            observeParents: true,
            pagination: {
                el: ".swiper-pagination",
             }
        });
    }
    let schoolSlide01 = createSwiper02(".school01-slide");
    let schoolSlide02 = createSwiper02(".school02-slide");
    let schoolSlide03 = createSwiper02(".school03-slide");
    let schoolSlide04 = createSwiper02(".school04-slide");
    let schoolSlide05 = createSwiper02(".school05-slide");

    function goToFirstSlide(slideName) {
        for(let i = 0; i<slideName.children().length; i++){
            let slide = slideName.attr('id') + "Slide0" + (i + 1);
            let swiperInfo = eval(slide)

            swiperInfo.slideTo(0)
        }
    }

    // 스크롤 위치에 따라 go-reserve 노출 여부
    if($(window).scrollTop() > 0){
        $('.go-reserve').show();
    } else {
        $('.go-reserve').hide();
    }

    // tab
    $('.btn-tab').on('click',function(){
        let thisName = $(this).attr('data-name');
        let thisLeft = $(this).offset().left;
        let thisParents =$(this).parents('.tab-list');

        $(this).addClass('active').siblings().removeClass('active');

        $('#'+thisName).addClass('active').siblings().removeClass('active');

        $(this).parents('.scroll-box').stop().animate({ scrollLeft: thisLeft }, 200,'linear');

        goToFirstSlide(thisParents)
    });

    // 주소 카피
    const myTextarea = document.querySelector("#copytxt");
    document.querySelector(".btn-txt-copy").onclick = () => {
        window.navigator.clipboard.writeText(myTextarea.innerText).then(() => {
            let copyToast;
            clearInterval(copyToast);
            $('.wrap').append('<div class="toast">주소가 복사되었습니다.</div>');
            
            copyToast = setInterval(function () {
                $('.toast').fadeOut(300,function(){this.remove()})
                clearInterval(copyToast);
            }, 1500);
        });
    };
});


