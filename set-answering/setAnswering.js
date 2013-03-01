function getAllSubjects(){
    if ( document.location.pathname != "/set_answer"){
        alert("Redirecting you to /set_answer");
        alert("Paste the code again once you are in /set_answer");
        window.location = "/set_answer";
        return;
    }
    var targ = "table.align-center tbody";
    var v = 0;
    var x = 0;
    var skip = 0;
    var classes = new Array()
    while (true){
        if (skip > 2) break;
        var info = $(targ+" tr:eq("+v+")").children();
        //console.log("v"+v);
        //console.log(info);
        v++;
        var two = false;
        try{
            if (info.length===0) throw "Err";
            if (info.length===2){
                var infozz = new Array(5);
                infozz[0] = classes[x-1][0];
                infozz[1] = removeRequired(info[0].innerText);
                infozz[2] = getURLPath(info[1].innerHTML);
                two=true;
            }
            else if (info[4].innerText==="DONE" || info[4].innerText==="N/A")
                continue;
        }catch(err){
            skip++;
            //console.log(err);
            continue;
        }
        skip = 0;
        if (!two){
        var infozz = new Array(5);
        infozz[0] = info[1].innerText;
        infozz[1] = removeRequired(info[3].innerText);
        infozz[2] = getURLPath(info[4].innerHTML);
        }
        for (var i = infozz.length - 1; i >= 0; i--) {
            //console.log(infozz[i]);
        };
        //console.log("Added:"+infozz);
        classes[x++] = infozz;
        var cid = getCourseID(infozz[2]);
        infozz[3] = cid;
        infozz[4] = getProfID(infozz[2],cid);
    }
    //console.log("displaying subjects")
    window.classes_ = classes;
    displayPopup();
    displayAuto();
}

function removeRequired(prof){
    return prof.substring(0,prof.indexOf("Required")-1);
}

function getURLPath(html){
    html = html.substring(html.indexOf('.ph')+3,html.length);
    return html.substring(0,html.indexOf('"'));
}

function injectCSS(){
    var modalCSS =".modal-overlay{position:fixed;top:0;right:0;bottom:0;left:0;height:"+
    "100%;width:100%;margin:0;padding:0;background:#fff;opacity:.75;filter:alpha(opacity=75)"+
    ";-moz-opacity:0.75;z-index:101;}.modal-window{position:fixed;top:50%;left:50%;margin:0;"+
    "padding:0;z-index:102;}.close-window{position:absolute;width:32px;height:32px;right:8px;"+
    "top:8px;background:transparenturl('/examples/modal-simple/close-button.png')no-repeatscroll"+
    "righttop;text-indent:-99999px;overflow:hidden;cursor:pointer;opacity:.5;filter:alpha(opacity=50)"+
    ";-moz-opacity:0.5;}.close-window:hover{opacity:.99;filter:alpha(opacity=99);-moz-opacity:0.99;}"+
    ".mini{font-size:12px}";
    var headTag = document.getElementsByTagName("head")[0].innerHTML;   
    var newCSS = headTag + '<style type="text/css">'+modalCSS+'</style>';
    document.getElementsByTagName('head')[0].innerHTML = newCSS;
 }
var modalWindow = {
    parent:"body",
    windowId:null,
    content:null,
    width:null,
    height:null,
    close:function(){
        $(".modal-window").remove();
        $(".modal-overlay").remove();
    },
    open:function(){
        var modal = "";
        modal += "<div class=\"modal-overlay\"></div>";
        modal += "<div id=\"" + this.windowId + "\" class=\"modal-window\" style=\"width:" +
         this.width + "px; height:" + this.height + "px; margin-top:-" + (this.height / 2) +
          "px; margin-left:-" + (this.width / 2) + "px;\">" + this.content + "</div>";  
        $(this.parent).append(modal);
        $(".modal-window").append("<a class=\"close-window\"></a>");
        $(".close-window").click(function(){modalWindow.close();});
        $(".modal-overlay").click(function(){modalWindow.close();});
    }
};
var openModal = function(html){
    injectCSS();
    modalWindow.windowId = "myModal";  
    modalWindow.width = 480;  
    modalWindow.height = 405;  
    modalWindow.content = html;
    modalWindow.open();  
}
function getAuto(){
    var classes = window.classes_;
    var html = "<div id='automatic-div' style='background-color:#62C462'><table>"
    html +="<tr><td>Class</td><td>Prof</td><td></td></tr>"
    for (var i = 0; i < classes.length; i++) {
        html+="<tr>";
        html+="<td>"+classes[i][0]+"<br/><span class='mini'>class id: "+classes[i][3]+"</span></td>"
        html+="<td>"+classes[i][1]+"<br/><span class='mini'>prof id: "+classes[i][4]+"</span></td>"
        html+="<td><a href='javascript:void(0);' onclick='sendRequest("+classes[i][4]+
            ","+classes[i][3]+")'>auto evaluate</a></td></tr>";
    };
    html+="</table><a href='#' style='float:right;margin-top:-7px' onclick='displayManual()'>SHOW MANUAL"+
    "</a><span style='font-size:10px'>&#64;author:ibaguio</span></div>";
    return html;
}
function displayPopup(){
    var main_html = "<div id='main-div'></div>"
    openModal(main_html);
}

