/*
 * SET Automator v 2.0
 * used twitter bootstrap for UI
 * improved html scrapping for professors
 */

/*
 * Methods for scrapping data from /set_answer page
 */
function Prof(){ //prof object
    var prof_name;
    var prof_id;
    var full_link;
}
function CourseInfo(){//course info object
    var course_name;
    var profs = new Array();
    var course_id;
    var done;
}
function extractCourseId(link){
    var marker = "intro/";
    if (link[link.length-1] == "/")
        link = link.substr(0, link.length-1);
    return link.substring(link.indexOf(marker)+marker.length, link.lastIndexOf("/"));
}
function extractProfName(str){
    return str.substring(0, str.indexOf("(")-1);
}
function extractProfId(link){
    if (link[link.length-1] == "/")
        link = link.substr(0, link.length-1);
    return link.substring(link.lastIndexOf("/")+1, link.length);
}
function getCourseObject(){
    console.log("getting your courses...")
    var tableRows = $("table.align-center tbody tr");
    var courses = new Array();
    var cinfo;
    var isNew = true;
    tableRows.each(function(index, Element){
        var tdcount = $(this).children("td").length;
        if (isNew){
            cinfo = new CourseInfo();
            cinfo.profs = new Array();
            isNew = false;
        }
        if (tdcount == 6){ //load info to cinfo
            var cols = $(this).children("td");
            cinfo.course_name = cols[1].innerText;
            var hrefLinkTag = $(cols[4]).children()[0];
            if (hrefLinkTag == null);
                //not valid
            else{//new professor
                var hrefLink = hrefLinkTag.href;
                cinfo.course_id = extractCourseId(hrefLink);
                var newProf = new Prof();
                    newProf.full_link = hrefLink;
                    newProf.prof_name = extractProfName(cols[3].innerText);
                    newProf.prof_id = extractProfId(hrefLink);
                cinfo.profs.push(newProf);
            }
        }else if (tdcount == 2){
            var cols = $(this).children("td");
            var hrefLink;
            var hrefLinkTag = $(cols[1]).children()[0];
            if (hrefLinkTag == null){
                //incomplete prof info
            }else{
                hrefLink = hrefLinkTag.href;
            }
            var newProf = new Prof();
                newProf.prof_name = extractProfName(cols[0].innerText);
                newProf.prof_id = extractProfId(hrefLink);
                newProf.full_link = hrefLink;
            cinfo.profs.push(newProf);
        }else if (tdcount == 0){
            courses.push(cinfo);
            isNew = true;
        }
    });
    return courses;
}


/*
 * Methods for loading CSS and JS Scripts from CDN
 * and setting up base Modal
 */
var head = document.getElementsByTagName('head')[0];
function addJQUERY(){
    console.log("adding jquery..");
    var jqueryURL = "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js";
    var script= document.createElement('script');
    script.type= 'text/javascript';
    script.src= jqueryURL;
    head.appendChild(script);
    console.log("jquery added...");
}
function injectCSSandJS(){
    console.log("injecting unharmful viruses...");
    var bootstrapURL = "https://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/css/bootstrap-combined.min.css";
    var bootstrapJS = "https://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.1/js/bootstrap.min.js";
    jQuery.getScript(bootstrapJS);
    $("head").append("<link>");
    var css = $("head").children(":last");
        css.attr({
            rel: "stylesheet",
            type: "text/css",
            href: bootstrapURL
        });
    console.log("css and js injection completed...");
}
var baseModal = '<div class="modal hide fade" id="main-modal" style="width:700px;"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3>Badass SET Automator!</h3></div><div class="modal-body"></div><div class="modal-footer"><span style="float:left"><a href="#" onClick="showAbout()">About this Badass Automator</a> | <a href="#" onClick="showCourses()">Start auto-evaluating</a></span></div></div>';
function insertBaseModal(){
    console.log("generating new interface...")
    var content = $("div#content").html();
    var newContent = content + baseModal;
    $("div#content").html(newContent);
    console.log("")
}

/*
 * Methods for generating table content for Modal
 * and other html content
 */
