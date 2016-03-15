var GEPSlider = GEPSlider || {};

(function ($) {
    var _layouts = [
        [
            '1  4 ',
            '   2 ',
            '     ',
            '53 6 ',
            '   7 '
        ],
        [
            '1  2 ',
            '     ',
            '   4 ',
            '5673 ',
            '     '
        ],
        [
            '1  2 ',
            '     ',
            '    4',
            '5 3  ',
            '6   7'
        ],
        [
            '1  4 ',
            '   2 ',
            '     ',
            '563 7',
            '     '
        ],
        [
            '1   4',
            '   2 ',
            '     ',
            '3 567',
            '     '
        ],
        [
            '  1  ',
            '2    ',
            '     ',
            '43 67',
            '5    '
        ]
    ];
    var _hoverWidth = {small: 335, medium: 540, large: 720};
    var _contentLineHeight = {small: 18, medium: 24, large: 24};
    var _titleLineHeight = {small: 20, small_hover: 22, medium: 24, large: 36};
//appView
    GEPSlider.AppView = function () {
        var _this = this;
        this.currentIndex = 0;
        this.argument = arguments;
        this.SliderViewList = [];
        this.isRender = false;

        function initialize() {
            if (_this.argument.length > 0) {
                _this.el = _this.argument[0].el;
                var sliderLength = _this.el.find(".swiper-slide").length;
                for (var i = 0; i < sliderLength; i++) {
                    var sliderView = new GEPSlider.SliderView({el: $(_this.el.find(".swiper-slide")[i])});
                    _this.SliderViewList.push(sliderView);
                    if (i < 3) {
                        sliderView.createLayout();
                    }
                }
            }

            _this.el.find(".swiper-button-next").on("click", nextSlider);
        };
        function nextSlider() {
            var currentIndex = _this.el.find(".swiper-pagination-bullet-active").index();
            var nextSliderView = _this.SliderViewList[currentIndex + 1];
            if (nextSliderView && nextSliderView.positionArr.length == 0) {
                nextSliderView.createLayout();
            }
        }

        this.render = function () {
            for (var i = 0, l = this.SliderViewList.length; i < l; i++) {
                this.SliderViewList[i].setSliderImageTitleHeight();
            }
        };
        initialize();
    };


    GEPSlider.SliderView = function () {

        var _this = this,
            imageNumber = 7;
        this.positionArr = [];
        this.argument = arguments;
        this.sliderImageViewArr = [];

        function initialize() {
            if (_this.argument.length > 0) {
                _this.el = _this.argument[0].el;
            }
            imageNumber = _this.el.find(".views-row").length;
            _this.el.on("click", slideSwiper);
        }

        this.createLayout = function () {
            getPosition();
            for (var i = 0; i < imageNumber; i++) {
                var modelContent = {size: "", position: this.positionArr[i]};
                if (i == 0) {
                    modelContent.size = "large";
                }
                else if (i == 1 || i == 2) {
                    modelContent.size = "medium";
                }
                else {
                    modelContent.size = "small";
                }
                var sliderImageModel = new GEPSlider.SliderImageModel(modelContent),
                    sliderImageView = new GEPSlider.SliderImageView({
                        el: $(this.el.find(".views-row")[i]),
                        model: sliderImageModel
                    });
                this.sliderImageViewArr.push(sliderImageView);
            }

        };
        this.setSliderImageTitleHeight = function () {
            for (var i = 0, l = this.sliderImageViewArr.length; i < l; i++) {
                this.sliderImageViewArr[i].setTitleHeight();
            }
        };
        function slideSwiper() {
            if (_this.el.hasClass("swiper-slide-prev")) {
                _this.el.parents(".swiper-container").find(".swiper-button-prev").click();
            }
            else if (_this.el.hasClass("swiper-slide-next")) {
                _this.el.parents(".swiper-container").find(".swiper-button-next").click();
            }
            else {
                return;
            }
        }

        function getPosition() {
            var layout = _layouts[parseInt(Math.random() * 6)],
                rows, rowCount, rowIndex,
                cols, colCount, colIndex,
                col;
            rows = layout;
            rowCount = rows.length;
            rowIndex = rowCount;
            for (var i = 0; i < 7; i++) {
                var position = {x: 0, y: 0, w: 0};
                if (i == 0) {
                    position.w = 60;
                }
                else if (i == 1 || i == 2) {
                    position.w = 40;
                }
                else {
                    position.w = 20;
                }
                _this.positionArr.push(position);
            }

            while (rowIndex--) {
                cols = rows[rowIndex].split('');
                colCount = cols.length;
                colIndex = colCount;

                while (colIndex--) {
                    col = +cols[colIndex];

                    if (col) {
                        _this.positionArr[col - 1].x = colIndex / colCount * 100;
                        _this.positionArr[col - 1].y = rowIndex / rowCount * 100;
                    }
                }
            }
        }

        initialize();

    };

//imgView
    GEPSlider.SliderImageView = function () {

        var _this = this,
            contentEle,
            dateEle,
            titleEle,
            titleHeight,
            trigger, textEle, trigger1;
        this.model = null;
        this.argument = arguments;


        function initialize() {
            if (_this.argument.length > 0) {
                _this.el = _this.argument[0].el;
                _this.model = _this.argument[0].model;
            }
            textEle = _this.el.find(".views-field-content");
            contentEle = _this.el.find(".views-field-body");
            dateEle = _this.el.find(".views-field-field-video-date");
            titleEle = _this.el.find(".views-field-title a");
            titleHeight = _titleLineHeight[_this.model.size] * 2;
            _this.model.originContentText = contentEle.html();
            _this.model.originTitle = titleEle.text();
            _this.el.on("mouseenter", setHoverCss)
                .on("mouseleave", removeHoverCss)
                .on("click", toDetailPage);
            addImageClass();
            setPosition();

        }

        function addImageClass() {
            if (_this.model.size == "large") {
                _this.el.addClass("large-item");
            }
            else if (_this.model.size == "medium") {
                _this.el.addClass("medium-item");
            }
            else {
                _this.el.addClass("small-item");
            }
        }

        function toDetailPage() {
            var url = titleEle.attr("href");
            location.href = url;
        }

        function setHoverCss(e) {
            trigger = setTimeout(function () {
                getHoverCss();
                setPosition(_this.model.hoverCss);
                _this.el.addClass("hover");
                trigger1 = setTimeout(function () {
                    _this.el.addClass("views-row-hover");
                    setContent();
                }, 201);

            }, 200);
        }

        function removeHoverCss(e) {
            clearTimeout(trigger);
            if (trigger1) {
                clearTimeout(trigger1);
            }
            textEle.hide();
            contentEle.html(_this.model.originContentText);
            setPosition();
            _this.el.removeClass("views-row-hover");
            _this.el.removeClass("hover");
        }

        function setPosition(pos) {
            if (!pos) {
                _this.el.css("left", _this.model.position.x + '%')
                    .css("top", _this.model.position.y + '%')
                    .width(_this.model.position.w + '%')
                    .css("z-index", "");
            }
            else {
                _this.el.width(pos.w).css("left", pos.x).css("top", pos.y).css("z-index", 20);
            }
        }

        this.setTitleHeight = function () {
            titleEle.text(_this.model.originTitle).dotdotdot({
                height: titleHeight
            });
        };

        function getHoverCss(e) {
            var hoverWidth = _hoverWidth[_this.model.size];

            var i = _this.el,
                n = 0.5625 * hoverWidth,
                s = i.position(),
                r = {
                    height: i.height(),
                    width: i.width()
                };
            s.top = Math.round(s.top + r.height / 2 - n / 2);
            s.left = Math.round(s.left + r.width / 2 - hoverWidth / 2);
            _this.model.hoverCss = {x: s.left, y: s.top, w: hoverWidth};
        }

        function setContent() {
            var lineHeight = _contentLineHeight[_this.model.size],
                contentHeight = lineHeight * 3;
            textEle.css({"opacity": 0}).show();
            if (contentEle.text() != "" && contentEle.height() > contentHeight) {
                contentEle.height(contentHeight);
            }
            contentEle.dotdotdot({
                height: contentHeight
            });
            setTimeout(function () {
                textEle.animate({"opacity": 1}, 600);
            }, 100);
        }

        initialize();
    };

//sliderModel
    GEPSlider.SliderImageModel = function (obj) {
        this.originContentText = obj.originContentText == null ? "" : obj.originContentText;
        this.originTitle = obj.originTitle == null ? "" : obj.originTitle;
        this.position = obj.position == null ? "" : obj.position;
        this.size = obj.size == null ? "" : obj.size;
        this.hoverCss = obj.hoverCss == null ? "" : obj.hoverCss;
    }
    $(function () {
        var data = {title: "title", content: "content", date: "2016.1.1", imgSrc: "content/images/1.jpg"},
            viewsRowHtml = $("#views-row").html(),
            count = 19;
        for (var i = 0; i < count / 7; i++) {
            var html = "", sHtml, eHtml;
            html += '<div class="swiper-slide">';
            for (var j = 0; j < 7&&j<count-7*i; j++) {
                var $viewRows = $(viewsRowHtml);
                $viewRows.find("img").attr("src", data.imgSrc);
                $viewRows.find(".views-field-title a").text(data.title);
                $viewRows.find(".views-field-field-video-date span").text(data.date);
                $viewRows.find(".views-field-body span").text(data.content);
                html += $viewRows.html();
            }
            html += "</div>";
            $(".swiper-wrapper").append($(html));
        }

        var tedSliderSwiper1 = new Swiper('.view-slide-1 .swiper-container', {
            initialSlide: 0,
            spaceBetween: 10,
            centeredSlides: true,
            pagination: '.view-slide-1 .swiper-pagination',
            nextButton: '.view-slide-1 .swiper-button-next',
            prevButton: '.view-slide-1 .swiper-button-prev',
            paginationClickable: true,
            simulateTouch: false
        });
        var tedSliderView1 = new GEPSlider.AppView({el: $('.view-slide-1 .swiper-container')});

        var tedSliderSwiper2 = new Swiper('.view-slide-2 .swiper-container', {
            initialSlide: 0,
            spaceBetween: 10,
            centeredSlides: true,
            pagination: '.view-slide-2 .swiper-pagination',
            nextButton: '.view-slide-2 .swiper-button-next',
            prevButton: '.view-slide-2 .swiper-button-prev',
            paginationClickable: true,
            simulateTouch: false
        });
        var tedSliderView2 = new GEPSlider.AppView({el: $('.view-slide-2 .swiper-container')});

        $(".menu span").on("click",function(){
            var _this=$(this),
                index=_this.index();
            $(".menu span").removeClass("active");
            _this.addClass("active");
            $(".view-slide").hide();
            $(".view-slide").eq(index).show();
            if(index==0){
                tedSliderView1.render();
                tedSliderSwiper1.update(true);
            }
            else if(_this.index()==1){
                tedSliderView2.render();
                tedSliderSwiper2.update(true);
            }
        })
        $(".menu span").eq(0).click();
    })

})(jQuery);