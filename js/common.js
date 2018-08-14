var ip = "http://api.xhhdjy.com";
var navArry = [];

//初始化
$(function(){
    var nid = GetQueryString("nid");

	getNav(nid);
    getSite();
});

/**
 * 网站信息
 * @param {Object} data
 */
function getSite(){
    $.ajax({
        type: "GET",
        url: ip+"/site",
        dataType: "json",
        success: function(re) {
            if(!re.status){
                alert(re.message)
                return;
            }

            siteAppendHtml(re.data);
        }
    });
}

function siteAppendHtml(data){
    $("title").text(data.website_title);
    $("meta[name='keywords']") .attr("content", data.seo_keywords);
    $("meta[name='description']") .attr("content", data.seo_description);
    $(".loginbtn").text(data.login_title).attr("href", data.login_url);
    $(".orderbtn").text(data.my_order_title).attr("href", data.my_order_url);

	// $("#footer .f-logo").css("background","url('"+ data.logo +"') no-repeat center");
    $("#footer .f-addr").text(data.address + " | " + data.telphone);
    $("#footer .f-copyright").text(data.copyright + " | " + data.icp);
    // $(".f-code").attr("src", data.wechat_code);
}



/**
 * 导航
 * @param {Object} data
 */
function getNav(nid){
	$.ajax({
			type: "GET",
			url: ip+"/nav",
			dataType: "json",
			success: function(re) {
				if(!re.status){
					alert(re.message)
					return;
				}

				//setData
                re.data.forEach(function (v) {
                    if(v.id == ""){
                        v.url = "/";
                        v.item.length = 0;
                    } else {
                        v.url = "";
					}

                    v.item.forEach(function (i) {
						if(i.id == "1"){
							i.url = "list1.html";
                            i.d = 0;
						} else if(i.id == "6"){
                            i.url = "list3.html";
                            i.d = 0;
						} else if(i.id == "4" || i.id == "5"){
                            i.url = "list2.html";
                            i.d = 0;
						} else {
                            i.url = "detail.html";
							i.d = 1;
						}
					})
				})

				navAppendHtml(re.data, nid);
			}
	});
}		

function navAppendHtml(data, nid){
	var ul = $("#nav");				
	data.forEach(function(item){
		var li = $("<li></li>");
		var a = $("<a></a>");
		var i =$("<i></i>");
		var em =$("<em></em>");
		
		a.attr("href", item.url != "/" ? "javascript:;" : item.url).text(item.name);
		em.addClass("visible-xs-inline-block");
		if(nid && item.id == nid){
			li.addClass("on");
		}

		a.prepend(i,em);
		li.append(a);
		ul.append(li);			
		
		if(item.item.length){	
			navChildrenAppendHtml(item.item, li, item.id);
		}
	});
}			
function navChildrenAppendHtml(data, el, nid){
	var ul = $("<ul></ul>").addClass("sub-menu");
	
	data.forEach(function(item){
		var li = $("<li></li>");

		if(!item.d){
            var a=$("<a></a>").attr("href", encodeURI(item.url + "?nid=" + nid + "&mid=" + item.id)).text(item.name);
		} else {
            var a=$("<a></a>").attr("href", encodeURI(item.url + "?id=" + item.id + "&nid=" + nid + "&mid=" + item.id)).text(item.name);
		}

		li.append(a);
		ul.append(li);
	});
	
	el.append(ul);
}

/**
 * get params
 * @param name
 * @returns {*}
 * @constructor
 */
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}