var mifang_load=true;
var jyzh_nav_load=true;
var zhxx_nav_load=true;
var uid="";
var name="";
var password="";
var logined=0;
var username="";
var content="";
var user_photo="";
var sex="";
var brithday=0;
var version="1.0.13";
var vip=0;
var retime=Date.parse(new Date());
var retime2=Date.parse(new Date());
var retime5=Date.parse(new Date());
var retime3=Date.parse(new Date());
var retime4=Date.parse(new Date());
//APP初始数据的处理


var db = window.openDatabase("ML_DB","1.0","ML_DB",200000);

if(!db)
    alert("Failed to connect to database.");
initDB(db);

db.transaction(function(tx){
    var sql="SELECT * FROM tUser WHERE logined=1";
    tx.executeSql(sql,[],function(tx,resultSet){

        var rows = resultSet.rows;
        for(var i=0,len=rows.length;i<len;i++){
            logined=rows.item(i).logined;
            uid=rows.item(i).uid;
            name=rows.item(i).name;
            password=rows.item(i).password;
            level=rows.item(i).level;
        }
        if(logined==0){
            window.location="index.html";
        }
        else{
            var sql="SELECT * FROM tUser_info WHERE uid=?";
            tx.executeSql(sql,[uid],function(tx,resultSet2){
                var rows2 = resultSet2.rows;
                for(var i=0,len=rows2.length;i<len;i++){
                    username=rows2.item(i).username;
                    if (window.localStorage) {
                        localStorage.setItem("qsl_uid", uid);
                        localStorage.setItem("qsl_name", name);
                        localStorage.setItem("qsl_level", level);
                        localStorage.setItem("qsl_username", username);
                        localStorage.setItem("qsl_password", password);
                    } else {
                        Cookie.write("qsl_uid", uid);
                        Cookie.write("qsl_name", name);
                        Cookie.write("qsl_level", level);
                        Cookie.write("qsl_username", username);
                        Cookie.write("qsl_password", password);
                    }
                    uid = window.localStorage? localStorage.getItem("qsl_uid"): Cookie.read("qsl_uid");
                    name = window.localStorage? localStorage.getItem("qsl_name"): Cookie.read("qsl_name");
                    ulevel = window.localStorage? localStorage.getItem("qsl_level"): Cookie.read("qsl_level");
                    username = window.localStorage? localStorage.getItem("qsl_username"): Cookie.read("qsl_username");
                    password = window.localStorage? localStorage.getItem("qsl_password"): Cookie.read("qsl_password");
                    sex = rows2.item(i).sex;
                    refresh_userinfo();
                    check_id();
                    $("#userinfo").text(username);
                    $("#user_username").text(username);
                    $(".username_area").html(username);
                    $(".userid_area").html("ID120"+uid);
                    $("#user_name").text(name+" "+uid);
                    //$("#update_photo").attr("src",vhost+'/uploadimgforapp.php?uid='+uid+'&localurl='+localurl);
                    $("#user_photo,#index_user_photo").attr("src",vhost+'/userimg/'+uid+'/small.jpg');
                    get_tsmessage(uid);
                }
            });
        }
    });
});


function get_tsmessage(uid){
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=get_tsmessage&version='+version+'&callback=?',
        success: function(data) {
            var rel=data.result;
            //$("html").append(vhost+'/api/getjosn.php?a=get_tsmessage&version='+version+'&callback=?');
            //alert(rel.length);
            for (var i = 0; i < rel.length; i++) {
                show_ts_message(rel[i].id,rel[i].message,rel[i].url);
                $("#update_version").show();
                $("#update_version a").text("最新版本号: "+rel[i].version);
                $("#update_version a").attr("onClick","update_app_apk('"+rel[i].url+"');");
            }
            $("#version").text("当前版本号: "+version);
        }
    });
}

function show_ts_message(id,tsmessage,tsurl){

}

function update_app_apk(url){
    navigator.app.loadUrl(encodeURI(url), { openExternal:true});
}

function show_personinfo_mag(fuid,bs){
    showMask("加载中。。。");
    if($.os.android || $.os.ios){
        $('#webupphoto').hide();
        $('#phoneupphoto').show();
    }else{
        $('#webupphoto').show();
        $('#phoneupphoto').hide();
    }
    $('#webupphoto').show();
    $('#phoneupphoto').hide();
    var simi=0;
    $(".u_doing").hide();
    $("#m_user_photo").attr("src",'pic/small.png');
    $("#m_user_name").text("");
    $("#m_username").text("");
    if(fuid!=0){
        $("#user_mag").attr("data-uid",uid);
    }else{
        $("#user_mag").attr("data-uid",fuid);
    }
    //alert(rel[i].username);
    $("#m_user_brithday").text("");

    $("#m_user_sex").html("");

    $("#m_user_adr").html("");

    $("#m_user_tel").html("");

    $("#m_user_content").html("");
    if(fuid==0){
        fuid=uid;
        simi=1;
        $(".u_doing").show();
        $("#changeuserimg").show();
        $("#upload_photo").show();
        $("#user_mag .setting_list2 .update_a").attr('href','#update_user_info');
        $(".show_img_a").attr("data-imgid","0");
        $("#upload_user_photo").removeAttr("href");
        $("#upload_user_photo").attr("onclick","upload_user_photo()");
        $("")
    }else{
        simi=0;
        $(".u_doing").hide();
        $("#changeuserimg").hide();
        $("#upload_photo").hide();
        $("#user_mag .update_a").removeAttr("href");
        $(".show_img_a").attr("data-imgid",fuid);
        $("#upload_user_photo").removeAttr("onclick");
    }

    $.jsonP({
        url: vhost+'/api/getjosn.php?a=userinfo&fuid='+fuid+'&simi='+simi+'&uid='+uid+'&token='+get_token(uid,password)+'&callback=?',
        success: function(data) {
            var timestamp = Date.parse(new Date());
            var rel=data.result;
            setTimeout(function(){
                updatexc(fuid);
            },50);
            for (var i = 0; i < rel.length; i++) {


                // $("#m_user_photo_h5").attr("src",vhost+'/userimg/'+fuid+'/small.jpg?id='+timestamp);

                if(fuid==uid){
                    $("#m_user_name").text(rel[i].name);
                    $("#show_m_user_name").show();
                }else{
                    $("#m_user_name").text("");
                    $("#show_m_user_name").hide();
                }
                $("#m_username").text(rel[i].username);
                //alert(rel[i].username);
                $("#m_user_brithday").text(rel[i].brithday);
                var sex_html="";
                if(rel[i].sex=="0"){
                    sex_html="<b>女</b>";
                }else if(rel[i].sex=="1"){
                    sex_html="<b>男</b>";
                }else if(rel[i].sex=="2"){
                    sex_html="未知";
                }
                $("#m_user_sex").html(sex_html);
                $("#m_user_adr").html(rel[i].adr);
                var m_uheight='';
                if(rel[i].uheight!="0"){
                    m_uheight=rel[i].uheight;
                }
                var m_uweight='';
                if(rel[i].uweight!="0"){
                    m_uweight=rel[i].uweight;
                }
                var m_ushouru='';
                if(rel[i].ushouru!="0"){
                    m_ushouru=rel[i].ushouru;
                }
                $("#m_user_height").html(m_uheight+" cm");
                $("#m_user_weight").html(m_uweight+" kg");
                if(vip==1 || simi==1 ){
                    $("#vip_simi").show();
                    $("#m_user_wx").html(rel[i].uwx);
                    $("#m_user_qq").html(rel[i].uqq);
                }else{
                    $("#vip_simi").hide();
                }
                $("#m_user_no").html("<b>No.120"+rel[i].uid+"</b>");
                $("#m_user_zeou").html(rel[i].uzeou);
                if(simi==1){
                    var bqhtml="";
                    bqhtml+='<span id="bq_10" class="bqb bsex0" data-id="10" data-name="萌萌哒">萌萌哒</span>';
                    bqhtml+='<span id="bq_20" class="bqb bsex0" data-id="20" data-name="御姐">御姐</span>';
                    bqhtml+='<span id="bq_30" class="bqb bsex0" data-id="30" data-name="女老板">女老板</span>';
                    bqhtml+='<span id="bq_40" class="bqb bsex0" data-id="40" data-name="宠物控">宠物控</span>';
                    bqhtml+='<span id="bq_50" class="bqb bsex0" data-id="50" data-name="厨娘">厨娘</span>';
                    bqhtml+='<span id="bq_60" class="bqb bsex0" data-id="60" data-name="工作狂">工作狂</span>';
                    bqhtml+='<span id="bq_70" class="bqb bsex0" data-id="70" data-name="小女人">小女人</span>';
                    bqhtml+='<span id="bq_80" class="bqb bsex0" data-id="80" data-name="创业青年">创业青年</span>';
                    bqhtml+='<span id="bq_90" class="bqb bsex0" data-id="90" data-name="夜店女王">夜店女王</span>';
                    bqhtml+='<span id="bq_100" class="bqb bsex0" data-id="100" data-name="小资情调">小资情调</span>';
                    bqhtml+='<span id="bq_110" class="bqb bsex0" data-id="110" data-name="朝九晚五">朝九晚五</span>';
                    bqhtml+='<span id="bq_120" class="bqb bsex0" data-id="120" data-name="文艺青年">文艺青年</span>';
                    bqhtml+='<span id="bq_130" class="bqb bsex0" data-id="130" data-name="爱运动">爱运动</span>';
                    bqhtml+='<span id="bq_140" class="bqb bsex0" data-id="140" data-name="温柔型">温柔型</span>';
                    bqhtml+='<span id="bq_150" class="bqb bsex0" data-id="150" data-name="天生浪漫">天生浪漫</span>';
                    bqhtml+='<span id="bq_160" class="bqb bsex0" data-id="160" data-name="吃货">吃货</span>';
                    bqhtml+='<span id="bq_170" class="bqb bsex0" data-id="170" data-name="理财高手">理财高手</span>';
                    bqhtml+='<span id="bq_180" class="bqb bsex0" data-id="180" data-name="主动型">主动型</span>';
                    bqhtml+='<span id="bq_190" class="bqb bsex0" data-id="190" data-name="被动型">被动型</span>';
                    bqhtml+='<span id="bq_200" class="bqb bsex0" data-id="200" data-name="崇尚自由">崇尚自由</span>';
                    bqhtml+='<span id="bq_210" class="bqb bsex0" data-id="210" data-name="爱社交">爱社交</span>';
                    bqhtml+='<span id="bq_15" class="bqb bsex1" data-id="15" data-name="萝莉控">萝莉控</span>';
                    bqhtml+='<span id="bq_25" class="bqb bsex1" data-id="25" data-name="御姐控">御姐控</span>';
                    bqhtml+='<span id="bq_35" class="bqb bsex1" data-id="35" data-name="事业型">事业型</span>';
                    bqhtml+='<span id="bq_45" class="bqb bsex1" data-id="45" data-name="爱动物">爱动物</span>';
                    bqhtml+='<span id="bq_55" class="bqb bsex1" data-id="55" data-name="煮夫">煮夫</span>';
                    bqhtml+='<span id="bq_65" class="bqb bsex1" data-id="65" data-name="工作狂">工作狂</span>';
                    bqhtml+='<span id="bq_75" class="bqb bsex1" data-id="75" data-name="大男人">大男人</span>';
                    bqhtml+='<span id="bq_85" class="bqb bsex1" data-id="85" data-name="创业青年">创业青年</span>';
                    bqhtml+='<span id="bq_95" class="bqb bsex1" data-id="95" data-name="一夜九次郎">一夜九次郎</span>';
                    bqhtml+='<span id="bq_105" class="bqb bsex1" data-id="105" data-name="品酒达人">品酒达人</span>';
                    bqhtml+='<span id="bq_115" class="bqb bsex1" data-id="115" data-name="生活规律">生活规律</span>';
                    bqhtml+='<span id="bq_125" class="bqb bsex1" data-id="125" data-name="文艺青年">文艺青年</span>';
                    bqhtml+='<span id="bq_135" class="bqb bsex1" data-id="135" data-name="爱运动">爱运动</span>';
                    bqhtml+='<span id="bq_145" class="bqb bsex1" data-id="145" data-name="体贴型">体贴型</span>';
                    bqhtml+='<span id="bq_155" class="bqb bsex1" data-id="155" data-name="爱浪漫">爱浪漫</span>';
                    bqhtml+='<span id="bq_165" class="bqb bsex1" data-id="165" data-name="爱美食">爱美食</span>';
                    bqhtml+='<span id="bq_175" class="bqb bsex1" data-id="175" data-name="为人大方">为人大方</span>';
                    bqhtml+='<span id="bq_185" class="bqb bsex1" data-id="185" data-name="被动型">被动型</span>';
                    bqhtml+='<span id="bq_195" class="bqb bsex1" data-id="195" data-name="主动型">主动型</span>';
                    bqhtml+='<span id="bq_205" class="bqb bsex1" data-id="205" data-name="害怕束缚">害怕束缚</span>';
                    bqhtml+='<span id="bq_215" class="bqb bsex1" data-id="215" data-name="社交达人">社交达人</span>';

                    $("#biaoqianselect").html(bqhtml);
                    $("#biaoqianarea").html("");
                    getubqstr(rel[i].ubiaoqian);
                }
                $("#m_user_zhiye").html(rel[i].uzhiye);

                $("#m_user_content").html(rel[i].content);

                if(simi==1) {
                    $("#simi").show();
                    $("#editxiangcebutton").show();
                    $("#m_user_rname").html(rel[i].urname);
                    $("#m_user_tel").html(rel[i].tel);
                    $("#m_user_shouru").html(m_ushouru + " 元/月");
                    $("#m_user_shouhuodizhi").html(rel[i].ushouhuodizhi);
                    $("#m_user_midou").html(rel[i].umidou);
                }else{
                    $("#simi").hide();
                    $("#editxiangcebutton").hide();
                }
                $("#m_user_photo_h5_area").html('<img class="loadimg" src="pic/throbber.svg" /><img onload="re_check_this_img_size2(this,\'out\');" style="display:none;" src="'+vhost+'/userimg/'+fuid+'/small.jpg?id='+timestamp+'" />');
            }
            if(bs!=1){
                $.ui.loadContent("#user_mag", false, false, "up");
            }
            $.ui.hideMask();
        }
    });
}

