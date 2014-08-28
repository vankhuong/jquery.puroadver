/*!
 * jquery.puroadver.js v1.0.0
 * Khuong.Ngo
 *
 * Copyright 2014, Puropela
 * http://www.puropela.com
 */
;
(function($, window, undefined) {

    'use strict';

    $.Puroadver = function(opts, element) {

        this.eAdver = $(element).addClass('adsPuropela');
        this.$el = $('<div class="puroadver"></div>').appendTo('body');
        this._init(opts);
        
    };

    // the options
    $.Puroadver.defaults = {
        headHeight: 30,
        headCorner: 50,
        border: 1,
        url: 'data.json',
        adsby: {
            logo: 'images/ad-by-Puropela-min.png',
            link: 'http://www.puropela.com/',
            txt: 'ads by Puropela'
        }
    };

    $.Puroadver.prototype = {

        _init: function(opts) {

            // options
            this.opts = $.extend(true, {}, $.Puroadver.defaults, opts);
            
            var self = this,
                host = location.hostname;
            $.getJSON(self.opts.url, {site : host}, function(data) {
                
                self._setLayout(data);
                self._generate(data);
                
            }).fail(function() {
                console.log("Puroadver error");
            });
            
        },
        
        _setLayout: function(data){
            
            this.colWidth = Math.floor( ( ( data.theme.width - this.opts.border ) / data.theme.cols ) - this.opts.border );
            this.rowHeight = Math.floor( ( ( data.theme.height - this.opts.headHeight ) / data.theme.rows ) - this.opts.border );
            
            // Canculate width and heihgt of Puroadver
            this.pWidth = (this.colWidth + this.opts.border) * data.theme.cols + this.opts.border;
            this.pHeight = (this.rowHeight + this.opts.border) * data.theme.rows + this.opts.headHeight;
            
        },

        _initLayout: function(data) {
            
            var self = this;
            this.$el.width(this.pWidth).height(this.pHeight).hide();
            
            this.eAdver.append( '<img src="' + data.imgadver + '" />', this._adsSignature() ).click(function(e) {
                e.stopPropagation();
                self.$el.fadeIn(300);
                var marq = self.$el.find('.pra-txt');
                if(typeof $.fn.marquee === 'function' && !marq.children(".js-marquee-wrapper").length){
                    marq.marquee({
                        delayBeforeStart: 500,
                        duration: 7000
                    });
                }
            });
            
            $('html').click(function(e) {
                var el = $(e.target).parents('.puroadver');
                if (!el.length) self.$el.fadeOut(200);
            });
            
        },
        
        _adsSignature: function(){
            var str = '<a class="adsP01" href="' + this.opts.adsby.link + '"><span class="txt">' + this.opts.adsby.txt + '</span></a>';
            return $(str).css( 'background-image', 'url(' + this.opts.adsby.logo + ')' ).click(function(e){
                e.stopPropagation();
            });
        },
        
        _generate: function(data) {

            this._initLayout(data);
            this._getHead(data);
            var gists = this._getGist(data), self = this;

            // loop data set
            for (var s = 0; s < data.set.length; s++) {
                var k = 0,
                    $set = $('<div class="puroadver-set"></div>').appendTo(this.$el);
                //loop through the cells
                for (var i = 0; i < data.theme.rows; i++) {
                    for (var j = 0; j < data.theme.cols; j++) {

                        //append new cells to set
                        var cell = this._generateCell($set, data, s, k),
                            front = this._cellPos(cell.find('.front'), data, s, i, j);

                        //register click handler for the cell
                        front.click(function() {
                            $(this).parent().addClass('flipped');
                        });
                        k++;

                    }
                }

                $('<div class="puroadver-arrow"></div>').click(function(){
                    $(this).toggleClass('active');
                    gists.toggleClass('active');
                    if(typeof $.fn.jScrollPane === 'function'){gists.jScrollPane({verticalDragMaxHeight: 40});}
                }).appendTo($set);

            }
            if(data.set.length > 1) {this._initEvents();}
            
        },
        
        _initEvents: function(){
            
            var sets = this.$el.children('.puroadver-set').addClass('rotator');
            sets.first().addClass('active');
            
            // click handler for the cell
            sets.children('.puroadver-cell').click(function(){
                var all = true;
                $(this).parent().children('.puroadver-cell').each(function(){
                    if(!$(this).hasClass('flipped')){all = false}
                });
                // all cells is clicked
                if(all){
                    setTimeout(function(){
                        var a = sets.filter('.active').removeClass('active'),
                            n = a.next();
                        a.children('.puroadver-cell').removeClass('flipped');
                        if(n.length){ 
                            n.addClass('active'); 
                        }else{
                            sets.first().addClass('active');
                        }
                    }, 1500);
                }
            });
            
        },

        _generateCell: function(e, data, s, k) {
            var str = '';
            if (data.set[s].items[k]) {
                str = "<div class='puroadver-cell'>" 
                        + "<div class='back' style='line-height: " + this.rowHeight + "px'><a href='" + data.set[s].items[k].url + "'>" 
                            + "<span class='txt'><img src='" + data.set[s].items[k].img + "' /></span>" 
                            + "<div class='overlay'>"
                                + "<span class='txt'>" + data.set[s].items[k].des + "</span>"
                            + "</div>"
                        + "</a></div>" 
                        + "<div class='front' style='line-height: " + this.rowHeight + "px'>" 
                            + "<div class='overlay'>" 
                                + "<span class='txt'>" + data.set[s].items[k].title + "<br />"
                                + "<span class='old-price'>" + data.set[s].items[k].oldPrice + "</span><br />"
                                + "<span class='price'>" + data.set[s].items[k].price + "</span>"
                                + "</span>" 
                     + "</div></div></div>";
            } else {
                str = "<div class='puroadver-cell'><div class='back'></div><div class='front'></div></div>";
            }
            return $(str).width(this.colWidth).height(this.rowHeight).appendTo(e);
        },

        _cellPos: function(e, data, s, i, j) {
            return e.css({
                'background': 'url(' + data.set[s].bg + ')',
                'background-position': -(j * this.colWidth) + 'px ' + -(i * this.rowHeight) + 'px'
            });
        },
        
        _getHead: function(data){
            var str = '<div class="puroadver-head">'
                        + '<div class="pra-logo"><a href ="' + data.company.site + '"><img src="' + data.company.logo + '" /></a></div>'
                        + '<div class="pra-txt" style="width: ' + (this.pWidth - this.opts.headCorner * 2) + 'px; left: ' + this.opts.headCorner + 'px">' + data.company.text + '</div>'
                        + '<div class="pra-more"><a href="' + data.company.link + '">more</a></div>'
                      + '</div>';
            $(str).css( {height : this.opts.headHeight, lineHeight : this.opts.headHeight + "px"} ).appendTo(this.$el);
        },
        
        _getGist: function(data){
            var str = '<div class="puroadver-gists">';
            for(var i = 0; i < data.company.gists.length; i++){
                str += '<div class="puroadver-cell" style="height: ' + this.rowHeight + 'px; width: ' + this.colWidth + 'px">'
                        + '<a style="line-height: ' + this.rowHeight + 'px" href="' + data.company.gists[i].url + '">'
                            + '<span class="txt"><img src="' + data.company.gists[i].img + '" /></span>'
                            + "<div class='overlay'>"
                                + "<span class='txt'>" + data.company.gists[i].des + "</span>"
                            + "</div>"
                       + '</a></div>';
            }
            str += '</div>';
            return $(str).css({
                height : this.pHeight - this.opts.headHeight,
                width : ( this.colWidth + this.opts.border ), 
                right: - (this.colWidth + this.opts.border * 2)
            }).appendTo(this.$el);
        }

    };

    $.fn.puroadver = function(opts) {

        var instance = $.data(this, 'puroadver');

        this.each(function() {

            if (instance) {

                instance._init();

            } else {

                instance = $.data(this, 'puroadver', new $.Puroadver(opts, this));

            }

        });

        return instance;

    };

})(jQuery, window);