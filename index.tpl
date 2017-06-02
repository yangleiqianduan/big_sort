{{*
@file 答题页面（活动）
@author hanzhaohang
@date 2016-05-27
*}}

{{extends file="page/_base/base_default.tpl"}}
{{block name="page"}}
    {{$page_title = "38位顶级高管求职训练营"}}
    {{$page_module = "page/activity/big_shot/index"}}
    {{$enable_backTopButton = true}}
{{/block}}
{{block name="data"}}
    {{$script_data["is_login"] = $tpl_data.is_login}}
    {{$script_data["mobile"] = $tpl_data.mobile}}
    {{$script_data["course_url"] = $tpl_data.course_url}}
    {{$script_data["share_url"] = $tpl_data.share_url}}
    {{$script_data["total_pay"] = $tpl_data.total_pay}}
    {{if isset($smarty.get.user_number)}}
        {{$script_data["user_number"] = $smarty.get.user_number}}
    {{/if}}
    {{if isset($smarty.get.user_channel)}}
        {{$script_data["user_channel"] = $smarty.get.user_channel}}
    {{/if}}


{{/block}}

{{block name="style"}}
    <link rel="stylesheet" href="{{$static_origin}}/src/page/activity/big_shot/index.styl"/>
{{/block}}

{{block name="content"}}
    {{$img[0]="http://img.gsxservice.com/0cms/d/file/content/2016/06/57568a26768e3.jpg"}}
    {{$img[1]="http://img.gsxservice.com/0cms/d/file/content/2016/06/5756c7a279573.jpg"}}
    {{$img[2]="http://img.gsxservice.com/0cms/d/file/content/2016/06/574eba41ed099.png"}}
    {{$img[3]="http://img.gsxservice.com/0cms/d/file/content/2016/06/574eba4218dc9.png"}}
    {{$img[4]="http://img.gsxservice.com/0cms/d/file/content/2016/06/574eba42598d5.png"}}
    {{$img[5]="http://img.gsxservice.com/0cms/d/file/content/2016/06/574eba427959c.png"}}
    {{$img[6]="http://img.gsxservice.com/0cms/d/file/content/2016/06/574eba42aacbc.png"}}
    {{$img[7]="http://img.gsxservice.com/0cms/d/file/content/2016/06/5752f8b0df298.png"}}
    {{$img[8]="http://img.gsxservice.com/0cms/d/file/content/2016/06/574eba4ede543.png"}}
    {{$img[9]="http://img.gsxservice.com/0cms/d/file/content/2016/06/5752709f1d31e.jpg"}}
    {{$img[10]="http://img.gsxservice.com/0cms/d/file/content/2016/06/574eba4f39559.png"}}
    {{$img[11]="http://img.gsxservice.com/0cms/d/file/content/2016/06/5756b73e7a74d.jpg"}}
    {{$img[12]="http://img.gsxservice.com/0cms/d/file/content/2016/06/574eba4f7962b.png"}}
    {{$img[13]="http://img.gsxservice.com/0cms/d/file/content/2016/06/574eba4f9cff3.png"}}
    {{$img[14]="http://img.gsxservice.com/0cms/d/file/content/2016/06/574eba4fbb5fb.png"}}
    {{$img[15]="http://img.gsxservice.com/0cms/d/file/content/2016/06/574eba4fe2dd6.png"}}
    {{$img[16]="http://img.gsxservice.com/0cms/d/file/content/2016/06/574eba5017f9f.png"}}
    {{$img[17]="http://img.gsxservice.com/0cms/d/file/content/2016/06/574eba503a56a.png"}}
    {{$img[18]="http://img.gsxservice.com/0cms/d/file/content/2016/06/575163ee32b26.png"}}
    {{$img[19]="http://img.gsxservice.com/0cms/d/file/content/2016/06/5752f8b11c325.png"}}
    {{$img[20]="http://img.gsxservice.com/0cms/d/file/content/2016/06/57524b217a74b.png"}}

    <div class="hide-dialog"></div>
    <div class="content" style="    padding-bottom: 50px;">
        {{foreach $img as $cImg}}
            {{if $cImg@index == 19}}
                {{if !$ext_data.is_app}}
                <div class="single-img img_{{$cImg@index}}">
                    <a href="http://m.genshuixue.com/app?ct=GenShuiXue_M2100013">
                        <img {{if $cImg@index > 2}}class="lazy_img" pre_{{else}}data-{{/if}}src="{{$cImg}}" width="100%">
                    </a>
                </div>
                {{/if}}
            {{else}}
            <div class="single-img img_{{$cImg@index}}">
                {{if $cImg@index == 1}}
                    <div class="bubble-icon hide">
                        <img src="{{$static_origin}}/src/page/activity/big_shot/image/bubble.png">
                    </div>
                {{/if}}
                {{if $cImg@index == 0}}
                    <div class="has-pay-number hide">
                        <div class="has-pay-order">
                            <div class="box-item"><p class="box-i-1"></p></div>
                            <div class="box-item"><p class="box-i-2"></p></div>
                            <div class="box-item"><p class="box-i-3"></p></div>
                            <div class="box-item box-no-right"><p class="box-i-4"></p></div>
                        </div>
                        <div class="has-pay-text">
                            <p>人已报名</p>
                        </div>
                    </div>
                {{/if}}
                {{if $cImg@index == 0}}<div class="first-img-anim"></div>{{/if}}
                <img {{if $cImg@index > 2}}class="lazy_img" pre_{{else}}data-{{/if}}src="{{$cImg}}" width="100%">
                {{if $cImg@index == 1}}
                    <div class="buy-btn">
                        <div class="get"></div>
                        <div class="share"></div>
                    </div>
                {{/if}}
            </div>
            {{/if}}



        {{/foreach}}
        <div>
            <img src="{{$static_origin}}/src/page/activity/big_shot/image/logo.png" width="100%">
        </div>
    </div>
    <div class="fixed-bottom-btn">
        <p class="l get">报名领20元优惠券</p>
        <p class="r share">点我分享赚20元现金</p>
    </div>

    {{* 微信分享页面遮罩层 *}}
    <div class="share-mask" style="display: none;">
        <div class="content">
            <img width="100%" height="100%" src="http://img.gsxservice.com/0cms/d/file/content/2016/03/56e91f33723af.png"/>
        </div>
    </div>

{{/block}}