function updatexc(fuid){
    $(".u_person_img_area").html("");
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=show_userxc&uid='+uid+'&fuid='+fuid+'&token='+get_token(uid,password)+'&callback=?',
        success: function(data) {
            var rel=data.result;
            var fa_html='';
            fa_html+='<div class="swiper-container swiper-container-4" style=" height: 100%;">';
            fa_html+='<div class="swiper-wrapper" id="show_person_img_area" style=" height: 100%;">';
            for(var i=0;i<rel.length;i++){
                fa_html+='<div class="swiper-slide" style=" overflow:hidden;"><img class="loadimg" src="pic/throbber.svg" />';
                fa_html+='<img class="loadimg" src="pic/throbber.svg" /> <img onload="re_check_this_img_size2(this,\'in\');" data-id="1" style="width:100%; display:none;" src="'+vhost+'/'+rel[i].bphoto+'" />';
                fa_html+='</div>';
            }
            fa_html+='</div>';
            fa_html+='<div class="swiper-pagination swiper-pagination-4" style="line-height: 24px; bottom: 0px; position: absolute; z-index: 100; "></div>';
            fa_html+='</div>';
            $(".u_person_img_area").html(fa_html);
            var ss3_height=$("#content").width();
            $(".swiper-container-4").find(".swiper-wrapper").find(".swiper-slide").height(ss3_height-20);
            $(".swiper-container-4").find(".swiper-wrapper").height(ss3_height);

            var swiper4 = new Swiper('.swiper-container-4', {
                pagination: '.swiper-pagination-4',
                paginationclass: 'showpsum-4',
                paginationClickable: true,
                spaceBetween: 0
            });
        }
    });
}

function getfindubqstr(key){
    var keyary=key.split(',');
    var html="";
    $("#find_biaoqian").html("");
    for(var i=0;i<keyary.length;i++){
        if(keyary[i]=="10"){
            arfindbiaoqian("萌萌哒","10");
        }else if(keyary[i]=="20"){
            arfindbiaoqian("御姐","20");
        }else if(keyary[i]=="30"){
            arfindbiaoqian("女老板","30");
        }else if(keyary[i]=="40"){
            arfindbiaoqian("宠物控","40");
        }else if(keyary[i]=="50"){
            arfindbiaoqian("厨娘","50");
        }else if(keyary[i]=="60"){
            arfindbiaoqian("工作狂","60");
        }else if(keyary[i]=="70"){
            arfindbiaoqian("小女人","70");
        }else if(keyary[i]=="80"){
            arfindbiaoqian("创业青年","80");
        }else if(keyary[i]=="90"){
            arfindbiaoqian("夜店女王","90");
        }else if(keyary[i]=="100"){
            arfindbiaoqian("小资情调","100");
        }else if(keyary[i]=="110"){
            arfindbiaoqian("朝九晚五","110");
        }else if(keyary[i]=="120"){
            arfindbiaoqian("文艺青年","120");
        }else if(keyary[i]=="130"){
            arfindbiaoqian("爱运动","130");
        }else if(keyary[i]=="140"){
            arfindbiaoqian("温柔型","140");
        }else if(keyary[i]=="150"){
            arfindbiaoqian("天生浪漫","150");
        }else if(keyary[i]=="160"){
            arfindbiaoqian("吃货","160");
        }else if(keyary[i]=="170"){
            arfindbiaoqian("理财高手","170");
        }else if(keyary[i]=="180"){
            arfindbiaoqian("主动型","180");
        }else if(keyary[i]=="190"){
            arfindbiaoqian("被动型","190");
        }else if(keyary[i]=="200"){
            arfindbiaoqian("崇尚自由","200");
        }else if(keyary[i]=="210"){
            arfindbiaoqian("爱社交","210");
        }else if(keyary[i]=="15"){
            arfindbiaoqian("萝莉控","15");
        }else if(keyary[i]=="25"){
            arfindbiaoqian("御姐控","25");
        }else if(keyary[i]=="35"){
            arfindbiaoqian("事业型","35");
        }else if(keyary[i]=="45"){
            arfindbiaoqian("爱动物","45");
        }else if(keyary[i]=="55"){
            arfindbiaoqian("煮夫","55");
        }else if(keyary[i]=="65"){
            arfindbiaoqian("工作狂","65");
        }else if(keyary[i]=="75"){
            arfindbiaoqian("大男人","75");
        }else if(keyary[i]=="85"){
            arfindbiaoqian("创业青年","85");
        }else if(keyary[i]=="95"){
            arfindbiaoqian("一夜九次郎","95");
        }else if(keyary[i]=="105"){
            arfindbiaoqian("品酒达人","105");
        }else if(keyary[i]=="115"){
            arfindbiaoqian("生活规律","115");
        }else if(keyary[i]=="125"){
            arfindbiaoqian("文艺青年","125");
        }else if(keyary[i]=="135"){
            arfindbiaoqian("爱运动","135");
        }else if(keyary[i]=="145"){
            arfindbiaoqian("体贴型","145");
        }else if(keyary[i]=="155"){
            arfindbiaoqian("爱浪漫","155");
        }else if(keyary[i]=="165"){
            arfindbiaoqian("爱美食","165");
        }else if(keyary[i]=="175"){
            arfindbiaoqian("为人大方","175");
        }else if(keyary[i]=="185"){
            arfindbiaoqian("被动型","185");
        }else if(keyary[i]=="195"){
            arfindbiaoqian("主动型","195");
        }else if(keyary[i]=="205"){
            arfindbiaoqian("害怕束缚","205");
        }else if(keyary[i]=="215"){
            arfindbiaoqian("社交达人","215");
        }
    }
}
function arfindbiaoqian(name,id){
    $("#find_biaoqian").append('<span>'+name+'</span>');
}

function getubqstr(key){
    var keyary=key.split(',');
    var html="";
    $("#biaoqianarea").html("");
    $("#m_user_biaoqian").html("");
    for(var i=0;i<keyary.length;i++){

        if(keyary[i]=="10"){
            arbiaoqian("萌萌哒","10");
        }else if(keyary[i]=="20"){
            arbiaoqian("御姐","20");
        }else if(keyary[i]=="30"){
            arbiaoqian("女老板","30");
        }else if(keyary[i]=="40"){
            arbiaoqian("宠物控","40");
        }else if(keyary[i]=="50"){
            arbiaoqian("厨娘","50");
        }else if(keyary[i]=="60"){
            arbiaoqian("工作狂","60");
        }else if(keyary[i]=="70"){
            arbiaoqian("小女人","70");
        }else if(keyary[i]=="80"){
            arbiaoqian("创业青年","80");
        }else if(keyary[i]=="90"){
            arbiaoqian("夜店女王","90");
        }else if(keyary[i]=="100"){

            arbiaoqian("小资情调","100");
        }else if(keyary[i]=="110"){
            arbiaoqian("朝九晚五","110");
        }else if(keyary[i]=="120"){
            arbiaoqian("文艺青年","120");
        }else if(keyary[i]=="130"){
            arbiaoqian("爱运动","130");
        }else if(keyary[i]=="140"){
            arbiaoqian("温柔型","140");
        }else if(keyary[i]=="150"){
            arbiaoqian("天生浪漫","150");
        }else if(keyary[i]=="160"){
            arbiaoqian("吃货","160");
        }else if(keyary[i]=="170"){
            arbiaoqian("理财高手","170");
        }else if(keyary[i]=="180"){
            arbiaoqian("主动型","180");
        }else if(keyary[i]=="190"){
            arbiaoqian("被动型","190");
        }else if(keyary[i]=="200"){
            arbiaoqian("崇尚自由","200");
        }else if(keyary[i]=="210"){
            arbiaoqian("爱社交","210");
        }else if(keyary[i]=="15"){
            arbiaoqian("萝莉控","15");
        }else if(keyary[i]=="25"){
            arbiaoqian("御姐控","25");
        }else if(keyary[i]=="35"){
            arbiaoqian("事业型","35");
        }else if(keyary[i]=="45"){
            arbiaoqian("爱动物","45");
        }else if(keyary[i]=="55"){
            arbiaoqian("煮夫","55");
        }else if(keyary[i]=="65"){
            arbiaoqian("工作狂","65");
        }else if(keyary[i]=="75"){
            arbiaoqian("大男人","75");
        }else if(keyary[i]=="85"){
            arbiaoqian("创业青年","85");
        }else if(keyary[i]=="95"){
            arbiaoqian("一夜九次郎","95");
        }else if(keyary[i]=="105"){
            arbiaoqian("品酒达人","105");
        }else if(keyary[i]=="115"){
            arbiaoqian("生活规律","115");
        }else if(keyary[i]=="125"){
            arbiaoqian("文艺青年","125");
        }else if(keyary[i]=="135"){
            arbiaoqian("爱运动","135");
        }else if(keyary[i]=="145"){
            arbiaoqian("体贴型","145");
        }else if(keyary[i]=="155"){
            arbiaoqian("爱浪漫","155");
        }else if(keyary[i]=="165"){
            arbiaoqian("爱美食","165");
        }else if(keyary[i]=="175"){
            arbiaoqian("为人大方","175");
        }else if(keyary[i]=="185"){
            arbiaoqian("被动型","185");
        }else if(keyary[i]=="195"){
            arbiaoqian("主动型","195");
        }else if(keyary[i]=="205"){
            arbiaoqian("害怕束缚","205");
        }else if(keyary[i]=="215"){
            arbiaoqian("社交达人","215");
        }
    }
}

function arbiaoqian(name,id){
    $("#bq_"+id).remove();
    $("#biaoqianarea").append('<span id="sbq_'+id+'" class="sbqb" data-id="'+id+'" data-name="'+name+'">'+name+'<input type="hidden" name="bq_id" value="'+id+'" /></span>');
    $("#m_user_biaoqian").append('<span id="sbq_'+id+'" class="sbqbf" data-id="'+id+'" data-name="'+name+'">'+name+'</span>');
}

function loadedPanel(what){
}

function load_mifang_panel(what){
    if(!mifang_load) return false;
    var mifang_list="";
    mifang_load=false;
}

var remain=true;