function displayAuto(){
    $("div#main-div").html(getAuto());
}

function displayManual(){
    $("div#main-div").html(getManual());
}

function getManual(){
    return "<div style='background-color:#62C465;' id='manual-div'><div style='font-size:"+
        "15px'><h2>MANUAL Instructions</h2><br/> Enter Class ID and Prof ID below."+
        "<br/> Class id and Prof ID can be found when you click the 'evaluate' <br/>link in the"+
        " <a href='https://crs.upd.edu.ph/set_answer'>Set Answer</a> page"+
        "<br/><br/>SAMPLE: https://crs.upd.edu.ph/set_answer/intro/000000/555555"+
        "<br/>In the above example:<pre>   course id is 000000"+
        "<br/>   prof   id is 555555</pre>"+
        "</div><table style='background-color:#62C462'>"+
        "<tr><td>CLASS ID: </td><td><input type='text' id='class_id'></td></tr>"+
        "<tr><td>PROF ID:</td><td><input type='text' id='prof_id'></td></tr>"+
        "<tr><td>format:</td><td><select><option selected></option><option value='che'>"+
        "FN, HEED, HRIM, HE, FS, FLCD</option></td></tr>"+
        "</table><button type='button' onclick='manual_go()' style='float:right'>Evaluate</button>"+
        "<div id='how-it-works' style='display:none;padding:5px;width:380px'>"+
        "<br/> Values are SEMI-random, when a question is positive, the answer would be either SA or A "+
        "when the question is negative, the answer would be either D or SD. The 'expected grade' would be "+
        "between 1.5 to 2.5 randomly.</div><span style='font-size:10px'>"+
        "<a href='#' id='show' onClick=\"$(\'#how-it-works\').show()\">how it works</a>  "+
        "<a href='#' onClick='displayAuto()'>show class list</a><br/>"+
        "&#64;author:ibaguio</span></div>";
}
function manual_go(){
    var course_id = $("input#class_id").val();
    var prof_id = $("input#prof_id").val();
    sendRequest(prof_id,course_id);
}

function ajaxRequest(){
    var xmlhttp;
    if (window.XMLHttpRequest)// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    else// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    return xmlhttp;
}

function getCourseID(href){
    var href2 = href.substring(href.indexOf("ro/")+3,href.length);
    return href2.substring(0,href2.indexOf("/"))
}

function getProfID(href,cid){
    var href2 = href.substring(href.indexOf(cid)+7,href.length);
    return href2.substring(0);
}

