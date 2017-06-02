/**
 *hanzhaohang
 */

define(function(require) {
    'use strict';
    var $ = require('zepto');
    var lazyLoadImage = require('common/lazyLoadImage');
    var setShare = require('common/share/initialize');
    var service = require('common/service');
    var ui_new = require('common/ui');
    var container = $("#page_main");
    var pageData = null;
    var getSmsCode = require('./getSmsCode');
    var SlideInDialog = require('common/mvc-tools/SlideInDialog/SlideInDialog');
    var app = require('common/app');
    var isApp = app.isApp();
    var url = require("util/url");

    var currentLoginNumber;
    var env = require('util/env');

    var getCouponUrl = "/activity/bigshot_coupon";
    var getShareUrl = "/activity/bigshot_share";

    var loginTpl = [
        '<div class="staySingle">',
        '<div class="listen-title"><span class="title-info">领取20元限时优惠券</span></div>',
        '<div class="formElement"><div><input type="tel" pattern="mobile" placeholder="输入手机号" class="mobile" maxlength="11"></div></div>',
        '<div class="formElement"><div class="verify-container"><input type="tel" pattern="verify" placeholder="输入验证码" class="verify-text"><span class="verify">获取验证码</span></div></div>',
        '<div class="staySubmit" style="margin-bottom: 20px;">立即领取</div>',
        '</div>'
    ].join("");
    var shareLoginTpl = [
        '<div class="staySingle">',
        '<div class="listen-title"><span class="title-info">分享赚现金</span></div>',
        '<div class="remind-msg">留下手机号，领取现金奖励</div>',
        '<div class="formElement"><div><input type="tel" pattern="mobile" placeholder="输入手机号" class="mobile" maxlength="11"></div></div>',
        '<div class="formElement"><div class="verify-container"><input type="tel" pattern="verify" placeholder="输入验证码" class="verify-text"><span class="verify">获取验证码</span></div></div>',
        '<div class="staySubmit" style="background:rgb(19,153,236);margin-bottom:20px;">确认</div>',
        '<div class="remind-msg t-l">1.您的朋友通过分享页面领取20元优惠券并购买课程后，您将获得<span class="text-orange">20元现金奖励</span>；您的朋友分享之后，他的朋友再购买课程，您还将获得<span class="text-orange">5元额外奖励</span>，多买多得！</div>',
        '<div class="remind-msg t-l">2.现金奖励将直接打到您的跟谁学账号，随时提取，不限最低额度</div>',
        '</div>'
    ].join("");
    var change_number_display = isApp ? "display:none;" : "";
    var confirmShareTpl = [
        '<div class="staySingle">',
        '<div class="listen-title"><span class="title-info">分享赚现金</span></div>',
        '<div style="    margin-top: 0px!important;" class="remind-msg g-t">确认您的手机号，领取现金奖励</div>',
        '<div class="confirm-num">{{mobile}}</div>',
        '<div class="change_num" style="' + change_number_display + '">更换手机号&gt;</div>',
        '<div class="staySubmit" style="background:rgb(19,153,236); margin-bottom:20px; {{btn_display}}">立即分享</div>',
        '<div style="{{url_display}}"><div class="share-url">{{share_url}}</div><div class="share-tip">复制框内的链接，发给自己的朋友</div></div>',
        '<div class="remind-msg t-l">1.您的朋友通过分享页面领取20元优惠券并购买课程后，您将获得<span class="text-orange">20元现金奖励</span>；您的朋友分享之后，他的朋友再购买课程，您还将获得<span class="text-orange">5元额外奖励</span>，多买多得！</div>',
        '<div class="remind-msg t-l">2.现金奖励将直接打到您的跟谁学账号，随时提取，不限最低额度</div>',
        '</div>'
    ].join("");
    var couponTpl = [
        '<div class="staySingle">',
        '<div class="listen-title"><span class="title-info">领取成功</span></div>',
        '<img src="http://img.gsxservice.com/0cms/d/file/content/2016/06/574ed78951c53.png" class="coupon-img">',
        '<div class="staySubmit" style="background:rgb(246,0,79);margin-bottom: 20px;">购买课程</div>',
        '</div>'
    ].join('');

    var inited_share = false;

    function displaySharePanel() {
        if (isApp) {
            app.send('doSharePanel', {});
        } else {
            var $d2 = $('.share-mask');
            if (!inited_share) {
                $d2.on('click', 'img', function() {
                    $d2.hide();
                });
                inited_share = true;
            }
            $d2.show();
        }
    }

    function doShare(forceLogin) {
        if (!pageData.is_login || forceLogin) {
            if (isApp) {
                loginApp(function(res) {
                    currentLoginNumber = JSON.parse(res.user_info)['mobile'];
                    postShareMoney();
                });
            } else {
                var dia = new SlideInDialog({
                    content: shareLoginTpl
                });
                dia.show();
                var cdia = $(dia.mainPanel);
                var smsCode = new getSmsCode({
                    verifyBtn: cdia.find('.verify'),
                    mobileDom: cdia.find('.mobile'),
                    verifyTextDom: cdia.find('.verify-text'),
                    dialog: dia,
                    callBack: function(res, postParam) {
                        pageData.is_login = true;
                        pageData.mobile = postParam.mobile;
                        currentLoginNumber = postParam.mobile;
                        postShareMoney({});
                    }
                });
            }
        } else {
            postShareMoney({});
        }
    }

    var isLoadingShare = false;

    function postShareMoney(param) {
        param = param || {};
        pageData.user_number && (param['user_number'] = pageData.user_number);
        pageData.user_channel && (param['user_channel'] = pageData.user_channel);

        if (isLoadingShare) {
            return;
        }
        isLoadingShare = true;
        if(url().params.pre_number){
            param['pre_number'] = url().params.pre_number;
        }
        if(url().params.ch){
            param['ch'] = url().params.ch;
        }
        $.post(getShareUrl, param).always(function(res) {
            isLoadingShare = false;
            if (res.code == 0) {
                res = res || {};
                var isWeixin = env.thirdapp && env.thirdapp.isWeixin;
                var param = {
                    mobile: currentLoginNumber,
                    url_display: "",
                    share_url: res.data.share_url,
                    btn_display: "display: none"
                };
                if (isWeixin || isApp) {
                    param.url_display = "display: none";
                    param.btn_display = "";
                }
                setShareInfo(res.data.share_url);
                var getSuccessDialog = new SlideInDialog({
                        content: formatTpl(confirmShareTpl, param)
                    });;

                getSuccessDialog.show();
                $('.bubble-icon').hide();
                var mainPanelDom = $(getSuccessDialog.mainPanel);
                mainPanelDom.find('.change_num').click(function() {
                    doShare(true);
                    $('.bubble-icon').show();
                });
                mainPanelDom.find('.staySubmit').click(function() {
                    displaySharePanel();
                    $('.bubble-icon').show();
                });
            } else {
                ui_new.alert({
                    content: res.msg || "请求异常：" + res.code,
                    width: 280,
                    button: '确定'
                });
            }

        });

    }

    var formatTpl = function(tpl, obj) {
        $.each(obj, function(key, value) {
            var reg = new RegExp("{{" + key + "}}", 'ig');
            tpl = tpl.replace(reg, value);
        });
        return tpl;
    };

    var loginTplDialog = null;

    function doGet() {
        if (!pageData.is_login) {
            if (isApp) {
                loginApp(function(res) {
                    currentLoginNumber = JSON.parse(res.user_info)['mobile'];
                    postGetCoupon({
                        mobile: currentLoginNumber
                    });
                });
            } else {
                if (!loginTplDialog) {
                    loginTplDialog = new SlideInDialog({
                        content: loginTpl
                    });
                }
                var dia = loginTplDialog;
                dia.show();
                var cdia = $(dia.mainPanel);
                var smsCode = new getSmsCode({
                    verifyBtn: cdia.find('.verify'),
                    mobileDom: cdia.find('.mobile'),
                    verifyTextDom: cdia.find('.verify-text'),
                    dialog: dia,
                    callBack: function(res, postParam) {
                        pageData.is_login = true;
                        pageData.mobile = postParam.mobile;
                        currentLoginNumber = postParam.mobile;
                        postGetCoupon();
                    }
                });
            }

        } else {
            postGetCoupon({
                mobile: pageData.mobile
            });
        }

    }


    var isLoadingGetCoupon = false;
    var couponTplDialog;

    function postGetCoupon(param) {
        param = param || {};
        pageData.user_number && (param['user_number'] = pageData.user_number);
        pageData.user_channel && (param['user_channel'] = pageData.user_channel);
        if (isLoadingGetCoupon) {
            return;
        }
        isLoadingGetCoupon = true;
        if(url().params.pre_number){
            param['pre_number'] = url().params.pre_number;
        }
        if(url().params.ch){
            param['ch'] = url().params.ch;
        }
        $.post(getCouponUrl, param).always(function(res) {
            isLoadingGetCoupon = false;
            res = res || {};
            if (res.code == 0) {
                if (!couponTplDialog) {
                    couponTplDialog = new SlideInDialog({
                        content: couponTpl
                    });
                }
                var getSuccessDialog = couponTplDialog;
                getSuccessDialog.show();
                $(getSuccessDialog.mainPanel).find('.staySubmit').click(function() {
                    if (isApp) {
                        app.send('toNewWindow', {
                            url: pageData.course_url,
                            web_url: pageData.course_url
                        });
                    } else {
                        location.href = res.data.course_url;
                    }
                });
            } else {
                var btnText = res.code == '110007' ? '前往购买' : '确定'
                var cAlert = ui_new.alert({
                    content: res.msg || "请求异常：" + res.code,
                    width: 280,
                    button: btnText
                });
                if (res.code == '110007') {
                    cAlert.done(function() {
                        if (isApp) {
                            app.send('toNewWindow', {
                                url: pageData.course_url,
                                web_url: pageData.course_url
                            });
                        } else {
                            location.href = pageData.course_url;
                        }

                    });
                }
            }
        });
    }

    function changeBackTopIcon() {
        setTimeout(function() {
            $('.back-top-component img').attr('src', 'http://img.gsxservice.com/0cms/d/file/content/2016/06/574fa1484d181.png');
        }, 500);
    }

    function setShareInfo(shareUrl) {
        var shareContentInfo = [
            {
                title: '新人？求职？没经验？无竞争力？那还不进来看一下？！',
                img: 'http://img.gsxservice.com/0cms/d/file/content/2016/06/575778d2baf3e.png'
            },
            {
                title: '不想年薪百万的请别点！！！',
                img: 'http://img.gsxservice.com/0cms/d/file/content/2016/06/575163c4572a4.jpg'
            },
            {
                title: '一个可以分享赚钱的绝世好课...',
                img: 'http://img.gsxservice.com/0cms/d/file/content/2016/06/575778d124abe.png'
            },
            {
                title: '有人愿意付他们千万年薪，是因为...',
                img: 'http://img.gsxservice.com/0cms/d/file/content/2016/06/575778d124abe.png'
            },
            {
                title: '百度、联想、普华永道等38位明星高管，助你打赢今秋求职战！',
                img: 'http://img.gsxservice.com/0cms/d/file/content/2016/06/575778d248f45.png'
            },
            {
                title: '你和高薪offer之间就差这节课了！！！',
                img: 'http://img.gsxservice.com/0cms/d/file/content/2016/06/575778d2702d3.png'
            },
            {
                title: '找不到好工作，就是因为你不认识CEO！',
                img: 'http://img.gsxservice.com/0cms/d/file/content/2016/06/5757965d83d44.png'
            }
        ];
        var i = Math.floor(Math.random()*7);
        var titleText = shareContentInfo[i].title;
        var imgText = shareContentInfo[i].img;
        var shareInfo = {
            title: titleText,
            content: '38位顶级高管，48节精品直播课，覆盖5大热门行业，助你打赢求职战，拿到高薪offer！',
            url: shareUrl ? shareUrl : location.href,
            img: imgText
        };
        setShare(shareInfo);
    }

    function paddingNumber(number){
        var i1 = parseInt(number/1000); //千位
        var i2 = (parseInt(number/100))%10; //百位
        var i3 = (parseInt(number/10))%100%10; //十位
        var i4 = number%10; //各位
        $('.box-i-1').text(i1);
        $('.box-i-2').text(i2);
        $('.box-i-3').text(i3);
        $('.box-i-4').text(i4);
    }

    function loginApp(callback) {
        Jockey.off('setUserInfo');
        Jockey.on('setUserInfo', function(response) {
            callback(response);
        });
        Jockey.send('getUserInfo');
    };
    return function(page_data) {
        setTimeout(function(){
            $('.bubble-icon').show();
            $('.has-pay-number').show();
        },800);

        $('.first-img-anim').css({
            transform: 'scale(1)'
        });
        setTimeout(function() {
            $('.lazy_img').each(function() {
                $(this).attr('src', $(this).attr('pre_src'));
            });
        }, 300)
        pageData = page_data;
        paddingNumber(pageData.total_pay);
        changeBackTopIcon();

        var imgH = $('.img_1').position().top + $('.img_1').height();

        var fixedBtn = $('.fixed-bottom-btn');
        var fixed_display = !fixedBtn.is(':hidden');

        function setScrollUI() {
            var cTop = $(window).scrollTop();
            if (cTop < imgH && fixed_display) {
                fixedBtn.hide();
                fixed_display = false;
            } else if (cTop > imgH && !fixed_display) {
                fixedBtn.show();
                fixed_display = true;
            }
        }

        $(window).on('scroll', function() {
            setScrollUI();
        });
        setScrollUI();
        setShareInfo(pageData.share_url);

        if (pageData.is_login) {
            currentLoginNumber = pageData.mobile;
        }
        lazyLoadImage.init(false, false, 0);
        $('.share').on('click', function() {
            doShare();
        });
        $('.bubble-icon').on('click', function() {
            doShare();
        });
        $('.get').on('click', function() {
            doGet();
        });
    }
});