function load_main_panel(what){
    if($.os.ios){
        //$(".header").css("padding-top",24);
        //$(".header").css("height",60);
        $(".main_nav_list").find(".divider").css("padding-top",24).css("height",70);
        if(window.StatusBar) {
            StatusBar.styleLightContent();
        }
    }

    mainpage=true;

    if(remain){
        remain=false;
        retime=Date.parse(new Date());
    }else{
        if(Date.parse(new Date())-retime>60*5*1000){
            retime=Date.parse(new Date());
            remain=true;
        }else{
            return false;
        }
    }

    if(uid!="")
        refresh_userinfo();

    $.jsonP({
        url: vhost+'/api/getjosn.php?a=show_main_swiper&callback=?',
        success: function(data) {
            var rel=data.result;
            var whtml="";
            for(var i=0;i<rel.length;i++){

                whtml+='<div class="swiper-slide" style=" overflow:hidden;">';
                whtml+='<div class="swiper-slide-img" style="overflow: hidden; border-top:1px solid #CCC;">';
                whtml+='<img class="loadimg" src="pic/throbber.svg" /><img onload="re_check_this_img_size(this,\'out\');" onclick="show_newsinfo('+rel[i].id+','+rel[i].kind+');" style="width:100%; display:none;" src="'+vhost+'/'+rel[i].pic+'" />';
                whtml+='</div>';
                whtml+='<div style="width: 96%; margin-left: 2%; overflow: hidden; line-height: 42px; font-size: 12px; color:#e51b49;"><b>'+rel[i].title+'</b></div>';
                whtml+='</div>';

            }
            $("#main_wrapper").html(whtml);
            var ss_height=$("#content").width()*(4/8);
            $(".swiper-container-1").find(".swiper-wrapper").find(".swiper-slide").height(ss_height+32);
            $(".swiper-container-1").find(".swiper-wrapper").find(".swiper-slide-img").height(ss_height);

            $(".swiper-container-1").find(".showpsum").text(rel.length);
            var swiper1 = new Swiper('.swiper-container-1', {
                pagination: '.swiper-pagination-1',
                paginationclass: 'showpsum-1',
                paginationClickable: true,
                spaceBetween: 0,
                centeredSlides: true,
                autoplay: 5000,
                autoplayDisableOnInteraction: false
            });
            swiper1show=1;
        }
    });

}

var refind=true;

function load_find_panel(what){

    if(uid==""){
        window.location="main.html#main";
        return false;
    }
    if(refind){
        refind=false;
        retime2=Date.parse(new Date());
    }else{
        if(Date.parse(new Date())-retime2>60*5*1000){
            retime2=Date.parse(new Date());
            refind=true;
        }else{
            return false;
        }
    }

    $.jsonP({
        url: vhost+'/api/getjosn.php?a=get_find&uid='+uid+'&token='+get_token(uid,password)+'&callback=?',
        success: function(data) {
            var rel=data.result;
            var fa_html="";

            //$("#find_img_area").html(fa_html);

            fa_html+='<div class="swiper-container swiper-container-2">';
            fa_html+='<div style="position: absolute; width: auto; padding: 5px; padding-left:10px; padding-right:10px;background:url(\'img/00050.png\'); z-index: 100; color: #FFF; font-size: 12px;">';
            fa_html+='<span class="showpsum-2"></span>/<span class="showpsum"></span>';
            fa_html+='</div>';
            fa_html+='<div class="swiper-wrapper" id="find_area">';

            for(var i=0;i<rel.length;i++){
                fa_html+='<div class="swiper-slide" data-id="'+rel[i].uid+'" style=" overflow:hidden;">';
                fa_html+=' <img class="loadimg" src="pic/throbber.svg" /><img onload="re_check_this_img_size(this,\'out\');" style="width:100%; display:none;" src="'+vhost+'/'+rel[i].pic+'" />';
                fa_html+='</div>';
            }
            fa_html+='</div>';
            fa_html+='<div class="swiper-pagination swiper-pagination-2" style="background:url(\'img/00050.png\'); width: auto; position: absolute; right:0px;  line-height: 24px; bottom: 0px; display: none;"></div>';
            fa_html+='</div>';

            $("#find_img_area").html(fa_html);
            var ss2_height=$("#content").height()*0.8;
            $(".swiper-container-2").find(".swiper-wrapper").find(".swiper-slide").height(ss2_height);
            $(".swiper-container-2").find(".showpsum").text(rel.length);

            var swiper2 = new Swiper('.swiper-container-2', {
                pagination: '.swiper-pagination-2',
                paginationclass: 'showpsum-2',
                paginationClickable: true,
                spaceBetween: 0
            });
        }
    });
}

var remimi=true;

function load_mimi_panel(what) {
    /*if (uid == "") {
     window.location = "main.html#main";
     return false;
     }
     if (remimi) {
     remimi = false;
     retime5 = Date.parse(new Date());
     } else {
     if (Date.parse(new Date()) - retime5 > 60 * 5 * 1000) {
     retime5 = Date.parse(new Date());
     remimi = true;
     } else {
     return false;
     }
     }*/
    getmimi(0,10,'down');
}

function getmimi(lastid,count,state){
    var plastid=0;
    if(lastid==0){
        plastid=9999999999;
    }else{
        plastid=lastid;
    }
    var ht=$("#mimi_ht").val();
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=show_mimi&uid='+uid+'&lastid='+plastid+'&count='+count+'&state='+state+'&ht='+ht+'&token='+get_token(uid,password)+'&callback=?',
        success: function(data) {
            var rel=data.result;
            var whtml="";
            for(var i=0;i<rel.length;i++){
                whtml+='<li style=" font-size:12px; padding-bottom: 0px; padding-right: 5px;" data-id="'+rel[i].id+'">';
                whtml+='<table cellpadding="0" cellspacing="0" style="background: #FFF; padding:5px; width:100%;"><tr><td valign="top" style="height: 42px; width: 42px; line-height: 42px;">';
                if(rel[i].sex=="1"){
                    whtml+='<div style="height: 30px; width: 30px; border-radius: 100%; overflow:hidden;"><img style="width: 30px; height: 30px;" src="'+vhost+'/userimg/'+rel[i].uid+'/small.jpg" width="30"/></div>';
                }else{
                    whtml+='<div style="height: 30px; width: 30px; border-radius: 100%; overflow: hidden;"><img style="width: 30px; height: 30px;" src="'+vhost+'/userimg/'+rel[i].uid+'/small.jpg" width="30"/></div>';
                }

                whtml+='</td>';

                if(rel[i].niming=='0'){
                    whtml+='<td valign="top" style=" padding-left: 10px;"><div><a onclick="show_personinfo_mag('+rel[i].uid+');" data-transition="up" style="color:#ea3112;"><b>'+rel[i].username+'</b></a>&nbsp;&nbsp;';
                }else{
                    whtml+='<td valign="top" style=" padding-left: 10px;"><div><b>'+rel[i].username+'</b>&nbsp;&nbsp;';
                }


                whtml+='<b style=" color: #007FDC; line-height: 32px; ">'+rel[i].date+'</b></td></tr>';


                var content=rel[i].content;
                var contents=content;
                var clength=content.length;
                var cover=0;
                if(clength>100){
                    content=content.substring(0,100)+"...";
                    cover=1;
                }

                whtml+='<tr><td colspan="2"> <div class="content" style="font-size: 12px; line-height: 20px; width: 100%; max-height:100px; min-height: 40px; overflow:hidden; text-overflow:ellipsis;">';
                if(rel[i].ht==1)
                    whtml+="<span style='padding:2px; color:#d01842;'>#不吐不快#</span>";
                if(rel[i].ht==2)
                    whtml+="<span style='padding:2px; color:#d01842;'>#男人真相#</span>";
                if(rel[i].ht==3)
                    whtml+="<span style='padding:2px; color:#d01842;'>#秒变女神#</span>";
                if(rel[i].ht==4)
                    whtml+="<span style='padding:2px; color:#d01842;'>#斗小三#</span>";
                if(rel[i].ht==5)
                    whtml+="<span style='padding:2px; color:#d01842;'>#啪啪啪#</span>";
                if(rel[i].ht==6)
                    whtml+="<span style='padding:2px; color:#d01842;'>#靠谱男#</span>";
                if(rel[i].ht==7)
                    whtml+="<span style='padding:2px; color:#d01842;'>#减肥#</span>";
                if(rel[i].ht==8)
                    whtml+="<span style='padding:2px; color:#d01842;'>#商城#</span>";
                whtml+=content+'</div><div class="contents" style="font-size: 12px; line-height: 20px; width: 100%; display:none; ">'+contents+'</div>';
                if(cover==1){
                    whtml+='<p style="width: 100%; text-align:left; " onclick="open_content(this);"><b style=" color:#d01842;">展开>></b></p>';
                    whtml+='<p style="width: 100%; text-align:left; display: none; " onclick="close_content(this);"><b style=" color:#d01842;"><<收起</b></p>';
                }
                whtml+='</td></tr>';

                whtml+='<tr><td colspan="2">';

                if(rel[i].toupiao==1){
                    whtml+='<div style="width: 90%; display:table; margin: 5%; ">';
                    whtml+='<div style="width: 50%; overflow:hidden; float:left;" onclick="clicklike('+rel[i].id+');"><b><a style="padding-left: 5px;" class="icon icon-plus">'+rel[i].like_text+'</a></b>(<span id="likecount'+rel[i].id+'">'+rel[i].like+'</span>)</div><div style="width: 50%; overflow:hidden; float:left;text-align: right;" onclick="clickunlike('+rel[i].id+');">(<span id="unlikecount'+rel[i].id+'">'+rel[i].unlike+'</span>)<b><a style="padding-left: 5px;" class="icon icon-plus">'+rel[i].unlike_text+'</a></b></div>';
                    whtml+='<div style="float:left; width:100%; line-height: 8px; height:8px; border-radius: 5px; background:#EEE; margin-top:5px; overflow: hidden;">';
                    whtml+='<div style="';
                    var likesum=parseInt(rel[i].like);
                    var unlikesum=parseInt(rel[i].unlike);
                    var allsum=likesum+unlikesum;
                    if(allsum!=0) {
                        whtml += 'background:#999; height:8px; line-height:8px;width:' + parseInt((likesum/allsum)*100)+'%;';
                    }
                    whtml+='">';
                    whtml+='</div>';
                    whtml+='</div>';
                    whtml+='</div>';
                }
                whtml+='<p onclick="ml_reliuyan(this,'+rel[i].id+');" id="ml_reliuyan'+rel[i].id+'" style="text-align: right; color: #ff4646;border-top: 1px solid #EEE;">&nbsp;&nbsp;<a class="icon icon-chat-3" style="font-size:14px; font-weight: 600;"></a></p></div></td>';

                whtml+='</tr>';
                whtml+='<tr><td colspan="2"> ';
                whtml+='<div id="reliuyan'+rel[i].id+'" style="background:#FFF; margin:5px;"><div id="reliuyaninput'+rel[i].id+'" style="background: #FFF; margin-bottom: 10px; margin-top: 0px; display:none;"><div style="position:absolute; width: 25%; zoom: 75%;"><input id="remimi_niming'+rel[i].id+'" type="checkbox"  value="1" class="toggle" /><label style="left:0px; zoom:100%;" for="remimi_niming'+rel[i].id+'" data-on="匿名" data-off="留名" class="toggle1"><span></span></label></div><input style=" width: 56%; margin:0px; margin-left:25%; border: none; border: 1px solid #eee; line-height: 32px; height: 32px; " type="text" class="reliuyan_content'+rel[i].id+'" /><a style=" position:absolute;width: 20%; margin: 1px; right:10px; padding: 8px; background:#ff4646; color:#FFF;" data-id="'+rel[i].id+'" class="button icon-quill liuyanbutton">留言</a></div>';

                whtml+='<div style="width:98%; background:#f9f9f9; margin:1%;" id="reliuyanlan'+rel[i].id+'"></div>';
                whtml+='</div>';
                whtml+='</td></tr></table>';
                whtml+='</li>';
                /*var textl=rel[i].content.length;
                 if(textl>600){
                 textl=600;
                 }
                 var rsize=Math.sqrt(textl)*16;
                 var rsum=getRandom(10)+1;
                 var rsum2=getRandom(5)+1;
                 var rsum3=getRandom(10)+1;
                 var zindex=-rsum;
                 if(rsum<2){
                 rsum=2;
                 }
                 //var rsize=100+(50*(rsum/2));
                 var tsize=15*(rsum3-10);
                 //alert(tsize);
                 //tsize=0;
                 var lsize=20*rsum;
                 var scolor=getcolorRandom();
                 whtml+='<div onclick="showmmtext(this,'+rel[i].id+',\''+rel[i].date+'\',\''+rel[i].content+'\','+rel[i].like+');" data-id="'+rel[i].id+'" class="mmtext" style="overflow:hidden;margin-left:'+lsize+'px; margin-top:'+tsize+'px; opacity:0.85; ';
                 *//*if(rsum%2==1){
                 whtml+='float:left;';
                 }else{
                 whtml+='float:right;';
                 }*//*
                 whtml+=' background:url(img/'+scolor+'.png);background-size:100% 100%; border-radius: 50%; height: '+rsize+'px; width:'+rsize+'px; border:0px solid '+scolor+'; overflow: hidden; padding:3%; color:#fff;z-index:'+zindex+'; opacity:0.85;"><span style="font-size: 14px; line-height: 24px;">'+rel[i].content+'</span></div>';
                 if(i==rel.length-1){
                 whtml+='<input type="hidden" id="mimi_lastid" value="'+rel[i].id+'" />';
                 }*/
            }
            if(lastid==0){
                $("#list_mimi").html(whtml);
            }else{
                if(state=='down'){
                    $("#list_mimi").append(whtml);
                }else if(state=='up'){
                    $("#list_mimi").prepend(whtml);
                }
            }
            for(var i=0;i<rel.length;i++){
                setreliuyan(rel[i].id);
            }
        }
    });
}