function generateFromCourses(courses_list){
    var tableMarkup = "<div id='main-table' class='hide'><table class='table table-bordered table-condensed'><caption>Your Courses</caption><thead><tr><td><b>Course</b></td><td><b>Professors</b></td><td><b>Evaluate One</b></td><td><b>Select</b></td></tr></thead>";
    for (i in courses_list){
        var course = courses_list[i];
        var profs = course.profs;
        var rspan = profs.length;
        var p1 = profs.shift();
        var mkup = "<tr><td rowspan='"+rspan+"'>"+course.course_name+"</td><td>"+p1.prof_name+"</td><td><a href='#' onClick='set_answer("+course.course_id+","+p1.prof_id+")'>auto evaluate</a></td><td><input type='checkbox' name='to-answer' value='"+course.course_id+"-"+p1.prof_id+"'></td></tr>";
            for (j in profs){
                var prof = profs[j];
                mkup+= "<td>"+prof.prof_name+"</td><td><a href='#' onClick='set_answer("+course.course_id+","+prof.prof_id+")'>auto evaluate</a></td><td><input type='checkbox' name='to-answer' value='"+course.course_id+"-"+prof.prof_id+"'></td></tr>";
            }
            tableMarkup+=mkup;
    }
    tableMarkup +="</table><span class='pull-right'><a href='#' onClick='selectAll()' class='btn'>Select All</a> <a href='#' onClick='automateSelected()' class='btn btn-primary'>Automate Selected</a></span></div>"
    return tableMarkup;
}

function generateAbout(){
    return "<div id='main-about'>"+
        "<h3>About Badass SET Automator</h3>"+
        "<p>This script is a lazy student's hack for automated semi-random SET module completion with support to basic SET formats."+
        "The purpose of SET is to evaluate the performance of teachers in the span of the semester, so if a professor deserves a real "+
        "evaluation, please dont use this script.</p>"+
        "<h3>Terms of use</h3>"+
        "<p>By using this script, you, the user of this script takes <strong>FULL</strong> responsibility of any damages the "+
        "use of this script may incur whatsoever.</p>"+
        "<blockquote>"+
          "<p>We, the authors of this script is <strong>NOT</strong> accountable for any damages to digital data, property, "+
          "and personal feelings derived from the use of this script. Use at your own risk</p>"+
          "<small>Our Legal Team</small>"+
        "</blockquote>"+
        "<p>NOTE: Some <strong>will</strong> argue that the use of this script is ethically wrong. That might be the case,"+
        "but that doesn't stop us lazy students from using it right? Its for you to decide.</p>"+
        "<h3>How it works</h3>"+
        "<p>Badass SET Automator uses a semi-random uncomplex algorithm to fill up the evaluation form of the professor. The professor"+
        "is given an 'average' to 'good rating', but never a negative evaluation. We might add additional features on this script for "+
        "an option to give out bad ratings and such.</p>"+
        "<h3>about the authors</h3>"+
        "<p>We prefer not to be know, for this might lead into not serious litigations. we made this script coz we love to create cool "+
        "stuffs hack the hell out of anything and everything. peace out.</p>"+
        "<h4>Problems?</h4>"+
        "<p>Badass SET Automator works on subjects whose SET format is the same as those used in GEs. Some colleges or departments"+
        "might have different formats which we do not <em>yet</em> support. If such, please refer to the person who shared you this"+
        "script, to ask the person who sent him the script, to contact us and add features to support specific department or colleges.</p>"+
    "<a href='#' class='btn btn-success' onClick='showCourses()'>Agree terms and Continue</a></div>";
}

/*
 * Methods for manipulating UI
 */
function showAbout(){
    $("div#main-table").hide();
    $("div#main-about").show();
}

function showCourses(){
    $("div#main-about").hide();
    $("div#main-table").show();
}

function selectAll(){
    $("input[type='checkbox'][name='to-answer']").each(function(){
        $(this).removeAttr("checked"); $(this).attr("checked","checked");
    });
}

function automateSelected(){
    $("input:checked").each(function(){
        var val = $(this).attr('value');
        var cid = val.substring(0, val.indexOf("-"));
        var pid = val.substring(val.indexOf("-")+1,val.length);
        sendRequest(cid,pid);
    });
    alert("Please wait for a few seconds and refresh the page");
}

/*
 * Methods that do the answering and Ajax posting
 */
function set_answer(course, prof){
    console.log("sending request for; c:"+course+" p:"+prof);
    sendRequest(prof,course)
}

