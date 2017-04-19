"use strict"; /* author:@amberjack115 */
var SimplifyStyles = function() {
    return SimplifyStyles.prototype.getGlobal.call(this, arguments);
};
SimplifyStyles.prototype = {
    constants: {
        version: 'Simplify Styles v0.7',
        ajaxTimeout: 10000,
        readyTimeout: 8000,
        resourcePath: (location.protocol == 'https:' ? 'https:' : 'http:') + '//mightywinter.github.io',
        exports: "init simplify enablePJAX showMessage changeFontSize toggleTheme hideOrShowElements",
        key_fontsize: 'ss-fontsize',
        key_theme: 'ss-theme',
        wrapperId: 'ssw' + (0 | Math.random() * 0x7FFFFFFF),
        containerId: 'ssc' + (0 | Math.random() * 0x7FFFFFFF),
        loaderId: 'ssl' + (0 | Math.random() * 0x7FFFFFFF),
        messageBarId: 'ssm' + (0 | Math.random() * 0x7FFFFFFF),
        messageTextId: 'sst' + (0 | Math.random() * 0x7FFFFFFF),
        scrollBarId: 'sss' + (0 | Math.random() * 0x7FFFFFFF),
        isWebKit: navigator.userAgent.indexOf('WebKit') >= 0,
        isiPhone: navigator.userAgent.indexOf('WebKit') >= 0 && navigator.userAgent.indexOf('iPhone') >= 0,
        isiPad: navigator.userAgent.indexOf('WebKit') >= 0 && navigator.userAgent.indexOf('iPad') >= 0,
        isLegacyiOS: /OS[34]/.test(navigator.userAgent),
        isAndroid: navigator.userAgent.indexOf('Android') >= 0,
        isLegacyAndroid: /Android[12]/.test(navigator.userAgent),
        isMobile: /(iPhone|iPad|Android)/.test(navigator.userAgent),
        DEBUG: false
    },
    get fontSize() {
        return 0 | this.session.getItem(this.constants.key_fontsize);
    },
    set fontSize(a) {
        var s = Math.min(Math.max(a, 50), 200);
        if (a !== s) return;
        this.$('div#' + this.constants.wrapperId).css({
            fontSize: s + '%'
        });
        this.session.setItem(this.constants.key_fontsize, s);
    },
    get theme() {
        return this.session.getItem(this.constants.key_theme);
    },
    set theme(a) {
        var b = this.$(document.body).removeClass('light dark').addClass(a);
        this.session.setItem(this.constants.key_theme, a);
        b.offsetTop = b.offsetTop;
    },
    getGlobal: function() {
        var self = this,
            global = {};
        self.constants.exports.split(' ').forEach(function(fn) {
            global[fn] = function() {
                self[fn].apply(self, arguments);
            };
        });
        return global;
    },
    loadjQuery: function(done, fail) {
        var self = this;
        if (typeof jQuery == 'function' && /^1\.[7-9]/.test(jQuery.fn.jquery)) {
            self.ready(jQuery, done);
            return;
        }
        var d = document,
            ready = false,
            s = d.createElement('script');
        s.src = (location.protocol == 'https:' ? 'https:' : 'http:') + '//ajax.aspnetcdn.com/ajax/jQuery/jquery-1.11.2.min.js';
        s.charset = 'utf-8';
        s.async = 'async';
        s.onload = s.onreadystatechange = function() {
            var rs = this.readyState;
            if (!ready && (!rs || rs == 'loaded' || rs == 'complete')) {
                ready = true;
                s = s.onload = s.onreadystatechange = s.onerror = null;
                if (typeof jQuery != 'function') {
                    if (typeof fail == 'function') fail();
                    return;
                }
                var jq = jQuery;
                jq.noConflict(true);
                self.ready(jq, done);
            }
        };
        s.onerror = function() {
            s = s.onload = s.onreadystatechange = s.onerror = null;
            if (typeof fail == 'function') fail();
        };
        (d.head || d.body || d.documentElement).appendChild(s);
    },
    ready: function(jq, fn) {
        var ready = false;
        jq(function($) {
            if (ready) return;
            ready = true;
            fn($);
        });
        setTimeout(function() {
            if (ready) return;
            jq.ready();
            ready = true;
        }, this.constants.readyTimeout);
    },
    doAsync: function(fn, a) {
        a = a || this.$.Deferred();
        var b = new Image;
        b.addEventListener('error', function() {
            fn(a);
            fn = a = b = null;
        }, false);
        b.src = 'data:image/jpeg,';
        return a.promise();
    },
    doLazily: function(s, fn, itvl) {
        var self = this,
            $ = self.$,
            a = $.Deferred(),
            b, c, d;
        if (typeof fn != 'function') return;
        else if (typeof s == 'number') b = new Array(s);
        else if (Array.isArray(s) || typeof s == 'object' && s.length) b = s;
        else b = [undefined];
        var i = 0,
            p;
        c = b.length;
        d = itvl || 50;
        p = setInterval(function() {
            if (i >= c) {
                clearInterval(p);
                p = b = c = null;
                a.resolve();
                return;
            }
            fn(i, b[i++]);
        }, d);
        return a.promise();
    },
    initDocument: function() {
        var self = this;
        return self.doAsync(function(def) {
            var $ = self.$,
                constants = self.constants,
                d = document,
                b = $(d.body),
                w = window,
                loader, messageBar;
            d.documentElement.removeAttribute('lang');
            if (!d.head) d.documentElement.appendChild(d.createElement('head'));
            var loaderEl = d.createElement('div');
            loaderEl.id = constants.loaderId;
            loaderEl.setAttribute('class', 'ssControl');
            loaderEl.setAttribute('role', 'progressbar');
            loaderEl.setAttribute('style', 'position:fixed;');
            d.body.appendChild(loaderEl);
            loader = self.loader = $(loaderEl);
            var wrapperEl = d.createElement('div');
            wrapperEl.id = constants.wrapperId;
            wrapperEl.setAttribute('role', 'region');
            wrapperEl.setAttribute('style', 'min-height:' + w.innerHeight + 'px;');
            d.body.appendChild(wrapperEl);
            self.wrapper = $(wrapperEl);
            var messageBarEl = d.createElement('div');
            messageBarEl.id = constants.messageBarId;
            messageBarEl.setAttribute('class', 'ssControl');
            messageBarEl.setAttribute('style', 'position:fixed;');
            messageBarEl.setAttribute('role', 'status');
            var messageTextEl = d.createElement('h4');
            messageTextEl.id = constants.messageTextId;
            wrapperEl.appendChild(messageBarEl);
            messageBarEl.appendChild(messageTextEl);
            messageBar = self.messageBar = $(messageBarEl);
            var containerEl = d.createElement('div');
            containerEl.id = constants.containerId;
            containerEl.setAttribute('style', 'display:none;');
            containerEl.setAttribute('role', 'article');
            containerEl.setAttribute('aria-live', 'polite');
            wrapperEl.appendChild(containerEl);
            self.container = $(containerEl);
            var headEl = d.head,
                head = $(headEl);
            head.find('style,link[rel=stylesheet]').remove();
            b.attr('class', 'ssHideElements').removeAttr('style text link vlink alink bgcolor');
            self.fontSize = self.fontSize;
            self.theme = self.theme;
            self.stylesheets.forEach(function(a) {
                if (!d.getElementById('#' + a.id)) headEl.appendChild(a);
            });
            $.makeArray(d.styleSheets).forEach(function(a) {
                a.disabled = !a.ownerNode.hasAttribute('data-ss-helements');
            });
            head.find('meta[name=viewport],base,basefont').remove().end().append($(d.createElement('meta')).attr({
                'name': 'format-detection',
                'content': 'telephone=no'
            })).append($(d.createElement('meta')).attr({
                'name': 'viewport',
                'content': 'width=device-width,minimum-scale=1,maximum-scale=1,user-scalable=yes'
            }));
            $.makeArray(d.body.childNodes).forEach(function(a) {
                if (a != loaderEl && a != wrapperEl) containerEl.appendChild(a);
            });
            if (constants.isMobile) {
                b.on('touchstart gesturechange touchmove touchend', function(e) {
                    self.touchEventHandler(e);
                });
                if ((constants.isiPhone || constants.isiPad) && !constants.isLegacyiOS) {
                    $(d.createElement('div')).appendTo(b).attr({
                        'id': constants.scrollBarId,
                        'class': 'ssControl'
                    }).on('touchstart touchmove', function(e) {
                        e.stopImmediatePropagation();
                        if (e.type == 'touchstart') {
                            w.scrollBy(0, 1);
                            $(this).css({
                                height: w.innerHeight,
                                opacity: .5
                            });
                        }
                        var dest, posY = e.originalEvent.changedTouches[0].clientY;
                        if (posY < w.innerHeight * .05) {
                            dest = posY * .95;
                        } else if (posY > w.innerHeight * .95) {
                            dest = (d.body.scrollHeight - w.innerHeight) * posY / .95 / w.innerHeight;
                        } else {
                            dest = (d.body.scrollHeight - w.innerHeight) * posY / w.innerHeight;
                        }
                        w.scroll(0, Math.max(0, Math.min(dest, d.body.scrollHeight)));
                    }).on('touchcancel touchend', function() {
                        $(this).css({
                            height: w.innerHeight,
                            opacity: .01
                        });
                    }).height(w.innerHeight).show();
                    $(w).resize(function() {
                        $('div#' + constants.scrollBarId).height(w.innerHeight);
                    });
                }
                if (constants.isLegacyiOS || (constants.isAndroid && constants.isWebKit && constants.isLegacyAndroid)) {
                    loader.css({
                        position: 'absolute',
                        top: w.scrollY
                    });
                    messageBar.css({
                        position: 'absolute',
                        top: w.scrollY
                    });
                    $(w).scroll(function() {
                        var y = w.scrollY;
                        loader.css({
                            top: y
                        });
                        messageBar.css({
                            top: y
                        });
                    });
                }
            }
            $(w).keydown(function(e) {
                self.keyEventHandler(e);
            }).dblclick(function() {
                self.toggleTheme();
            });
            loader = messageBar = null;
            def.resolve();
        });
    },
    initContainer: function() {
        var self = this,
            $ = self.$,
            d = document,
            w = window,
            container = self.container,
            deferred = $.Deferred(),
            d0, d1;
        d0 = self.doAsync(function(def) {
            container.find('script').remove();
            container.find('table,tr,th,td').removeAttr('bgcolor background valign border cellspacing');
            container.find('*').not('iframe').removeAttr('style color size align width height');
            def.resolve();
        });
        d1 = self.doLazily(container.find('style,link'), function(i, z) {
            if (z) z.disabled = true;
        });
        var collapseOrExpandPane = function(e) {
            if (e.which != 1) return;
            var a = $(this),
                b = a.next('.ssCollapsiblePane');
            a.toggleClass('ssCollapsedState');
            b.length && b.toggleClass('ssCollapsedPane').attr({
                'aria-expanded': !b.hasClass('ssCollapsedPane')
            }).find(':not(.ssCollapsedPane) a[href],:not(.ssCollapsedPane) input,:not(.ssCollapsedPane) select,:not(.ssCollapsedPane) textarea,:not(.ssCollapsedPane) button').attr({
                'tabindex': b.hasClass('ssCollapsedPane') ? -1 : 0,
                'aria-disabled': b.hasClass('ssCollapsedPane')
            });
            a.offsetTop = a.offsetTop;
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        };
        var makeCollapsibleControl = function(elements) {
            var ltr = /</g,
                gtr = /\>/g,
                quotr = /\"/g;
            return self.doLazily(elements, function(i, z) {
                var b, c, p = $(z);
                if (!p.height() || p.height() < 30) return;
                b = $(d.createElement('div')).insertBefore(p).attr({
                    'class': 'ssCollapsibleControl',
                    'role': 'tree'
                });
                $(d.createElement('div')).appendTo(b).attr({
                    'class': 'ssCollapseSwitcher ssControl ssCollapsedState',
                    'role': 'treeitem'
                }).click(collapseOrExpandPane).append($(d.createElement('span')).attr('class', 'ssCollapseIndicator')).append($(d.createElement('span')).attr('class', 'ssCollapseSwitcherTitle').html(z.nodeName + ((z.id !== '') ? '#' + z.id : '') + ':&nbsp;')).append($(d.createElement('span')).attr('class', 'ssCollapseSwitcherDescription').html((p.is('iframe') ? z.src : p.text().trim().substring(0, 120).replace(ltr, '&lt;').replace(gtr, '&gt;').replace(quotr, '&quot;'))));
                c = $(d.createElement('div')).appendTo(b).attr({
                    'class': 'ssCollapsiblePane ssCollapsedPane',
                    'role': 'group',
                    'aria-expanded': false
                });
                p.appendTo(c).find('a[href],input,select,textarea,button').attr({
                    'tabindex': -1,
                    'aria-disabled': true
                });
            });
        };
        $.when(d0, d1).done(function() {
            var selector, elements;
            selector = ['form,nav,aside,footer,menu', ',#Header,#nav,#aside,#footer,#menu,#menubar', ',#sub,#extra,#side,#sidebar,#sidearea', ',#navi,#gnavi,#navigation', ',#right,#left,#r_sidebar,#l_sidebar', ',#headline,#disqus_thread,#comments,#comment,#comments-wrapper,#comments-list,#comment_wrapper', ',#wptouch-comments,#wptouch-menu,#wptouch-login,#wptouch-search,#drop-fade', ',#post-options,#bookmark-box,#main-menu,#pager,#trackback,#backlink,#foot,#top', ',#site-nav,#Nav,#Navi,#amebaBar,#topsy-tweet-search-results', ',#profile,#about,#calendar,#archive,#archives,#recent,#similar,#related', ',#global,#globalNav,#globalNavi,#globalnavi,#idc-container-parent', ',#feature,#categories,#category-list,#tags,#twitter,#facebook,#rss,#feed,#copyright', ',#banner,#google_afc_top,#aswift_0_anchor,#ads,#ad,#ad1,#ad2', ',#topics,#secondary,#subcol,#navbar,#NnVD,#fc2_ad_box,#ad_header,#header_ad', ',#hatena-bookmark-container,#hatena_bookmark_anywhere', ',#hatena-bookmark-widget0,#hatena-bookmark-widget1', ',#ld-topics,#footer_custom,#amazon_rank,#adingo_sp_jsad,#dsq-combo-widget', ',#leftcol,#rightcol,#left_col,#right_col,#subcol,#sub-column', ',#socialBookmark,#header-info,#sitemenu,#smartibannerblock', ',div.amazlet-box,.topbox,.ad,div.adsense,div.google-user-ad,.amazon_rank', ',.blogroll-channel,div.zenback,.article_ad,.ad_amazon,.entrybox,.multi-box', ',.headline,.pass_article,div.ham_ranking_div,.trackback'].join('');
            self.doAsync(function(def) {
                elements = container.find(selector);
                def.resolve();
            }).done(function() {
                makeCollapsibleControl(elements);
                elements = null;
            });
            self.doLazily(container.find('ul>li'), function(i, a, b) {
                b = $(a);
                if ($.trim(b.text()) == '') b.addClass('ssHiddenElement');
            }, 10);
            var maxImageWidth = (screen.width > 768) ? 740 : screen.width * .9,
                expandImageWidth = maxImageWidth * .6;
            var openOriginalImage = function(e) {
                if (e.which != 1) return;
                w.open(this.href);
                e.stopImmediatePropagation();
                e.preventDefault();
                return false;
            };
            var hideOrExpandImage = function(t, x, y, z) {
                this.removeEventListener('load', hideOrExpandImage, false);
                x = this.naturalWidth;
                y = this.naturalHeight;
                if (y < 61 || y / x <= .3 || (x < expandImageWidth && x * y < 76801)) return;
                z = $(this).addClass('ssPShadow');
                if (x > maxImageWidth) {
                    t = z.attr('src');
                    if (z.parent().is('a') && z.parent().attr('href').match(/\.(jpe?g|gif|png)$/i)) t = z.parent().attr('href');
                    z.wrap($(d.createElement('div')).attr({
                        'class': 'ssPFrame'
                    }));
                    $(d.createElement('a')).appendTo(z.parent()).attr({
                        'href': t,
                        'target': '_blank',
                        'title': 'view large image'
                    }).click(openOriginalImage).append($(d.createElement('span')).text('view large image'));
                }
            };
            self.doLazily(container.find('img'), function(i, m) {
                if (!m.complete) {
                    m.addEventListener('load', hideOrExpandImage, false);
                } else {
                    hideOrExpandImage.call(m);
                }
            });
            if (self.pjaxEnabled) {
                self.doAsync(function() {
                    self.attachPJAXHandlers();
                });
            }
            container.find('table').wrap($(d.createElement('div')).attr('class', 'ssScrollablePane'));
            container.find('label[for]').click($.noop);
            $('#blog-pager-newer-link').find('.blog-pager-newer-link').attr('id', 'blog-pager-newer-link');
            $('#blog-pager-older-link').find('.blog-pager-older-link').attr('id', 'blog-pager-older-link');
            deferred.resolve();
        });
        return deferred.promise();
    },
    keyEventHandler: function(e) {
        var self = this;
        var ctrlKey = (!e.modifiers) ? e.ctrlKey : e.modifiers & Event.CONTROL_MASK,
            altKey = (!e.modifiers) ? e.altKey : e.modifiers & Event.ALT_MASK;
        if (ctrlKey && altKey) {
            switch (String.fromCharCode(e.which || e.keyCode || e.charCode)) {
                case '6':
                    self.toggleTheme();
                    break;
                case '7':
                    self.hideOrShowElements();
                    break;
                case '8':
                    self.changeFontSize(self.fontSize - 10);
                    break;
                case '9':
                    self.changeFontSize(self.fontSize + 10);
                    break;
                case '0':
                    self.enablePJAX();
                    break;
            }
        }
    },
    touchEventHandler: function(e) {
        var self = this,
            w = window,
            innerWidth = w.innerWidth,
            innerHeight = w.innerHeight,
            o = e.originalEvent,
            cancel = false,
            touches = self.touches,
            startX = self.touchStartX,
            startY = self.touchStartY;
        switch (o.type) {
            case 'touchstart':
                self.touches = o.touches.length;
                if (self.touches == 2) {
                    self.touchStartX = o.changedTouches[0].clientX;
                    self.touchStartY = o.changedTouches[0].clientY;
                } else {
                    self.touchStartX = o.touches[0].clientX;
                    self.touchStartY = o.touches[0].clientY;
                }
                break;
            case 'gesturechange':
                cancel = true;
                break;
            case 'touchmove':
                cancel = (o.changedTouches[0].clientX >= innerWidth * .955);
                break;
            case 'touchend':
                if (touches === 2 && o.touches.length === 1 && startX === o.changedTouches[0].clientX && startY === o.changedTouches[0].clientY) {
                    cancel = true;
                    var r = self.fontSize + ((o.touches[0].clientX < o.changedTouches[0].clientX) ? 10 : -10);
                    self.changeFontSize(r);
                } else if (touches === 2 && o.touches.length === 1 && Math.abs(o.rotation) >= 60) {
                    cancel = true;
                    self.toggleTheme();
                } else if (touches === 1 && startX >= innerWidth * .955 && o.changedTouches[0].clientX >= innerWidth * .955 && startY - o.changedTouches[0].clientY > innerHeight * .5) {
                    cancel = true;
                    self.hideOrShowElements();
                } else if (touches === 1 && startX >= innerWidth * .955 && o.changedTouches[0].clientX >= innerWidth * .955 && o.changedTouches[0].clientY - startY > innerHeight * .5) {
                    cancel = true;
                    self.enablePJAX();
                }
                break;
        }
        if (cancel) {
            e.stopImmediatePropagation();
            e.preventDefault();
            return false;
        }
    },
    showLoader: function() {
        var self = this,
            w = window;
        w.scrollBy(0, 1);
        self.messageBar && self.messageBar.hide();
        self.container && self.container.hide();
        self.loader && self.loader.css({
            height: w.innerHeight,
            opacity: .3
        }).show();
    },
    hideLoader: function(quick) {
        var self = this,
            w = window;
        if (quick) {
            self.container && self.container.show();
            self.loader && self.loader.fadeOut(200);
        } else {
            w.scroll(0, 1);
            self.container && self.container.fadeIn(300);
            self.loader && self.loader.delay(200).fadeOut(200);
        }
    },
    loadRemoteContents: function(options) {
        var self = this,
            $ = self.$,
            deferred = $.Deferred();
        self.showLoader();
        $.ajax(options).done(function(res, status, xhr) {
            var headRegex = /<head[^>]*>([\s\S]*)<\/head/i,
                bodyRegex = /<body[^>]*>([\s\S]*)<\/body/i,
                noScriptRegex = /<noscript[^>]*>([\s\S]*)<\/noscript/i,
                contentType = xhr.getResponseHeader('Content-Type'),
                d = document,
                container = self.container;
            if (contentType && !contentType.match(/(^text\/|xhtml|javascript$)/)) {
                self.hideLoader(true);
                window.open(options.url);
                return;
            }
            try {
                container.contents().remove();
                if (contentType && contentType.indexOf('html') >= 0) {
                    if (headRegex.test(res)) {
                        var headEl = d.createElement('div');
                        try {
                            headEl.innerHTML = res.match(headRegex)[1];
                        } catch (exh) {
                            console.log('exh:' + exh);
                        }
                        var head = $(headEl);
                        d.title = (head.find('title').length > 0) ? head.find('title').text() : options.url;
                    } else {
                        d.title = options.url;
                    }
                    if (bodyRegex.test(res)) {
                        var bodyEl = d.createElement('div');
                        try {
                            bodyEl.innerHTML = res.match(bodyRegex)[1];
                        } catch (exb) {
                            console.log('exb:' + exb);
                        }
                        var body = $(bodyEl);
                        body.find('script').each(function() {
                            var s = $(this);
                            if (noScriptRegex.test(s.html())) $(d.createElement('span')).html(s.html().match(noScriptRegex)[1]).insertAfter(s);
                        });
                        body.find('style,script').remove();
                        container.append(body.contents());
                    }
                } else {
                    $('<pre/>').text(res).appendTo(self.container);
                }
            } catch (ex) {
                console.log('ex:' + ex);
            } finally {
                container = $('#' + self.constants.containerId);
                if (container.length <= 0 && !self.constants.DEBUG) {
                    location.href = options.url;
                    return;
                }
                self.initContainer().done(function() {
                    self.hideLoader();
                    deferred.resolve();
                });
            }
        }).fail(function(xhr, ex) {
            console.log('fail:' + ex);
            self.hideLoader(true);
            deferred.rejectWith({
                reject: xhr
            });
        });
        return deferred.promise();
    },
    handlePJAXUserRequest: function(element, e) {
        var self = this,
            $ = self.$,
            d = document;
        if ((e.type == 'click' && e.which != 1) || element.target !== '' && element.target !== '_self' && element.target !== '_top' && element.target !== '_parent') return;
        var options = {},
            url;
        if (element.nodeName.toLowerCase() == 'form') {
            url = element.action;
            var data = $(element).serialize();
            if (element.method.match(/post/i)) {
                options.type = 'POST';
                options.data = data;
            } else {
                options.type = 'GET';
                url = url.replace(/\?[^\?]*$/, '') + '?' + data;
            }
        } else {
            if (element.protocol == 'javascript:' || (element.hash !== '' && element.href.replace(element.hash, '') == location.href.replace(element.hash, ''))) return;
            url = element.href;
        }
        e.stopImmediatePropagation();
        e.preventDefault();
        options.url = url;
        if ('replaceState' in history) {
            var state = history.state;
            if (!state || state == null) state = {
                url: location.href
            };
            state.scrollPosition = $((self.constants.isWebKit) ? d.body : 'html').scrollTop();
            history.replaceState(state, d.title, location.href);
        }
        self.loadRemoteContents(options).done(function() {
            self.beforePopLocation = options.url;
            history.pushState(options, d.title, url);
        }).fail(function() {
            var m = (this.reject) ? 'Oops! ' + this.reject.status + ' ' + this.reject.statusText : 'Oops,could\'nt load contents.';
            self.showMessage(m, 5000);
        });
        return false;
    },
    attachPJAXHandlers: function() {
        if (!('pushState' in history)) return;
        var self = this,
            $ = self.$,
            binary = /\.(jpe?g|png|gif|tiff?|pdf|aac|aiff?|caf|mp[34]|3g[2p]|wav|m4[av]|mov|vcf|ics|docx?|xlsx?|pptx?|pages|key|number|mobileconfig|rtf)$/i;
        self.container.find('a[href],form').each(function() {
            var enctype = this.enctype,
                nodeName = this.nodeName.toLowerCase(),
                a = this;
            if (nodeName == 'form') {
                a = document.createElement('a');
                a.href = this.action;
            }
            if ((location.host !== a.host || location.protocol !== a.protocol || binary.test(a.href) || (enctype && enctype !== '' && enctype !== 'application/x-www-form-urlencoded')) && this.target !== '_blank' && a.protocol !== 'javascript:') {
                this.target = '_blank';
            }
            var events = 'click';
            if (nodeName == 'form') events = 'submit';
            $(this).on(events, function(e) {
                self.handlePJAXUserRequest(this, e);
            });
        });
    },
    createStyleSheets: function() {
        var self = this,
            d = document,
            t, s;
        var stylesheets = self.stylesheets = [];
        t = '*{-moz-box-sizing:content-box;-webkit-box-sizing:content-box;}html{width:100%;height:100%;}body{-webkit-font-smoothing:subpixel-antialiased;margin:0;padding:0;font-size:11pt;line-height:1.68;}h1{font-size:1.4em;}h2{font-size:1.26em;}h3{font-size:1.15em;}h4,h5,h6{font-size:1em;}h1,h2,h3,h4,h5,h6{font-weight:600;margin-top:1.5em;line-height:1.23;padding:0 .3em;}input[type="text"],input[type="password"],input[type="file"],input[type="email"],input[type="url"],input[type="address"],input[type="search"],input[type="tel"],input[type="number"],input[type="date"],input[type="datetime"],input[type="datetime-local"],input[type="month"],input[type="week"],input[type="time"],textarea{min-width:220px;padding:.2em;margin:.5em 0;}input,select,button,label,textarea,fieldset,iframe,table,tr,th,td{font-size:95%;max-width:98%;}textarea{resize:vertical;}fieldset{margin:1em 0;border-radius:4px;}table{margin:1em .5em;border-width:0;border-collapse:collapse;}th,td{padding:.2em;border-collapse:collapse;line-height:1.2;vertical-align:top;text-align:left;}aside,footer,ul,ol,dl{font-size:97%;}blockquote{margin:1em 0;padding-left:1em;text-indent:1em;font-size:95%;}p{margin-bottom:1.5em;}section p:first-of-type{text-indent:1em;}img{margin:.5em .5em .5em 5px;max-width:98%;border:none;}ul,ol{padding-left:1.5em;}dd{margin:0 1em;}code,kbd,samp,var,pre{font-family:monospace;font-size:87%;line-height:1.1;}code,kbd,samp,var{white-space:pre-wrap;}pre{word-wrap:normal;overflow-x:auto;padding:.5em;border-radius:4px;}ins{text-decoration:none;}blockquote .ssControl{text-indent:0;}.ssHideElements img,.ssHideElements iframe,.ssHideElements embed,.ssHideElements object,.ssHideElements canvas,.ssHideElements .zenback,.ssHideElements .blog-title,.ssHideElements .ssHiddenElement,.ssPFrame span,li:empty,#sharebar,.hatena-star-inner-count,.addthis_button_expanded{display:none !important;}.ssHideElements .ssPShadow{display:block !important;width:98%;}';
        s = d.createElement('style');
        s.id = 'ssStyleAll';
        s.appendChild(d.createTextNode(t));
        stylesheets[stylesheets.length] = s;
        t = 'body{-webkit-text-size-adjust:100%;overflow-x:hidden;height:100%;}body,#$wrapperId{background-image:url("$resourcePath/images/ssbg.png?v1");}body.light{color:#4a2c00;background-color:#ece8dc;text-shadow:0 1px 1px #fff;}body.dark{color:#cecede;background-color:#04080e;}.light,.dark{-moz-transition:background-color .5s ease;-webkit-transition:background-color .5s ease;}#$wrapperId{overflow-x:hidden;text-overflow:ellipsis;word-wrap:break-word;hanging-punctuation:first last;margin:0 auto;padding:1em 5%;border-style:solid;border-width:0 1px 1px 1px;-moz-transition-property:background-color;-moz-transition-duration:.3s;-moz-transition-function:ease;-webkit-transition-property:background-color;-webkit-transition-duration:.3s;-webkit-transition-function:ease;}.light #$wrapperId{background-color:#f4f0e4;border-color:#c4b498;box-shadow:0 0 18px 2px rgba(0,0,0,.08);}.dark #$wrapperId{background-color:#24282e;border-color:#444;box-shadow:0 0 18px 2px rgba(0,0,0,.3);}.light h1,.light h2,.light h3,.light h4,.light h5,.light h6{border-left:6px solid #009900;}.dark h1,.dark h2,.dark h3,.dark h4,.dark h5,.dark h6{border-left:6px solid #64c8fd;}.light th,.light td{border:1px solid #fdfdfd;}.dark th,.dark td{border:1px solid #333;}.light blockquote{border-left:6px solid rgba(0,0,0,.1);}.dark blockquote{border-left:6px solid rgba(255,255,255,.08);}a{text-decoration:none;}.light a[href]{color:#009900;border-bottom:1px dashed #009900;}.dark a[href]{color:#64c8fd;border-bottom:1px dashed #64c8fd;}hr{height:1px;}.light hr{border:dashed #ae9d71;border-width:1px 0 0 0;box-shadow:0 1px 1px #fafaf0;}.dark hr{border:dashed #4a4b4d;border-width:1px 0 0 0;box-shadow:0 -1px 1px #242424;}.light pre{background:rgba(255,255,255,.5);}.dark pre{background:rgba(255,255,255,.03);}.ssControl{outline:none;-webkit-touch-callout:none;-moz-user-select:none;-webkit-user-select:none;user-select:none;-webkit-text-size-adjust:100%;}#$messageBarId{display:none;top:0;left:0;z-index:65535;width:100%;background:rgba(0,0,0,.7);border-bottom:1ps solid #000;box-shadow:0 1px 8px rgba(0,0,0,.2);-webkit-transition:top .05s linear;-moz-transition:top .05s linear;transition:top .05s linear;}#$messageTextId{margin:10px auto;font-family:Helvetica;font-size:20px;font-weight:500;color:#eee;text-align:center;text-shadow:0 -1px 1px #000;opacity:1;padding:0;border:none;}#$loaderId{display:none;z-index:65534;top:0;left:0;width:100%;background:url("$resourcePath/images/loader32b.gif?v1") no-repeat center center #000;background-size:42px 42px;}#$scrollBarId{position:fixed;top:0;left:1px;z-index:9700;width:3%;max-width:12px;border-radius:1em;opacity:.01;background:#000;box-shadow:0 0 1px #fff;}.ssCollapsibleControl{margin:.3em auto;max-width:99%;}.ssCollapseSwitcher{display:block;margin:0;padding:.4em .5em .4em .2em;min-height:24px;font-size:10pt;font-family:Georgia,serif;font-style:normal;white-space:nowrap;text-overflow:ellipsis;overflow-x:hidden;cursor:pointer;text-decoration:none;clear:both;border-radius:1px;}.light .ssCollapseSwitcher{color:#5c4220;border:1px dashed #9c8d71;box-shadow:0 1px 1px #fffff8,inset 0 1px 1px #fdfdf6;-webkit-tap-highlight-color:#fffdf4;}.dark .ssCollapseSwitcher{color:#aab;border:1px dashed #4a4b4f;text-shadow:0 -1px 1px #000;box-shadow:0 -1px 1px #242424,inset 0 -1px 1px #262626;-webkit-tap-highlight-color:#aaa;}.ssCollapseIndicator{display:inline-block;width:2em;font-family:Georgia;font-size:11pt;font-weight:bold;text-align:center;}.ssCollapsiblePane{display:block;overflow-x:hidden;max-height:100%;margin:.5em 0 1em 0;padding-left:.5em;opacity:1;}.ssCollapsedPane{max-height:0;margin:0;opacity:0;}.ssCollapseSwitcher .ssCollapseIndicator:after{content:"-";}.ssCollapsedState>.ssCollapseIndicator:after{content:"+";}.ssPFrame{position:relative;left:0;margin:1.5em auto;padding:0;width:98%;min-height:50px;}.ssPFrame a{position:absolute;display:block;top:5px;left:10px;z-index:65000;width:32px;height:32px;border:none !important;background-repeat:no-repeat;background-image:url("$resourcePath/images/sspf.png?v1");opacity:.6;}.ssPFrame a:hover{opacity:.7;}.ssPShadow{display:block !important;margin:1.5em auto;box-shadow:0 1px 8px rgba(0,0,0,.25)}.ssScrollablePane{max-width:98%;overflow-x:auto;}'.replace(/\$resourcePath/g, self.constants.resourcePath).replace(/\$wrapperId/g, self.constants.wrapperId).replace(/\$loaderId/g, self.constants.loaderId).replace(/\$messageBarId/g, self.constants.messageBarId).replace(/\$messageTextId/g, self.constants.messageTextId).replace(/\$scrollBarId/g, self.constants.scrollBarId);
        if (d.documentElement.dir == 'rtl') t = t.replace('border-left', 'border-right');
        s = d.createElement('style');
        s.id = 'ssStyleScreen';
        s.media = 'screen';
        s.appendChild(d.createTextNode(t));
        stylesheets[stylesheets.length] = s;
        t = '.ssPFrame a{background-size:cover;background-image:url("$resourcePath/images/sspf.x2.png?v1");}'.replace(/\$resourcePath/g, self.constants.resourcePath);
        s = d.createElement('style');
        s.id = 'ssStyleRetina';
        s.media = 'only screen and (-webkit-min-device-pixel-ratio:2)';
        s.appendChild(d.createTextNode(t));
        stylesheets[stylesheets.length] = s;
        t = 'body{font-size:14pt;line-height:1.8;}#$wrapperId{max-width:740px;}h1{font-size:1.6em;}h2{font-size:1.46em;}h3{font-size:1.35em;}'.replace(/\$wrapperId/g, self.constants.wrapperId);
        s = d.createElement('style');
        s.id = 'ssStyleTablet';
        s.media = 'screen and (min-device-width:768px)';
        s.appendChild(d.createTextNode(t));
        stylesheets[stylesheets.length] = s;
        t = 'body{-webkit-text-size-adjust:auto;}.light .ssCollapseSwitcher:hover{background:rgba(255,255,255,.4);}.dark .ssCollapseSwitcher:hover{background:rgba(255,255,255,.05);}.ssCollapsiblePane{-moz-transition-property:opacity,margin;-webkit-transition-property:opacity,margin;-moz-transition-duration:.2s;-webkit-transition-duration:.2s;}';
        s = d.createElement('style');
        s.id = 'ssStylePC';
        s.media = 'screen and (min-device-width:769px)';
        s.appendChild(d.createTextNode(t));
        stylesheets[stylesheets.length] = s;
        t = 'body{font-size:10pt;}.ssControl,.ssCollapsedPane{display:none;}.ssPShadow{page-break-before:always;}';
        s = d.createElement('style');
        s.id = 'ssStylePrint';
        s.media = 'print';
        s.appendChild(d.createTextNode(t));
        stylesheets[stylesheets.length] = s;
        stylesheets.forEach(function(a) {
            a.setAttribute('data-ss-helements', true);
        });
    },
    hideMessage: function() {
        var self = this;
        self.messageBar.slideUp(100);
        self.messageBar.find('#' + self.constants.messageTextId).text('');
    },
    init: function(done, fail) {
        var self = this;
        self.pjaxEnabled = false;
        self.$ = self.stylesheets = self.session = self.messageQueue = self.touches = self.touchStartX = self.touchStartY = self.beforePopLocation = self.loader = self.messageBar = self.container = self.wrapper = undefined;
        setTimeout(function() {
            var path = ['/images/loader32b.gif?v1', '/images/ssbg.png?v1', '/images/sspf.png?v1'];
            path.forEach(function(a) {
                var m = new Image;
                m.src = self.constants.resourcePath + a;
            });
        }, 1);
        self.loadjQuery(function($) {
            self.$ = $;
            self.createStyleSheets();
            var sessionStorageAvailable = false;
            try {
                sessionStorageAvailable = (typeof sessionStorage == 'object');
            } catch (ex) {}
            if (sessionStorageAvailable) {
                self.session = sessionStorage;
            } else {
                self.session = (function() {
                    var dummy = [];
                    dummy.getItem = function(a) {
                        return dummy[a];
                    };
                    dummy.setItem = function(a, b) {
                        dummy[a] = b;
                    };
                    return dummy;
                })();
            }
            self.session.setItem(self.constants.key_fontsize, self.fontSize ? self.fontSize : 100);
            self.session.setItem(self.constants.key_theme, self.theme ? self.theme : 'light');
            self.$.ajaxSetup({
                mimeType: 'text/html;charset=' + document.characterSet,
                timeout: self.constants.ajaxTimeout
            });
            self.$.ajaxPrefilter(function(options) {
                if (applicationCache && applicationCache.status != applicationCache.UNCACHED && applicationCache.status != applicationCache.OBSOLETE) {
                    options.isLocal = true;
                }
            });
            done();
        }, fail);
    },
    simplify: function() {
        var self = this,
            d = document;
        self.initDocument().done(function() {
            self.showLoader();
            self.initContainer().done(function() {
                self.hideLoader();
                self.showMessage(self.constants.version, 2200);
                if (d.title == '') d.title = location.href;
            });
        });
    },
    enablePJAX: function() {
        var self = this;
        if (!('pushState' in history)) {
            self.showMessage('Your browser does\'nt support pjax.');
            return;
        } else if (location.protocol.indexOf('http') < 0) {
            return;
        }
        if (!self.pjaxEnabled) {
            self.beforePopLocation = location.href;
            self.doAsync(function(def) {
                self.attachPJAXHandlers();
                self.$(window).on('popstate', function() {
                    var w = window,
                        a = document.createElement('a'),
                        options = (history.state) ? history.state : {
                            url: location.href
                        };
                    a.href = self.beforePopLocation;
                    if (a.href !== location.href && location.href.replace(location.hash, '') !== a.href.replace(a.hash, '')) {
                        self.loadRemoteContents(options).done(function() {
                            if (options.scrollPosition) {
                                w.scroll(0, options.scrollPosition);
                            }
                        }).fail(function() {
                            var m = (this.reject) ? 'Oops! ' + this.reject.status + ' ' + this.reject.statusText : 'Oops,could\'nt load contents.';
                            self.showMessage(m, 3000);
                        });
                    } else if (options.scrollPosition) {
                        w.scroll(0, options.scrollPosition);
                    }
                    self.beforePopLocation = location.href;
                }).on('beforeunload', function() {
                    return document.title;
                });
                def.resolve();
            }).done(function() {
                self.pjaxEnabled = true;
                self.showMessage("PJAX enabled.");
            });
        } else {
            self.showMessage("PJAX already enabled.");
        }
    },
    showMessage: function(message, freeze) {
        var self = this;
        self.messageBar.find('#' + self.constants.messageTextId).text(message);
        if (self.messageQueue !== null) clearTimeout(self.messageQueue);
        self.messageBar.hide().slideDown(120);
        self.messageQueue = setTimeout(function() {
            self.hideMessage();
            self.messageQueue = null;
        }, freeze || 1800);
    },
    changeFontSize: function(r) {
        var self = this;
        self.fontSize = r;
        if (self.fontSize === r) {
            self.showMessage('Set font-size to ' + r + '%.');
        }
    },
    toggleTheme: function() {
        var self = this;
        self.theme = (self.theme == 'dark') ? 'light' : 'dark';
    },
    hideOrShowElements: function() {
        var self = this,
            $ = self.$,
            b = $(document.body);
        self.showMessage((b.hasClass('ssHideElements') ? 'Show' : 'Hide') + ' images/elements');
        b.toggleClass('ssHideElements');
    }
};
(function() {
    if (navigator.userAgent.indexOf('Gecko') < 0) {
        alert(';-D');
    } else if (!window.simplifyStyles) {
        var ss = new SimplifyStyles;
        ss.init(function() {
            window.simplifyStyles = ss;
            ss.simplify();
        }, function() {
            alert(':-(');
        });
    }
})();