function setreliuyan(lyid){

    $.jsonP({
        url: vhost + '/api/getjosn.php?a=show_mimi_re&mid='+lyid+'&uid=' + uid + '&token=' + get_token(uid, password) + '&callback=?',
        success: function (data2) {
            var rel2 = data2.result;
            var whtml2="";
            for(var l=0;l<rel2.length;l++){

                whtml2+='<p style="color: #666; line-height: 14px; padding: 5px; margin: 0px;">';

                if(rel2[l].niming=='0'){
                    whtml2+='<a onclick="show_personinfo_mag('+rel2[l].uid+');" data-transition="up" style="color:#d01842;"><b>'+rel2[l].username+'</b></a>&nbsp;&nbsp;';
                }else{
                    whtml2+='<b>'+rel2[l].username+'</b>&nbsp;&nbsp;';
                }

                whtml2+='<span style=" color: #ccc;">'+rel2[l].date+'</span> &nbsp;&nbsp;'+rel2[l].content+' </p>';
            }
            //alert(lyid);
            $("#reliuyanlan"+lyid).append(whtml2);
        }
    });
}

function open_content(e){
    $(e).parent("td").find("p").show();
    $(e).hide();
    $(e).parent("td").find(".content").hide();
    $(e).parent("td").find(".contents").show();
}
function close_content(e){
    $(e).parent("td").find("p").show();
    $(e).hide();
    $(e).parent("td").find(".contents").hide();
    $(e).parent("td").find(".content").show();
}

function mimi_ht_select(id,e){
    $('#mimi_ht').val(id);
    $(".mimi_ht_select").css("font-size","12px");
    $(e).css("font-size","14px");
    getmimi(0,10,'down');
}

function clicklike(id){
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=clicklike&uid='+uid+'&id='+id+'&token='+get_token(uid,password)+'&callback=?',
        success: function(data) {
            var rel=data.result;
            var count = rel[0].count;
            if(count>0){
                $.ui.popup({
                    title: '投票',
                    message: '投票成功。',
                    cancelText: "确定",
                    cancelCallback: function () {
                        $("#likecount"+id).text(count);
                    },
                    doneText: "确定",
                    doneCallback: function () {
                        console.log("Done for!");
                    },
                    cancelOnly: true
                });
            }
        }
    });
}

function clickunlike(id){
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=clickunlike&uid='+uid+'&id='+id+'&token='+get_token(uid,password)+'&callback=?',
        success: function(data) {
            var rel=data.result;
            var count = rel[0].count;
            if(count>0){
                $.ui.popup({
                    title: '投票',
                    message: '投票成功。',
                    cancelText: "确定",
                    cancelCallback: function () {
                        $("#unlikecount"+id).text(count);
                    },
                    doneText: "确定",
                    doneCallback: function () {
                        console.log("Done for!");
                    },
                    cancelOnly: true
                });
            }
        }
    });
}

function showmmtext(e,id,date,content,like){
    $(e).css({"z-index":"100","border-radius":"100"});
    var width=$(e).width();
    var height=$(e).height();
    var marginLeft=parseInt($(e).css("marginLeft"));
    var marginTop=parseInt($(e).css("marginTop"));
    $(e).css3Animate({
        opacity: 0,
        time: "100ms",
        callback: function () {
            var lastid=$("#mimi_lastid").val();
            $("#mimi_lastid").remove();
            if(typeof(lastid)!="undefined"){
                getmimi(lastid,1);
            }
            setTimeout(function(){
                $(e).remove();
            },500);
        }
    });
    $(e).css3Animate({
        x:(width/2)+"px",
        y:(height/2)+"px",
        width:"0",
        height:"0",
        time: "500ms",
        callback: function () {
            showPopup3(id,date,content,like);
        }
    });

}

function showPopup3(id,date,content,like) {
    $.afui.popup({
        title: "<h5 style='color: #d01842;'>"+date+"</h5>",
        message: "<div style='color:#333; line-height: 20px; max-height: 300px; overflow:auto; text-align: left;' >"+content+"</div>",
        cancelText: "关闭",
        cancelCallback: function () {},
        doneText: "赞<span style='margin: 0px; color: #d01842; font-weight: 500;'> ("+like+")</span>",
        doneCallback: function () {
            $.jsonP({
                url: vhost+'/api/getjosn.php?a=likely&uid='+uid+'&mid='+id+'&token='+get_token(uid,password)+'&callback=?',
                success: function(data) {
                }
            });
        },
        cancelOnly: false
    });
}

$(document).on('click','.liuyanbutton',function(){
    var id=$(this).data("id");
    var kind=11;
    var content=$(".reliuyan_content"+id).val();
    var niming=0;
    if($('#remimi_niming'+id).is(':checked')){
        niming=1;
    }
    if(content!=""){
        $.jsonP({
            url: vhost+'/api/getjosn.php?a=ml_liuyan&uid='+uid+'&kind='+kind+'&mid='+id+'&niming='+niming+'&content='+encodeURIComponent(content)+'&token='+get_token(uid,password)+'&callback=?',
            success: function(data) {
                var rel=data.result;
                var message = rel[0].message;
                if(message=="1"){
                    $.ui.popup({
                        title: '留言',
                        message: '留言成功。',
                        cancelText: "确定",
                        cancelCallback: function () {
                            //$.ui.goBack();
                            $("#ml_reliuyan"+id).show();
                            $(".reliuyan_content"+id).val("");
                            $("#reliuyaninput"+id).hide();
                            $("#reliuyan"+id).append('<p style="color: #666;padding: 5px;"><span style=" color: #ccc;">'+rel[0].date+'</span> &nbsp;&nbsp;'+content+' </p>');
                        },
                        doneText: "确定",
                        doneCallback: function () {
                            console.log("Done for!");
                        },
                        cancelOnly: true
                    });
                }else if(message=="0"){
                    showPopup1('留言','提交失败。');
                }
            }
        });
    }
    //alert(content);

});
function getRandom(n){
    return Math.floor(Math.random()*n+1)
}

function getcolorRandom(){
    var rsum= Math.floor(Math.random()*6+1);
    if(rsum==0){
        return "p1";
    }else if(rsum==1){
        return "p2";
    }else if(rsum==2){
        return "p3";
    }else if(rsum==3){
        return "p4";
    }else if(rsum==4){
        return "p5";
    }else if(rsum==5){
        return "p6";
    }else if(rsum==6){
        return "p7";
    }
}

function ml_reliuyan(e,id){
    //$(e).toggle();
    $("#reliuyaninput"+id).toggle();
}

function load_show_news_panel(what){
    if(uid==""){
        window.location="main.html#main";
        return false;
    }
    $("#allwaysgoback").show();
    $.ui.toggleHeaderMenu();
    $.ui.toggleNavMenu();
}

function load_setdeal(what){
    $.ui.toggleNavMenu();
}

function show_newsinfo(id,kind){
    showMask("加载中。。。");
    $.jsonP({
        url: vhost + '/api/getjosn.php?a=show_newsinfo_img&id='+id+'&uid=' + uid + '&token=' + get_token(uid, password) + '&callback=?',
        success: function (data) {
            var rel = data.result;
            setTimeout(function(){
                var fa_html = "";
                $(".news_img_area").html(fa_html);
                fa_html += '<div class="swiper-container swiper-container-3" style=" height: 100%;">';
                fa_html += '<div class="swiper-wrapper" id="show_person_img_area" style=" height: 100%;">';
                for(var i=0;i<rel.length;i++){
                    fa_html += '<div class="swiper-slide" style=" overflow:hidden;">';
                    fa_html += '<img class="loadimg" src="pic/throbber.svg" /> <img onload="re_check_this_img_size2(this,\'in\');" data-id="1" style="width:100%; display:none;" src="'+vhost+'/'+rel[i].pic+'" />';
                    fa_html += '</div>';
                }
                fa_html += '</div>';
                fa_html += '<div class="swiper-pagination swiper-pagination-3" style="line-height: 24px; bottom: 0px; position: absolute; z-index: 100; "></div>';
                fa_html += '</div>';
                $(".news_img_area").html(fa_html);
                var ss3_height = $("#content").width() * 0.8;
                $(".swiper-container-3").find(".swiper-wrapper").find(".swiper-slide").height(ss3_height - 20);
                $(".swiper-container-3").find(".swiper-wrapper").height(ss3_height);
                $(".swiper-container-3").find(".showpsum").text(4);

                var swiper3 = new Swiper('.swiper-container-3', {
                    pagination: '.swiper-pagination-3',
                    paginationclass: 'showpsum-3',
                    paginationClickable: true,
                    spaceBetween: 0
                });
                $.ui.loadContent("#show_news", false, false, "up");
                $.ui.hideMask();
            },50);
        }
    });

    $.jsonP({
        url: vhost + '/api/getjosn.php?a=show_newsinfo&id='+id+'&uid=' + uid + '&token=' + get_token(uid, password) + '&callback=?',
        success: function (data) {
            var rel = data.result;
            for(var i=0;i<rel.length;i++){
                $("#m_news_title").text(rel[i].title);
                re = new RegExp('src="/', "g");
                var content = rel[i].content.replace(re, 'src="'+vhost+'/');
                $("#m_news_scontent").text(rel[i].scontent);
                $("#m_news_content").html(content);
                if(rel[i].kind=="2"){
                    $(".s_l_price").show();
                    $("#buy_button").show();
                    $("#m_news_price").html("<b style='color:#FF0000; font-size:14px;'>"+rel[i].price+" </b> 元 ");
                }else{
                    $(".s_l_price").hide();
                    $("#buy_button").hide();
                }
            }
        }
    });
}

function ppdoing(bulletIndex,paginationclass,container){
    $("."+paginationclass).html((bulletIndex+1));
    console.log($(container).find(".swiper-slide").eq(bulletIndex).find("img").data("id"));
    var id=$(container).find(".swiper-slide").eq(bulletIndex).data("id");
    if(container==".swiper-container-2"){
        $.jsonP({
            url: vhost+'/api/getjosn.php?a=short_userinfo&uid='+uid+'&fuid='+id+'&token='+get_token(uid,password)+'&callback=?',
            success: function(data) {
                var rel=data.result;
                for(var i=0;i<rel.length;i++){
                    $("#find_username").text(rel[i].username);
                    $("#find_adr").text(rel[i].adr);
                    $("#find_age").text(rel[i].age);
                    if(rel[i].uheight!="0" && rel[i].uheight!=""){
                        $("#find_uheight").text(rel[i].uheight);
                    }
                    $("#find_likesum").text(rel[i].like);
                    $("#find_check_like").attr("data-uid",rel[i].uid);
                    getfindubqstr(rel[i].ubiaoqian);
                    if(vip==1){
                        $("#find_user_mag").attr("onclick","show_personinfo_mag("+rel[i].uid+");");
                        $("#find_user_mag").attr("data-id",rel[i].uid);
                        $("#find_user_mag").attr("href","#user_mag");
                    }else{

                        $("#find_user_mag").attr("onclick","showPopup1('提示','您不是VIP，无法访问');");
                        $("#find_user_mag").attr("data-id",rel[i].uid);
                        $("#find_user_mag").removeAttr("href");
                    }
                }
            }
        });

    }
}

function load_jyzh_panel(what){
    $.ui.toggleNavMenu();
}

function load_editxiangce(what){
    $.ui.toggleNavMenu();
    updatemagxc();
}

function updatemagxc(){
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=show_userxc&uid='+uid+'&fuid='+uid+'&token='+get_token(uid,password)+'&callback=?',
        success: function(data) {
            var rel=data.result;
            var html="";
            $('#xc_img').html("");
            for(var i=0;i<rel.length;i++){
                html+='<div class="xc_img_area" data-id="'+rel[i].id+'"><img class="loadimg" src="pic/throbber.svg" /><img onload="re_check_this_img_size2(this,\'in\');" style="display:none;" src="'+vhost+'/'+rel[i].photo+'" /></div>';
            }
            $('#xc_img').html(html);
        }
    });
}