function sendRequest(prof_id,class_id,dept){
    xmlhttp = ajaxRequest();
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState === 2){
            $("div#loading").show();
        }if (xmlhttp.readyState === 4){
            //console.log("RESPONSE:"+xmlhttp.responseText);
            //console.log(xmlhttp.getAllResponseHeaders());
            //console.log(xmlhttp.response);
            if (xmlhttp.status === 200){
                alert("ANSWERING COMPLETED");
            }else{
                alert("ANSWERING FAILED");
            }
        }
    }
    var params = "classinstructorid="+prof_id;
    params+="&classid="+class_id;
    if (dept == null){
        params+=getBasicRandomAnswers();
        console.log("default");
    }
    else if (dept == 'che'){
        params+=getRandomAnswersCHE();
        console.log("CHE")
    }

    xmlhttp.open("POST",site_url+"set_answer/save_answer");
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xmlhttp.send(params);
}
function getRandom(from,to){
    return Math.floor(Math.random()*(to-from+1)+from);
}
/*get random answers for basic subjects*/
function getBasicRandomAnswers(){
return "&question_1="+getRandom(1,3)+"&question_2="+getRandom(1,3)+"&question_3="+getRandom(1,3)
+"&question_4="+getRandom(1,3)+"&question_5="+getRandom(1,3)+"&question_6="+getRandom(1,3)
+"&question_7="+getRandom(12,14)+"&question_8="+getRandom(12,13)+"&question_9="+getRandom(20,23)
+"&question_10="+getRandom(7,8)+"&question_11="+getRandom(7,8)+"&question_12="+getRandom(7,8)
+"&question_13="+getRandom(7,8)+"&question_13="+getRandom(7,8)+"&question_14="+getRandom(7,8)
+"&question_15="+getRandom(7,8)+"&question_16="+getRandom(7,8)+"&question_17=31"
+"&question_18=32"+"&question_19="+"&question_20="+"&question_21="+getRandom(34,36)
+"&question_22="+getRandom(38,40)+"&question_23="+getRandom(38,40)+"&question_24="+"&question_25="
+"&question_26="+getRandom(74,75)+"&question_27="+getRandom(76,77)+"&question_28="+getRandom(74,75)
+"&question_29="+getRandom(74,75)+"&question_30="+getRandom(74,75)+"&question_31="+getRandom(74,75)
+"&question_32="+getRandom(76,77)+"&question_33="+getRandom(74,75)+"&question_34="+getRandom(74,75)
+"&question_35="+getRandom(74,75)+"&question_36="+getRandom(74,75)+"&question_37="+getRandom(74,75)
+"&question_38="+getRandom(74,75)+"&question_39="+getRandom(74,75)+"&question_40="+getRandom(74,75)
+"&question_41="+getRandom(76,77)+"&question_42="+getRandom(76,77)+"&question_43="+getRandom(74,75)
+"&question_44="+getRandom(74,75)+"&question_45="+getRandom(74,75)+"&question_46="+getRandom(74,75)
+"&question_47="+getRandom(74,75)+"&question_48="+getRandom(76,77)+"&question_49="+getRandom(74,75)
+"&question_50="+getRandom(76,77)+"&question_51="+getRandom(74,75)+"&question_52="+getRandom(12,14)
+"&question_53="+getRandom(12,14)+"&question_54="+getRandom(45,46)+"&question_55[]=49"
+"&question_55[]=50"+"&question_55[]=53"+"&question_55others="+"&question_56="+getRandom(56,58)
+"&question_56others="+"&question_57="+getRandom(62,64)+"&question_408="+getRandom(69,70)+"&question_409=";
}
/*get random answers for home econ subjects*/
function getRandomAnswersCHE(){
return "&question_352="+getRandom(1,3)
+"&question_353="+getRandom(1,3)+"&question_354="+getRandom(1,3)+"&question_355="+getRandom(1,3)
+"&question_356="+getRandom(1,3)+"&question_357="+getRandom(1,3)+"&question_358="+getRandom(12,14)
+"&question_359="+getRandom(12,13)+"&question_360="+getRandom(19,23)+"&question_361="+getRandom(74,75)
+"&question_362="+getRandom(76,77)+"&question_363="+getRandom(74,75)+"&question_364="+getRandom(74,75)
+"&question_365="+getRandom(74,75)+"&question_366="+getRandom(74,75)+"&question_367="+getRandom(76,77)
+"&question_368="+getRandom(74,75)+"&question_369="+getRandom(74,75)+"&question_370="+getRandom(76,77)
+"&question_371="+getRandom(74,75)+"&question_372="+getRandom(74,75)+"&question_373="+getRandom(74,75)
+"&question_374="+getRandom(74,75)+"&question_375="+getRandom(74,75)+"&question_376="+getRandom(74,75)
+"&question_377="+getRandom(76,77)+"&question_378="+getRandom(74,75)+"&question_379="+getRandom(76,77)
+"&question_380="+getRandom(74,75)+"&question_381="+getRandom(74,75)+"&question_382="+getRandom(74,75)
+"&question_383="+getRandom(74,77)+"&question_384="+getRandom(74,75)+"&question_385="+getRandom(74,75)
+"&question_386="+getRandom(74,75)+"&question_388="+getRandom(7,8)+"&question_389="+getRandom(7,8)
+"&question_390="+getRandom(7,8)+"&question_391="+getRandom(7,8)+"&question_392="+getRandom(7,8)
+"&question_393="+getRandom(7,8)+"&question_394="+getRandom(7,8)+"&question_395="+getRandom(7,8)
+"&question_396="+getRandom(7,8)+"&question_397="+getRandom(7,9)+"&question_398="+
+"&question_399="+"&question_400="
}