function sendRequest(class_id,prof_id,dept){
    xmlhttp = ajaxRequest();
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState === 2){
            $("div#loading").show();
        }if (xmlhttp.readyState === 4){
            //console.log("RESPONSE:"+xmlhttp.responseText);
            //console.log(xmlhttp.getAllResponseHeaders());
            console.log(xmlhttp.response);
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
    //xmlhttp.send(params);
}

function ajaxRequest(){
    var xmlhttp;
    if (window.XMLHttpRequest)// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    else// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    return xmlhttp;
}

function getRandom(from,to){
    return Math.floor(Math.random()*(to-from+1)+from);
}
function getBasicRandomAnswers() {
    return "&question_1=" + getRandom(1, 3) + "&question_2=" + getRandom(1, 3) + "&question_3=" + getRandom(1, 3) + "&question_4=" + getRandom(1, 3) + "&question_5=" + getRandom(1, 3) + "&question_6=" + getRandom(1, 3) + "&question_7=" + getRandom(12, 14) + "&question_8=" + getRandom(12, 13) + "&question_9=" + getRandom(20, 23) + "&question_10=" + getRandom(7, 8) + "&question_11=" + getRandom(7, 8) + "&question_12=" + getRandom(7, 8) + "&question_13=" + getRandom(7, 8) + "&question_13=" + getRandom(7, 8) + "&question_14=" + getRandom(7, 8) + "&question_15=" + getRandom(7, 8) + "&question_16=" + getRandom(7, 8) + "&question_17=31" + "&question_18=32" + "&question_19=" + "&question_20=" + "&question_21=" + getRandom(34, 36) + "&question_22=" + getRandom(38, 40) + "&question_23=" + getRandom(38, 40) + "&question_24=" + "&question_25=" + "&question_26=" + getRandom(74, 75) + "&question_27=" + getRandom(76, 77) + "&question_28=" + getRandom(74, 75) + "&question_29=" + getRandom(74, 75) + "&question_30=" + getRandom(74, 75) + "&question_31=" + getRandom(74, 75) + "&question_32=" + getRandom(76, 77) + "&question_33=" + getRandom(74, 75) + "&question_34=" + getRandom(74, 75) + "&question_35=" + getRandom(74, 75) + "&question_36=" + getRandom(74, 75) + "&question_37=" + getRandom(74, 75) + "&question_38=" + getRandom(74, 75) + "&question_39=" + getRandom(74, 75) + "&question_40=" + getRandom(74, 75) + "&question_41=" + getRandom(76, 77) + "&question_42=" + getRandom(76, 77) + "&question_43=" + getRandom(74, 75) + "&question_44=" + getRandom(74, 75) + "&question_45=" + getRandom(74, 75) + "&question_46=" + getRandom(74, 75) + "&question_47=" + getRandom(74, 75) + "&question_48=" + getRandom(76, 77) + "&question_49=" + getRandom(74, 75) + "&question_50=" + getRandom(76, 77) + "&question_51=" + getRandom(74, 75) + "&question_52=" + getRandom(12, 14) + "&question_53=" + getRandom(12, 14) + "&question_54=" + getRandom(45, 46) + "&question_55[]=49" + "&question_55[]=50" + "&question_55[]=53" + "&question_55others=" + "&question_56=" + getRandom(56, 58) + "&question_56others=" + "&question_57=" + getRandom(62, 64) + "&question_408=" + getRandom(69, 70) + "&question_409="
}
function main(){
    if ( document.location.pathname != "/set_answer"){
        alert("Redirecting you to /set_answer. \nPaste the code again once you are in /set_answer");
        window.location = "/set_answer";
        return;
    }
    /* main setup flow*/
    console.log("Please ignore this error: 404 Not Fount crs.upd.edu.ph/none");
    console.log("Loading CSS and JS code. This might take a while depending on your bandwidth. Please be patient");
    addJQUERY();
    window.setTimeout(waitJqueryToLoad,1000);
    function waitJqueryToLoad(){//wait for jquery to be added, then load base modal
        try{
            $("document").on("click",function(){});
            injectCSSandJS();
            insertBaseModal();
            mainContinue();
        }catch(err){
            window.setTimeout(waitJqueryToLoad,1000);
        }  
    }
    function mainContinue(){
        var c = getCourseObject();
        $("div.modal-body").html(generateFromCourses(c)+generateAbout());
        console.log("dropping random courses...")
        $("#main-modal").modal("show");
        console.log("just kidding.")
    }
}
main()