function open_jyzh(){
    if(!jyzh_nav_load) return false;
    getfl("jyzh_list","main_nav2_list",1,0,this);
    jyzh_nav_load=false;
    $("#infomid").val(0);
}

function load_zhxx_panel(what){
    if(!zhxx_nav_load) return false;
    getfl("zhxx_list","main_nav3_list",2,0,this);
    zhxx_nav_load=false;
    $("#infomid").val(0);
}

var timeout1;

function load_user_message_panel(what){
    $("#send_message_area").show();
    setTimeout(function(){$.ui.scrollToBottom('user_message');},1);
    console.log("load_user_message_panel");
}

function unload_user_message_panel(what){
    console.log("unload_user_message_panel");
    clearTimeout(timeout1);
    //alert("timeout1");
    if(send_message_area_tools=1){
        send_message_area_tools=0;
        show_smat(1);
    }
}

function load_friendshow(what){
    mainpage=true;
    $.ui.toggleNavMenu();
    if($("#friendshow").attr("data-uid")==uid){
        refresh_userinfo();
    }
}
var retata=true;
function load_tata_panel(what){
    if(uid==""){
        window.location="main.html#main";
        return false;
    }
    if(retata){
        retata=false;
        retime3=Date.parse(new Date());
    }else{
        if(Date.parse(new Date())-retime3>60*5*1000){
            retime3=Date.parse(new Date());
            retata=true;
        }else{
            return false;
        }
    }
    get_tata_list(0);
}
var regotop=true;

function load_gotop_panel(what){
    if(uid==""){
        window.location="main.html#main";
        return false;
    }
    if(regotop){
        regotop=false;
        retime4=Date.parse(new Date());
    }else{
        if(Date.parse(new Date())-retime4>60*5*1000){
            retime4=Date.parse(new Date());
            regotop=true;
        }else{
            return false;
        }
    }
    get_gotop_list(0);
}

function get_gotop_list(id){
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=get_shangbang&kind=1&uid='+uid+'&token='+get_token(uid,password)+'&callback=?',
        success: function(data) {
            var rel=data.result;
            var html="";
            for (var i = 0; i < rel.length; i++) {
                html+='<div data-id="'+rel[i].uid+'" class="old_show">';
                if(i==0){
                    html+='<div class="old_show_img today">';
                    get_gotop_xc(rel[i].uid);
                }else{
                    html+='<div class="old_show_img">';
                }
                html+='<img class="loadimg" src="pic/throbber.svg" /><img onload="re_check_this_img_size2(this,\'out\');" style="display:none;" src="'+vhost+'/'+rel[i].photo+"?id="+Date.parse(new Date())+'" /> </div>';
                if(i==0){
                    html+='<p class="today_p">'+rel[i].date+'</p>';
                }else{
                    html+='<p class="">'+rel[i].date+'</p>';
                }
                html+='</div>';
            }
            $('#gotop_list').html(html);
        }
    });
}

function get_gotop_xc(fuid){
    $("#gotop_xc").html('');
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=show_userxc&uid='+uid+'&fuid='+fuid+'&token='+get_token(uid,password)+'&callback=?',
        success: function(data) {
            var rel=data.result;
            var fa_html='';
            fa_html+='<a onclick="show_personinfo_mag('+fuid+');" data-transition="up">';
            fa_html+='<div class="swiper-container swiper-container-5" style=" height: 100%;">';
            fa_html+='<div class="swiper-wrapper" id="show_person_img_area" style=" height: 100%;">';

            for(var i=0;i<rel.length;i++){
                fa_html+='<div class="swiper-slide" style=" overflow:hidden;">';
                fa_html+=' <img class="loadimg" style="width:16px;" src="pic/throbber.svg" />';
                fa_html+=' <img onload="re_check_this_img_size2(this,\'in\');" data-id="1" style="width:100%; display:none;" src="'+vhost+'/'+rel[i].bphoto+'" />';
                fa_html+='</div>';
            }
            fa_html+='</div>';
            fa_html+='<div class="swiper-pagination swiper-pagination-5" style="line-height: 24px; bottom: 0px; position: absolute; z-index: 100; "></div>';
            fa_html+='</div>';
            fa_html+='</a>';

            $("#gotop_xc").html(fa_html);

            var ss4_height=$("#content").width();
            $(".swiper-container-5").find(".swiper-wrapper").find(".swiper-slide").height(ss4_height-20);
            $("#gotop_xc").height(ss4_height);
            $(".swiper-container-5").find(".swiper-wrapper").height(ss4_height-20);

            var swiper4 = new Swiper('.swiper-container-5', {
                pagination: '.swiper-pagination-5',
                paginationclass: 'showpsum-5',
                paginationClickable: true,
                spaceBetween: 0
            });
        }
    });

    $.jsonP({
        url: vhost+'/api/getjosn.php?a=show_xc_userinfo&uid='+uid+'&fuid='+fuid+'&token='+get_token(uid,password)+'&callback=?',
        success: function(data) {
            var rel=data.result;
            for(var i=0;i<rel.length;i++){
                $("#gotop_username").text(rel[i].uname);
                $("#gotop_age").text(rel[i].age);
                $("#likesum").text(rel[i].like);
                $("#check_like").attr("data-uid",rel[i].uid);
            }
        }
    });
}

function load_huodong_panel(what){
    if(uid==""){
        window.location="main.html#main";
        return false;
    }
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=show_news&kind=1&uid='+uid+'&token='+get_token(uid,password)+'&callback=?',
        success: function(data) {
            var rel=data.result;
            var newhtml="";
            var oldhtml="";
            for (var i = 0; i < rel.length; i++) {
                if(rel[i].old=="0"){
                    newhtml+='<li class="huodong_list" onclick="show_newsinfo('+rel[i].id+','+rel[i].kind+');" data-id="'+rel[i].id+'">';
                    newhtml+='<div class="img_area"><img src="'+vhost+'/'+rel[i].pic+'" /></div>';
                    newhtml+='<div class="text_area">';
                    newhtml+='<h4>'+rel[i].title+'</h4>';
                    newhtml+='<h5>'+rel[i].date+' | '+rel[i].scontent+'</h5>';
                    newhtml+='</div>';
                    newhtml+='</li>';
                }
                if(rel[i].old=="1"){
                    oldhtml+='<li class="huodong_list"><a href="#show_news" onclick="show_newsinfo('+rel[i].id+','+rel[i].kind+');" data-id="'+rel[i].id+'">';
                    oldhtml+='<div class="img_area"><img src="'+vhost+'/'+rel[i].pic+'" /></div>';
                    oldhtml+='<div class="text_area">';
                    oldhtml+='<h4>'+rel[i].title+'</h4>';
                    oldhtml+='<h5>'+rel[i].date+' | '+rel[i].scontent+'</h5>';
                    oldhtml+='</div>';
                    oldhtml+='</a></li>';
                }
            }
            $('#new_huodong').html(newhtml);
            $('#old_huodong').html(oldhtml);
        }
    });
}

function load_liwu_panel(what){
    if(uid==""){
        window.location="main.html#main";
        return false;
    }
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=show_news&kind=2&uid='+uid+'&token='+get_token(uid,password)+'&callback=?',
        success: function(data) {
            var rel=data.result;
            var newhtml="";
            for (var i = 0; i < rel.length; i++) {

                newhtml+='<li class="huodong_list"><a href="#show_news" onclick="show_newsinfo('+rel[i].id+','+rel[i].kind+');" data-id="'+rel[i].id+'">';
                newhtml+='<div class="img_area"><img src="'+vhost+'/'+rel[i].pic+'" /></div>';
                newhtml+='<div class="text_area">';
                newhtml+='<h4>'+rel[i].title+'</h4>';
                newhtml+='<h5>'+rel[i].date+' | '+rel[i].scontent+'</h5>';
                newhtml+='</div>';
                newhtml+='</a></li>';

            }
            $('#list_liwu').html(newhtml);
        }
    });
}

function get_tata_list(page){
    //$("html").html(vhost+'/api/getjosn.php?a=show_tata&uid='+uid+'&token='+get_token(uid,password)+'&page='+page+'&callback=?');
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=show_tata&uid='+uid+'&token='+get_token(uid,password)+'&page='+page+'&callback=?',
        success: function(data) {
            var rel=data.result;
            var html="";
            var spheight=($('#content').width()-10)/4-4;
            for (var i = 0; i < rel.length; i++) {
                var pic='pic/small.png'
                if(rel[i].pic!="0"){
                    pic=vhost+'/'+rel[i].pic+"?id="+Date.parse(new Date());
                }
                html+='<span data-id="'+rel[i].uid+'"><a onclick="show_personinfo_mag('+rel[i].uid+');" data-transition="up"><div style="height: '+spheight+'px; width: '+spheight+'px;"><img class="loadimg" src="pic/throbber.svg" /><img onload="re_check_this_img_size2(this,\'out\');" style="display:none;" class="show_person_img" src="'+pic+'" /></div></a></span>';
            }
            $('#tata_list').html(html);
        }
    });
}

function load_html_content_panel(what){
    $.ui.toggleNavMenu();
}

function unload_html_content_panel(what){
    $("#html_content_list").html("");
    $("#html_content_h1").html("");
    modalshow=false;
}

function load_contactperson(what){
    mainpage=true;
    update_friend_list(uid);

    show_friend_list(10);

    db.transaction(function(tx){
        tx.executeSql("select count(*) as count from friend_list where uid=? and level=? and pass=? ",[uid,90,1],function(tx,resultSet){
            var rows = resultSet.rows;
            len=rows.length;
            for(var i=0;i<len;i++){
                $("#huanzhesum").text(" ( "+rows.item(i).count+" )");
            }
        },function(tx,err){console.log(err);});},function(errormsg){console.log(errormsg);});

    db.transaction(function(tx){
        tx.executeSql("select count(*) as count from friend_list where uid=? and level=? and pass=? ",[uid,20,1],function(tx,resultSet){
            var rows = resultSet.rows;
            len=rows.length;
            for(var i=0;i<len;i++){
                $("#yishengsum").text(" ( "+rows.item(i).count+" )");
            }
        },function(tx,err){console.log(err);});},function(errormsg){console.log(errormsg);});
}

function load_search_users(what){
    $.ui.toggleNavMenu();
}

function load_add_user(what){
    $.ui.toggleNavMenu();
}

function load_update_user_info(what){
    if(uid==""){
        window.location="main.html#main";
        return false;
    }
    $.ui.toggleNavMenu();
}
function load_user_mage(what){
    if(uid==""){
        window.location="main.html#main";
        return false;
    }
    $("#allwaysgoback").show();
    $.ui.toggleNavMenu();
    $.ui.toggleHeaderMenu();
}
function unload_user_mage(what){
    $("#allwaysgoback").hide();
}
function load_select_area_panel(what){
    if(uid==""){
        window.location="main.html#main";
        return false;
    }
    $.ui.toggleNavMenu();
}

function load_become_vip_panel(what){
    //if(uid==""){
    //window.location="main.html#main";
    //return false;
    //}
    $.ui.toggleNavMenu();
}

function load_gototop_panel(what){
    if(uid==""){
        window.location="main.html#main";
        return false;
    }
    $.ui.toggleNavMenu();
}
function load_show_img_panel(what){
    console.log("load_show_img_panel");
    $.ui.toggleNavMenu();
//    $.ui.toggleHeaderMenu();
    var aheight=$("#show_img_panel").height();
    $("#show_img_area").css("height",aheight+"px");
}

function load_sp_img_panel(what){
    console.log("load_show_img_panel .show_area");
    $("#header").css("background","#000");
    $.ui.toggleNavMenu();
//    $.ui.toggleHeaderMenu();
}
function unload_sp_img_panel(what){
    console.log("unload_sp_img_panel");
    $("#header").css("background","#FF6700");
    $("#show_sp_img_panel .show_area").html("");
}

function load_show_user_area(what){
    $.ui.toggleNavMenu();
}

function open_update_user_info(e,key){
    if(typeof($(e).attr("href"))!="undefined"){
        $(".update_form").hide();
        $("#update_"+key).show();
        $("#update_"+key+"2").show();
        var simi=1;
        $.jsonP({
            url: vhost+'/api/getjosn.php?a=userinfo&fuid='+uid+'&simi='+simi+'&uid='+uid+'&token='+get_token(uid,password)+'&callback=?',
            success: function(data) {
                var rel=data.result;
                for (var i = 0; i < rel.length; i++) {
                    $("#update_username").val(rel[i].username);
                    $("#update_ubrithday").val(rel[i].brithday);
                    $("#update_ubeizhu").text(rel[i].content);
                    $("#update_utel").val(rel[i].tel);
                    $("#update_user_photo").html("<img src='"+vhost+"/userimg/"+uid+"/small.jpg' />");

                    if(rel[i].sex=="1"){
                        $("#sex1").attr("checked","checked");
                        $("#sex0").removeAttr("checked");
                        $('.bsex1').show();
                        $('.bsex0').hide();
                    }else if(rel[i].sex=="0"){
                        $("#sex1").removeAttr("checked");
                        $("#sex0").attr("checked","checked");
                        $('.bsex1').hide();
                        $('.bsex0').show();
                    }else if(rel[i].sex=="2"){
                        $('.bsex1').hide();
                        $('.bsex0').hide();
                    }

                    $("#update_user_info_button").attr("data-type",key);

                    //$('body').html(vhost+'/api/getjosn.php?a=province&callback=?');
                    $.jsonP({
                        url: vhost+'/api/getjosn.php?a=province&callback=?',
                        success: function(data) {
                            var rel=data.result;
                            for (var i = 0; i < rel.length; i++) {
                                var str = rel[i].str;
                                var strary=str.split(",");
                                str="";
                                for(var l=0;l<strary.length-1;l++){
                                    str+="<option "+strary[l]+"</option>";
                                }
                                $('#adr0').append(str);
                            }
                        }
                    });
                }
            }
        });
    }
}

function del_friend(){
    var fuid=$("#showpersoninfo").attr("data-fuid");
//	$("html").append(vhost+'/api/getjosn.php?a=del_friend&uid='+uid+'&fuid='+fuid+'&token='+get_token(uid,password)+'&callback=?');
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=del_friend&uid='+uid+'&fuid='+fuid+'&token='+get_token(uid,password)+'&callback=?',
        success: function(data) {
            var rel=data.result;
            var message = rel[0].message;
            if(message==1){
                db.transaction(function(tx){
                    tx.executeSql("DELETE FROM friend_list WHERE uid=? and fuid=?;",[uid,fuid],function(){
                        $.ui.loadContent("#contactperson", false, false, "none");
                    },function(tx,err){console.log(err);});},function(errormsg){console.log(errormsg);});
            }
        }
    });
}

function mag_personinfo(){
    $("#afui").actionsheet('<a onclick="del_friend_alert();">解除好友关系</a>');
}

function del_friend_alert(){
    $.ui.popup({
        title: "",
        message: "确定解除关系?",
        cancelText: "取消",
        cancelCallback: function () {
            console.log("cancelled");
        },
        doneText: "确定",
        doneCallback: function () {
            console.log("Done for!");
            del_friend();
        },
        cancelOnly: false
    });
}

function upload_user_photo(){
    $("#afui").actionsheet('<a onclick="user_loadImageUpload(this);">拍照</a><a onclick="user_loadImageLocal(this);">相册</a>');
}

function upload_bl_photo(kind,ed){
    $("#afui").actionsheet('<a onclick="bl_loadImageUpload(this,'+kind+',\''+ed+'\');">拍照</a><a onclick="bl_loadImageLocal(this,'+kind+',\''+ed+'\');">从相册中选取</a>');
}

function upload_bl_1_photo(){
    $("#afui").actionsheet('<a onclick="bl_1_loadImageUpload(this);">拍照</a><a onclick="bl_1_loadImageLocal(this);">从相册中选取</a>');
}
function update_user_info(e){
    var key=$(e).attr("data-type");
    var value="";
    if(key=="usex"){
        value=$('input[name="sex"]:checked').val();
        update_user_table(key , value);
        update_user_table("ubiaoqian" , "");
    }else if(key=="adr"){
        value=$('#adr0').val()+","+$('#adr1').val();
        update_user_table(key , value);
    }else if(key=="upassword"){
        if($('#update_upassword').val()==$('#update_upassword2').val()){
            value=$('#update_upassword').val();
            if(value.length>5){
//				alert($.md5($.md5(value+yan)));
                update_user_table(key , $.md5($.md5(value+yan)) );
            }
            else{
                showPopup1("验证消息","密码长度要大于6个字符");
                return false;
            }
        }else{
            showPopup1("验证消息","密码前后不一致");
            return false;
        }
    }else if(key=="username"){
        value=$("#update_"+key).val();
        if(value.length>2 && value.length<18){

            update_user_table(key , value);

        }else{
            showPopup1("验证消息","格式错误");
            return false;
        }
    }else if(key=="content"){
        value=$("#update_"+key).val();
        if(value.length>120){
            showPopup1("验证消息","请控制在120个字符以内");
            return false;
        }
    }else if(key=="ubiaoqian"){
        value='';
        $("input[name='bq_id']").each(function(index,item){
            value+=$(this).val();
            if(index<$("input[name='bq_id']").length-1){
                value+=',';
            }
        })
        update_user_table(key , value);
    }else{
        value=$("#update_"+key).val();
        update_user_table(key , value);
    }

}

function update_user_table(key , value){
    var timestamp = Date.parse(new Date());
    $("html").append(vhost+'/api/getjosn.php?a=update_user&key='+encodeURIComponent(key)+'&value='+encodeURIComponent(value)+'&name='+encodeURIComponent(name)+'&uid='+uid+'&password='+password+'&token='+get_token(uid,password)+'&callback=?');
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=update_user&key='+encodeURIComponent(key)+'&value='+encodeURIComponent(value)+'&name='+encodeURIComponent(name)+'&uid='+uid+'&password='+password+'&token='+get_token(uid,password)+'&callback=?',
        success: function(data) {
            var rel=data.result;
            if(rel[0].message=="1"){

            }
            showPopup1("验证消息","修改成功");
//		    alert(vhost+'/userimg/'+uid+'/small.jpg?id='+timestamp);
            $('.userphoto').attr("src",vhost+'/userimg/'+uid+'/small.jpg?id='+timestamp);

        }
    });
}

function load_contact_panel(what){
    mainpage=true;
    $.ui.toggleNavMenu();
    //show_message_panel(uid);
}

//以下就是数据处理

function load_sp_photo_panel(what){
    $.ui.toggleNavMenu();
}
function load_sp_wulishuxing_panel(what){
    $.ui.toggleNavMenu();
}
function load_sp_jingjishuxing_panel(what){
    $.ui.toggleNavMenu();
}
function load_sp_jingyingshuxing_panel(what){
    $.ui.toggleNavMenu();
}

function load_shangpu_beizhu_panel(what){
    $.ui.toggleNavMenu();
}

function load_user_mag(what){
    $.ui.toggleNavMenu();
}
function load_data_mag(what){
    $.ui.toggleNavMenu();
}
function showpersoninfo(what){
    $.ui.toggleNavMenu();
}
function load_show_user_bl(what){
    $.ui.toggleNavMenu();
}
function unload_show_user_bl(what){
}

function contactpersonyisheng_list(what){
    $.ui.toggleNavMenu();
}
function contactpersonhuanzhe_list(what){
    $.ui.toggleNavMenu();
}
function load_show_bl_img(what){
    $.ui.toggleNavMenu();
}

function set_shangpu_search_key(key1,key2,key3,key4,key5,key6){
    $("#searchkey_xzq").val(key1);
    if(key1=="")
        key1=0;
    $(".search_xzq").css("background","none");
    $("#xzq"+key1).css("background","#666666");

    if(key1!="0"){
        $("#fxzq_search_area").show();
        var str="";
        $.jsonP({
            url: vhost+'/api/getjosn.php?a=get_area&prov_id='+key1+'&callback=?',
            success: function(data) {
                var rel=data.result;
                for (var i = 0; i < rel.length; i++) {
                    str+='<li><a class="select_area_searchkey_fxzq" value="'+rel[i].id+'">'+rel[i].name+'</a></li>';
                }
                $('#select_searchkey_fxzq_area').html(str);
            }
        });
    }else{
        $("#fxzq_search_area").hide();
        $('#select_searchkey_fxzq_area').html("");
    }
    $("#searchkey_fxzq_text").val("选择区域/商圈");
    $("#searchkey_fxzq").val("");
    getfl("jyzh_list","main_nav2_list",1,0,this);
}


$(document).on('change','#searchkey_fxzq',function(){
    var values=$("#searchkey_fxzq option:selected").val();
    getfl("jyzh_list","main_nav2_list",1,0,this);
});

$(document).on('change','#searchkey_mj',function(){
    getfl("jyzh_list","main_nav2_list",1,0,this);
});

$(document).on('change','#searchkey_zj',function(){
    getfl("jyzh_list","main_nav2_list",1,0,this);
});
$(document).on('input','#searchkey_tel',function(){
    getfl("jyzh_list","main_nav2_list",1,0,this);
});
$(document).on('click','#searchkey_mine',function(){
    getfl("jyzh_list","main_nav2_list",1,0,this);
});
$(document).on('click','#searchkey_sh',function(){
    getfl("jyzh_list","main_nav2_list",1,0,this);
});

$(document).on("click","#check_like",function(){
    check_like(this,0);
});

$(document).on("click","#find_check_like",function(){
    check_like(this,1);
});

$(document).on("click","#qiandao",function(){
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=click_qiandao&uid='+uid+'&token='+get_token(uid,password)+'&callback=?',
        success: function(data) {
            var rel=data.result;
            if(rel[0].message=='1'){
                for(var i=0;i<rel.length;i++){
                    var qiandaosum=rel[i].qiandao;
                    var midou=rel[i].midou;
                    $("#showqiandaosum").text(qiandaosum+"/30");
                    $("#qiandaolan").css("width",qiandaosum/0.3+"%");

                    //showPopup1('签到','<b style="color: red;">蜜豆＋'+midou+'</b>');
                    $(this).css("color","#999");
                    $("#show_add_midou").css3Animate({
                        y: "-50px",
                        time: "2000ms",
                        opacity: 1,
                        callback: function () {
                            $("#show_add_midou").css3Animate({
                                //x: "20%",
                                y: "0px",
                                time: "0ms",
                                opacity:0,
                                callback: function () {
                                }
                            });
                        }
                    });
                }
            }else{
                showPopup1('签到','今天已经签过到了！');
            }

        }
    });
});

function check_like(e,kind){
    var fuid=$(e).attr("data-uid");
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=check_like&uid='+uid+'&fuid='+fuid+'&token='+get_token(uid,password)+'&callback=?',
        success: function(data) {
            var rel=data.result;
            for(var i=0;i<rel.length;i++){
                if(rel[i].message=='1'){
                    if(kind==0)
                        $("#likesum").text(rel[i].like);
                    if(kind==1)
                        $("#find_likesum").text(rel[i].like);
                    showPopup1('喜欢','谢谢你喜欢我！');
                }else if(rel[i].message=='2'){
                    showPopup1('喜欢','亲！你不能喜欢自己哦！');
                    //alert("今天已经喜欢过此人了。明天继续，亲");
                }else{
                    alert("喜欢对速度太快了。等等看，亲");
                }
            }
        }
    });
}


function getfl(upload_divid,divid,kind,id,e){

    var list="";

    var upload_fl_list="";
    var xzq=$("#searchkey_xzq").val();
    var fxzq=$("#searchkey_fxzq").val();
    var zj=$("#searchkey_zj").val();
    var mj=$("#searchkey_mj").val();
    var date=$("#searchkey_date").val();
    var tel=$("#searchkey_tel").val();
    var mine=0;
    if($("input[name='mine']:checked").val()){
        mine=1;
    }
    var sh=0;
    if($("input[name='sh']:checked").val()){
        sh=1;
    }
    var vurl=vhost+'/api/getjosn.php?a=shangpuinfo&uid='+uid+'&level='+level+'&xzq='+xzq+'&fxzq='+fxzq+'&zj='+zj+'&mj='+mj+'&tel='+encodeURIComponent(tel)+'&mine='+mine+'&sh='+sh+'&date='+date+'&searchkey=&myself=&callback=?';
//	$("html").append(vurl);
    $.jsonP({
        url: vurl,
        success: function(data) {
            var rel=data.result;
            $("#datacount").hide();
            for (var i = 0; i < rel.length; i++) {
                var d=new Date((rel[i].addtime*1000));

                upload_fl_list+='<li id="shangpulist'+rel[i].id+'" data-id="'+rel[i].id+'"><a data-id="'+rel[i].id+'" onclick="open_info(\''+rel[i].id+'\');"><div>';
                if(rel[i].pass=="0"){
                    upload_fl_list+='<b class="sp_nopass" style="color:red;">未审核|</b>';
                }
                upload_fl_list+=rel[i].xzq+"·"+rel[i].xjyhy+'</div><p>';
                upload_fl_list+='No.120'+rel[i].id;
                if(rel[i].zj!="0"){
                    upload_fl_list+=' | 租金: <b>'+rel[i].zj+'</b>';
                }
                if(rel[i].mj!="0"){
                    upload_fl_list+=' | 面积: <b>'+rel[i].mj+'</b>';
                }
                upload_fl_list+=' | '+formatDate3(d)+'</p></a></li>';
                if(i==0){
                    $("#datacount").show();
                    $("#datacount span").text(rel[i].count);
                }
            }
            $("#"+upload_divid).html(upload_fl_list);
        }
    });

}

function update_datainfo(type,id){
//    var type=$(e).data("type");
//	var id=$(e).data("id");
//	alert(type+"__"+id);

    var value;
    var imgnamestr_1="";
    var imgnamestr_2="";
    var imgnamestr_3="";

    switch (type)
    {

        case "xzq":

            var xzq="0";
            if($("#e_xzq").val()){
                xzq=$("#e_xzq").val();
            }
            var fxzq="0";
            if($("#e_fxzq").val()){
                fxzq=$("#e_fxzq").val();
            }

            value=xzq+","+fxzq;

            break;
        case "sq":

            value="";
            if($("#e_sq").val()){
                value=$("#e_sq").val();
            }
            $("e_sq").val("");

            break;
        case "xxdz":
            value="";
            if($("#e_xxdz").val()){
                value=$("#e_xxdz").val();
            }
            $("#e_xxdz").val("");
            break;
        case "lx":

            value="0";
            if($('input[name="e_lx"]:checked ').val()){
                value=$('input[name="e_lx"]:checked ').val();
            }

            break;
        case "zj":

            value="0";
            if($('#e_zj').val()){
                value=$('#e_zj').val();
                if($.trim(value)==""){ value="0"; }
            }
            $('#e_zj').val("");
            break;
        case "mj":

            value="0";
            if($('#e_mj').val()){
                value=$('#e_mj').val();
                if($.trim(value)==""){ value="0"; }
            }
            $('#e_mj').val("");

            break;
        case "czf":

            value="0";
            if($('input[name="e_czf"]:checked ').val()){
                value=$('input[name="e_czf"]:checked ').val();
            }

            break;
        case "lxr":

            value="";
            if($("#e_lxr").val()){
                value=$("#e_lxr").val();
            }
            $("#e_lxr").val("");

            break;
        case "tel1":

            value="";
            if($("#e_tel1").val()){
                value=$("#e_tel1").val();
            }
            $("#e_tel1").val("");

            break;
        case "tel2":

            value="";
            if($("#e_tel2").val()){
                value=$("#e_tel2").val();
            }
            $("#e_tel2").val("");

            break;
        case "ly":

            value="0";
            if($('input[name="e_ly"]:checked ').val()){
                value=$('input[name="e_ly"]:checked ').val();
            }

            break;
        case "jg":

            value=$('input[name="e_jg"]:checked').map(function(index,elem) {
                return $(elem).val();
            }).get().join(',');
            $('input[name="e_jg"]:checked').removeAttr("checked");

            break;
        case "mtkd":

            value="0";
            if($('#e_mtkd').val()){
                value=$('#e_mtkd').val();
                if($.trim(value)==""){ value="0"; }
            }
            $('#e_mtkd').val("");

            break;
        case "mqlk":

            value="0";
            if($('input[name="e_mqlk"]:checked ').val()){
                value=$('input[name="e_mqlk"]:checked ').val();
            }

            break;
        case "nzj":

            value="0";
            if($('#e_nzj').val()){
                value=$('#e_nzj').val();
                if($.trim(value)==""){ value="0"; }
            }
            $('#e_nzj').val("");

            break;
        case "dpmrzj":

            value="0";
            if($('#e_dpmrzj').val()){
                value=$('#e_dpmrzj').val();
                if($.trim(value)==""){ value="0"; }
            }
            $('#e_dpmrzj').val("");

            break;
        case "zq":

            value="0";
            if($("#e_zq").val()){
                value=$("#e_zq").val();
                if($.trim(value)==""){ value="0"; }
            }
            $("#e_zq").val("");

            break;
        case "zrf":

            value="0";
            if($("#e_zrf").val()){
                value=$("#e_zrf").val();
                if($.trim(value)==""){ value="0"; }
            }
            $("#e_zrf").val("");

            break;
        case "fkfs":

            value="";
            if($("input[name='e_fkfs']:checked").val()){
                value = $("input[name='e_fkfs']:checked").map(function(index,elem) {
                    return $(elem).val();
                }).get().join(',');
            }
            $("input[name='e_fkfs']:checked").removeAttr("checked");

            break;
        case "yj":

            value="0";
            if($('input[name="e_yj"]:checked ').val()){
                value=$('input[name="e_yj"]:checked ').val();
            }

            break;
        case "sxs":

            value="0";
            if($('input[name="e_sxs"]:checked ').val()){
                value=$('input[name="e_sxs"]:checked ').val();
            }

            break;
        case "kfcy":

            value="0";
            if($('input[name="e_kfcy"]:checked ').val()){

                value=$('input[name="e_kfcy"]:checked ').val();
            }

            break;
        case "dianming":

            value="";
            if($('#e_dianming').val()){
                value=$('#e_dianming').val();
            }
            $('#e_dianming').val("");

            break;
        case "xz":

            value="0";
            if($('input[name="e_xz"]:checked ').val()){
                value=$('input[name="e_xz"]:checked ').val();
            }

            break;
        case "zxcd":

            value="0";
            if($('input[name="e_zxcd"]:checked ').val()){
                value=$('input[name="e_zxcd"]:checked ').val();
            }

            break;
        case "td":

            value="";
            if($("input[name='e_td']:checked").val()){
                value=$("input[name='e_td']:checked").map(function(index,elem) {
                    return $(elem).val();
                }).get().join(',');
            }
            $("input[name='e_td']:checked").removeAttr("checked");

            break;
        case "imgnamearea":
            var imgnamestr_1="";
            var imgnamestr_2="";
            var imgnamestr_3="";
            if($('#e_imgnamestr_1').val()){
                imgnamestr_1=$('#e_imgnamestr_1').val();
                imgnamestr_2=$('#e_imgnamestr_2').val();
                imgnamestr_3=$('#e_imgnamestr_3').val();
            }

            break;
        case "xjyhy":

            value="0,0";
            if($("#e_xjyhy").val())
            {
                value=$("#e_xjyhy").val()+","+$("#e_fxjyhy").val();;
            }

            break;
        case "tjjyhy":

            value="0,0";
            if($("#e_tjjyhy").val()){
                value=$("#e_tjjyhy").val()+","+$("#e_ftjjyhy").val();
            }

            break;
        case "beizhu":

            value="";
            if($("#e_beizhu").val()){
                value=$("#e_beizhu").val();
            }

            break;
    }

    if(type!="imgnamearea"){
//	    alert(type+" : "+value);
        $.jsonP({
            url: vhost+"/api/getjosn.php?a=update_shangpuinfo&uid="+uid+"&id="+id+"&type="+encodeURIComponent(type)+"&value="+encodeURIComponent(value)+"&token="+get_token(uid,password)+"&callback=?",
            success: function(data) {
                var rel=data.result;
                var insertid=0;
                for (var i = 0; i < rel.length; i++) {
                    insertid=rel[i].id;
                }
                if(insertid>0){
                    showPopup1("修改成功","");
                    //refresh_datainfo();
                }
                else{
                    showPopup1("修改失败","");
                }
            }
        });

    }else{
        //$("html").append(vhost+"/api/getjosn.php?a=update_shangpuinfo_photo&uid="+uid+"&id="+id+"&imgnamestr_1="+encodeURIComponent(imgnamestr_1)+"&imgnamestr_2="+encodeURIComponent(imgnamestr_2)+"&imgnamestr_3="+encodeURIComponent(imgnamestr_3)+"&token="+get_token(uid,password)+"&callback=?");
        $.jsonP({
            url: vhost+"/api/getjosn.php?a=update_shangpuinfo_photo&uid="+uid+"&id="+id+"&imgnamestr_1="+encodeURIComponent(imgnamestr_1)+"&imgnamestr_2="+encodeURIComponent(imgnamestr_2)+"&imgnamestr_3="+encodeURIComponent(imgnamestr_3)+"&token="+get_token(uid,password)+"&callback=?",
            success: function(data) {
                var rel=data.result;
                var insertid=0;
                for (var i = 0; i < rel.length; i++) {
                    insertid=rel[i].id;
                }
                if(insertid>0){
                    showPopup1("修改成功","");
                }
                else{
                    showPopup1("修改失败","");
                }
            }
        });

    }

}

function open_update_data_info(e,id){
    var xm=$(e).data("xm");
    //	$("#update_datainfo_button").attr("data-type",xm);
    //	$("#update_datainfo_button").attr("data-id",id);
    $("#update_datainfo_button").attr("onclick","update_datainfo('"+xm+"',"+id+");");
    $("#data_mag .i_d").css("display","none");
    $("#data_mag #edit_"+xm).css("display","table");
    $("#data_mag #edit_"+xm+" .i_d").css("display","table");
    $("#data_mag_header #backButton").attr("onclick","open_info("+id+");");
    $("select").removeAttr("disabled");

}

function edit_datainfo(){
    var id=$("#html_content").attr("data-id");
    $(".setting_list2 .update_d").attr('href','#data_mag');
    $(".setting_list2 .update_d").attr("onclick","open_update_data_info(this,"+id+")");
    $(".d_doing").show();
    $("#edit_datainfo").hide();
}


function close_html_content(){
//    $.ui.hideModal();
}

function pass_this_shangpuinfo(e){
    var id=$(e).attr("data-id");
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=pass_this_shangpuinfo&uid='+uid+'&id='+id+'&level='+level+'&password='+password+'&token='+get_token(uid,password)+'&callback=?',
        success: function(data) {
            var rel=data.result;
            for (var i = 0; i < rel.length; i++) {
                var message = rel[i].message;
                //alert(message);
                if(message=="1"){
                    $(e).hide();
                    $("#shangpulist"+id).find(".sp_nopass").remove();
                }
                else if(message=="0"){

                }
            }
        }
    });
}

function del_this_shangpuinfo_do(e){
    var id=$(e).attr("data-id");
    $.jsonP({
        url: vhost + '/api/getjosn.php?a=del_this_shangpuinfo&uid=' + uid + '&id=' + id + '&level=' + level + '&password=' + password + '&token=' + get_token(uid, password) + '&callback=?',
        success: function (data) {
            var rel = data.result;
            for (var i = 0; i < rel.length; i++) {
                var message = rel[i].message;
                //alert(message);
                if (message == "1") {
                    $("#shangpulist" + id).remove();
                    $(e).hide();
                    $.ui.goBack();
                }
                else if (message == "0") {

                }
            }
        }
    });
}

function unloadedPanel(what) {
    mainpage=false;
    console.log("unloaded " + what.id);
}
function unload_show_news_panel(what){
    $("#allwaysgoback").hide();
}

if (!((window.DocumentTouch && document instanceof DocumentTouch) || 'ontouchstart' in window)) {
    var script = document.createElement("script");
    script.src = "plugins/af.desktopBrowsers.js";
    var tag = $("head").append(script);
    //$.os.desktop=true;
}


function refresh_userinfo(){//刷新用户信息，如没有网络连接，则读取内部数据库
    var timestamp = Date.parse(new Date());
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=check_login&name='+encodeURIComponent(name)+'&password='+password+'&callback=?',
        success: function(data) {
            var rel=data.result;
            for (var i = 0; i < rel.length; i++) {
                username=rel[i].username;
                content=rel[i].content;
                sex=rel[i].sex;
                level=rel[i].level;
                tel=rel[i].tel;
                pic=rel[i].pic;
                var qiandao=rel[i].qiandao;
                var vipdate=parseInt(rel[i].vipdate)*1000;
                if(vipdate>timestamp){
                    vip=1;
                    $("#vipdate_info").html(rel[i].fvipdate+"<br /> DATA");
                    $("#vipinfo2").find("span").html("&nbsp;&nbsp;您的VIP到期时间:"+rel[i].fvipdate);
                    $("#vipinfo").show();
                    $("#bvipinfo").hide();
                    $("#vipinfo2").show();
                    //$("#become_vip_button").hide();
                }else{
                    vip=0;
                    $("#vipdate_info").html("");
                    $("#vipinfo").hide();
                    $("#bvipinfo").show();
                    $("#vipinfo2").hide();
                    $("#become_vip_button").show();
                }
                $("#showqiandaosum").text(qiandao+"/30");
                $("#qiandaolan").css("width",qiandao/0.3+"%");

                $.jsonP({
                    url: vhost+'/api/getjosn.php?a=check_qiandao&uid='+uid+'&token='+get_token(uid,password)+'&callback=?',
                    success: function(data) {
                        var rel=data.result;
                        if(rel[0].message=='1'){
                            $("#qiandao").css("color","#e51b49");
                        }else{
                            $("#qiandao").css("color","#999");
                        }
                    }
                });
                var qdtime=rel[i].qdtime;
                db.transaction(function(tx){
                    tx.executeSql("update tUser_info set username=?,content=?,sex=?,level=?,tel=?,pic=? where uid=?;",[username,content,sex,level,tel,pic,uid],function(){
                        $("#userinfo").html("<b>"+username+"</b>");
                        $(".username_area").html(username);
                        $(".userid_area").html("ID120"+uid);
                        $(".name").html(name);
                        $(".username").html(username);
                        $(".content").html(content);
                        $("#userphoto_area").html('<img class="loadimg" src="pic/throbber.svg" /><img class="userphoto"  onload="re_check_this_img_size2(this,\'out\');" style=" display:none;" id="index_user_photo" src="'+vhost+'/userimg/'+uid+'/small.jpg?id='+timestamp+'" />');

                    },function(tx,err){console.log(err);});
                },function(errormsg){
                    console.log(errormsg);
                });
            }
        },
        error:function(XHR, textStatus, errorThrown){
            db.transaction(function(tx){
                tx.executeSql(" select * from tUser_info where uid=? ",[uid],function(tx,resultSet){
                    var rows = resultSet.rows;
                    for(var i=0,len=rows.length;i<len;i++){
                        username=rows.item(i).username;
                        content=rows.item(i).content;
                        pic=rows.item(i).pic;

                        $("#userinfo").html("<b>"+username+"</b>");
                        $(".name").html(name);
                        $(".username").html(username);
                        $(".content").html(content);
                        $("#userphoto_area").html('<img class="loadimg" src="pic/throbber.svg" /><img class="userphoto"  onload="re_check_this_img_size2(this,\'out\');" style="display:none;" id="index_user_photo" src="'+vhost+'/userimg/'+uid+'/small.jpg?id='+timestamp+'" />');
                    }
                });
            });
        }
    });

}

function check_id(){
    var uid = window.localStorage? localStorage.getItem("qsl_uid"): Cookie.read("qsl_uid");
    var name = window.localStorage? localStorage.getItem("qsl_name"): Cookie.read("qsl_name");
    var password = window.localStorage? localStorage.getItem("qsl_password"): Cookie.read("qsl_password");
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=check_login&name='+encodeURI(name)+'&password='+password+'&callback=?',
        success: function(data) {
            var rel=data.result;
            for (var i = 0; i < rel.length; i++) {
                var message = rel[i].message;
                //alert(message);
                if(message=="1"){
//					$.query("#afui #splashscreen").remove();
                }
                else if(message=="0"){

                    logout(uid);
                }
            }
        }
    });
}

function logout(){
    var uid=window.localStorage? localStorage.getItem("qsl_uid"): Cookie.read("qsl_uid");

    if (window.localStorage) {
        localStorage.setItem("qsl_uid", "");
        localStorage.setItem("qsl_name", "");
        localStorage.setItem("qsl_password", "");
    } else {
        Cookie.write("qsl_uid", "");
        Cookie.write("qsl_name", "");
        Cookie.write("qsl_password", "");
    }

    db.transaction(function(tx){
        var sql="update tUser set logined=? where uid=? ";
        tx.executeSql(sql,[0,uid],
            function(){
                window.location="index.html";
            },
            function(tx,err){console.log(tx);console.log(err);});
    });
    return false;
}

/* This function runs once the page is loaded, but intel.xdk is not yet active */
//$.ui.animateHeaders=false;

$.ui.ready(function(){
    $("#afui").get(0).className='myandroid';
});

//alert($.os.android );
//alert($.os.ios );
var webRoot = "./";
// $.os.android=true;
//$.ui.autoLaunch = false;
$.ui.openLinksNewTab = false;
$.ui.splitview=false;
refresh_datainfo();

//$.ui.launch();
$(".ulist li , .friend_list li ,.list5 li, .list3 li").on("touchstart",function(){
    $(this).css({"background":"#F9F9F9"});
});
$(".ulist li , .friend_list li ,.list5 li, .list3 li").on("touchend",function(){
    $(this).css({"background":"#FFFFFF"});
});
//

/* This code is used to run as soon as intel.xdk activates */
var onDeviceReady = function () {
    intel.xdk.device.setRotateOrientation("portrait");
    intel.xdk.device.setAutoRotate(false);
    webRoot = intel.xdk.webRoot + "";
    //hide splash screen
    intel.xdk.device.hideSplashScreen();
    $.ui.blockPageScroll(); //block the page from scrolling at the header/footer
};
document.addEventListener("intel.xdk.device.ready", onDeviceReady, false);

function refresh_datainfo(){
    $.get('pages/datainfoform0.html',function(data){$("#contact_div0").html(data); });
    $.get('pages/datainfoform1.html',function(data){$("#contact_div1").html(data); });
    $.get('pages/datainfoform2.html',function(data){$("#contact_div2").html(data); });
    $.get('pages/datainfoform3.html',function(data){$("#contact_div3").html(data); });
    $.get('pages/datainfoform4.html',function(data){$("#contact_div4").html(data); });
}

function showHide(obj, objToHide) {
    var el = $("#" + objToHide)[0];

    if (obj.className == "expanded") {
        obj.className = "collapsed";
    } else {
        obj.className = "expanded";
    }
    $(el).toggle();
}


//提取用户信息（非本机用户）
function show_personinfo(fuid){
    $("#showpersoninfo").attr("data-fuid",fuid);
    var showpersoninfo_list="";
    var level=90;
    $(".show_user_do").html("");
    $("#showpersoninfo_list").html("");
    var simi=0;
    $.jsonP({
        url: vhost+'/api/getjosn.php?a=userinfo&fuid='+fuid+'&simi='+simi+'&uid='+uid+'&token='+get_token(uid,password)+'&callback=?',
        success: function(data) {
            var rel=data.result;
            for (var i = 0; i < rel.length; i++) {
                showpersoninfo_list+='<li class="li_top">';
                showpersoninfo_list+='<a onclick="show_personinfo_mag('+fuid+');" data-uid="'+fuid+'" data-transition="up">';
                showpersoninfo_list+='<div class="u_img">';
                if(rel[i].pic!="0"){
                    showpersoninfo_list+='<img src="'+vhost+'/userimg/'+fuid+'/small.jpg" />';
                }else{
                    showpersoninfo_list+='<div class="icon user big" style="margin:15px; color:#00AEEF;"></div>';
                }
                showpersoninfo_list+='</div>';
                showpersoninfo_list+='<div class="u_msg">';
                showpersoninfo_list+='<p class="p1">';

                if(rel[i].level=="20"){
                    $("#fl_area").show();
                    $("#bl_area").hide();
                    showpersoninfo_list+='<span class="yishengbs">高级用户</span>';
                    level=20;
                }else if(rel[i].level=="90"){
                    $("#fl_area").hide();
                    $("#bl_area").show();
                    showpersoninfo_list+='<span class="yishengbs">普通用户</span>';
                    level=90;
//					$("html").append( vhost+'/api/getjosn.php?a=get_bl&uid='+uid+'&fuid='+fuid+'&token='+get_token(uid,password)+'&callback=?');
                    $.jsonP({
                        url: vhost+'/api/getjosn.php?a=get_bl&uid='+uid+'&fuid='+fuid+'&token='+get_token(uid,password)+'&callback=?',
                        success: function(dataf) {
                            var relf=dataf.result;
                            var sum=0;
                            var blhtml="";
                            for(var l=0;l<relf.length;l++){
                                if($.trim(relf[l].imgnamestr)!="" && sum<6){
                                    var ary=relf[l].imgnamestr.split(","); //字符分割
                                    if(ary.length>0){
                                        blhtml+="<div class='bl_img_div2'><img onload='check_this_bl_img_size(this);' src='"+vhost+"/app/sbl_img/"+ary[0]+"' /></div>"; //分割后的字符输出
                                    }
                                }
                                sum++;
                            }
                            $("#bl_area").html(blhtml);
                        }
                    });
                }else if(rel[i].level=="10"){
                    $("#fl_area").show();
                    $("#bl_area").hide();
                    showpersoninfo_list+='<span class="yishengbs">管理员</span>';
                    level=10;
                }

                showpersoninfo_list+=rel[i].username;
                showpersoninfo_list+='</p>';
                showpersoninfo_list+='<p class="p2">账号：'+rel[i].name+' ';
                if(rel[i].sex=="1"){
                    showpersoninfo_list+='<b class="male">男</b>';
                }else if(rel[i].sex=="0"){
                    showpersoninfo_list+='<b class="female">女</b>';
                }else if(rel[i].sex=="2"){
                    showpersoninfo_list+='<b class="female">未知</b>';
                }
                showpersoninfo_list+='</p>';
                showpersoninfo_list+='</div>';
                showpersoninfo_list+='<div class="u_date">';
                showpersoninfo_list+='</div>';
                showpersoninfo_list+='</a>';
                showpersoninfo_list+='</li>';
            }

            $("#showpersoninfo_list").html(showpersoninfo_list);
            db.transaction(function(tx){
                tx.executeSql("select * from friend_list where uid=? and fuid=? and pass=? ",[uid,fuid,1],function(tx,resultSet){
                    var rows = resultSet.rows;
                    len=rows.length;
                    var sudstr="";
                    if(len>0){
                        sudstr+='<a class="button icon pencil" href="#user_message" onclick="show_user_message_panel('+fuid+',15,this);" data-uid="'+fuid+'" data-username="'+rows.item(0).username+'" id="uid" style="width:100%;">发送信息</a>';
                        if(level==90 && ulevel==20){
                            sudstr+='<a class="button icon stack" href="#add_user_bl_panel" onclick="add_user_bl_panel('+fuid+');" data-uid="'+fuid+'" data-username="'+rows.item(0).username+'" id="uid" style="width:100%; background:#00AD14; color:#FFF;" data-transition="Slide">添加病例</a>';
                        }
                    }else{
                        sudstr+='<a class="button icon add" href="#add_user" onclick="send_hello('+fuid+');" data-uid="'+fuid+'" id="fuid" style="width:100%;">添加好友</a>';
                    }
                    $(".show_user_do").html(sudstr);
                },function(tx,err){console.log(err);});},function(errormsg){console.log(errormsg);});
        }
    });
}

function show_friendmessage(){
    $.ui.loadContent("#show_friendmessage", false, false, "slide");
    show_user_bl(0,0,1,this);
}
//打开朋友圈

function show_img(type,e){
    //$("#show_img_panel img").hide();
    if(type=="userphoto"){
        var id=$(e).attr("data-imgid");
        if(id==0){
            id=uid;
        }
        $("#show_img_area").html('<img class="loadimg" src="pic/throbber.svg" /><img onload="re_check_this_img_size2(this,\'in\');" style=" display:none;" id="index_user_photo" src="'+vhost+"/userimg/"+id+"/big.jpg?id="+Date.parse(new Date())+'" />');

    }else if(type=="messagephoto"){
        var src=$(e).attr("data-imgsrc");
        $("#show_img_area").html('<img class="loadimg" src="pic/throbber.svg" /><img onload="re_check_this_img_size2(this,\'in\');" style=" display:none;" id="index_user_photo" src="'+vhost+'/app/message_img/big/'+src+'" />');
    }
}

function unload_show_img_panel(what){
    console.log("unload_show_img_panel");
}

function close_img_panel(){
    $.ui.goBack();
}

function initdate() {
    // Date demo initialization
    $('#update_ubrithday').mobiscroll().date({
        theme: theme,     // Specify theme like: theme: 'ios' or omit setting to use default
        mode: mode,       // Specify scroller mode like: mode: 'mixed' or omit setting to use default
        display: display, // Specify display mode like: display: 'bottom' or omit setting to use default
        lang: lang        // Specify language like: lang: 'pl' or omit setting to use default
    });
}
// -------------------------------------------------------------------
// Demo page code START, you can disregard this in your implementation
var demo, theme, mode, display, lang;

demo = "date";
theme = "android-holo-light",
    mode = "mixed",
    display = "bottom",
    lang = "zh";

$('.demo-cont').hide();
$("#demo_cont_" + demo).show();

initdate();
