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
    var jqueryURL = "https://raw.github.com/twitter/bootstrap/master/docs/assets/js/jquery.js";    
    var script= document.createElement('script');
    script.type= 'text/javascript';
    script.src= jqueryURL;
    head.appendChild(script);
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
}
var baseModal = '<div class="modal hide fade" id="main-modal" style="width:700px"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3>Badass SET Automator!</h3></div><div class="modal-body"></div><div class="modal-footer"><span style="float:left"><a href="#" onClick="showAbout()">About this Badass Automator</a></span><a hraf="#" class="btn" onClick="selectAll()">Select All</a><a href="#" class="btn btn-success" onClick="evalSelected()">Auto Evaluate Selected</a></div></div>';
function insertBaseModal(){
    console.log("generating new interface...")
    var content = $("div#content").html();
    var newContent = content + baseModal;
    $("div#content").html(newContent);
}

/*
 * Methods for generating table content for Modal
 * and other html content
 */
function generateFromCourses(courses_list){
    var tableMarkup = "<table class='table table-bordered table-condensed' id='main-table'><caption>Your Courses</caption><thead><tr><td><b>Course</b></td><td><b>Professors</b></td><td>Evaluate One</td><td><b>Select</b></td></tr></thead>";
    for (i in courses_list){
        var course = courses_list[i];
        var profs = course.profs;
        var rspan = profs.length;
        var p1 = profs.shift();
        var mkup = "<tr><td rowspan='"+rspan+"'>"+course.course_name+"</td><td>"+p1.prof_name+"</td><td><a href='#' onClick='set_answer("+course.course_id+","+p1.prof_id+")'>auto evaluate</a></td><td><input type='checkbox' name='to-answer' value='"+p1.prof_id+"'></td></tr>";
            for (j in profs){
                var prof = profs[j];
                mkup+= "<td>"+prof.prof_name+"</td><td><a href='#' onClick='set_answer("+course.course_id+","+prof.prof_id+")'>auto evaluate</a></td><td><input type='checkbox' name='to-answer' value='"+prof.prof_id+"'></td></tr>";
            }
            tableMarkup+=mkup;
    }
    tableMarkup +="</table>"
    return tableMarkup;
}

function generateAbout(){
    return "<div id='main-about'>"+
        "<h3>About Badass SET Automator</h3>"+
        "<p>This script is a lazy student's hack for automated semi-random SET module completion with support to basic SET formats."+
        "The purpose of SET is to evaluate the performance of teachers in the span of the semester, so if a professor deserves a real"+
        "evaluation, please dont use this script</p>"+
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
        "<h4>Problems?</h4>"
        "<p>Badass SET Automator works on subjects whose SET format is the same as those used in GEs. Some colleges or departments"+
        "might have different formats which we do not <em>yet</em> support. If such, please refer to the person who shared you this"+
        "script, to ask the person who sent him the script, to contact us and add features to support specific department or colleges.</p>"+
    "</div>";
}

/*
 * Methods for manipulating UI
 */
function showAbout(){
    $("table#main-table").hide();
    $("div#main-about").show();
}

function showCourses(){
    $("div#main-about").hide();
    $("table#main-table").show();
}
/*
 * Methods that do the answering and Ajax posting
 */
function set_answer(course, prof){
    console.log("sending request for; c:"+course+" p:"+prof);
    sendRequest(prof,course)   
}

function sendRequest(prof_id,class_id,dept){
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
    xmlhttp.send(params);
}
function getRandom(from,to){
    return Math.floor(Math.random()*(to-from+1)+from);
}
/*get random answers for basic subjects*/
function getBasicRandomAnswers(){
    return "&question_1="+getRandom(1,3)+"&question_2="+getRandom(1,3)+"&question_3="+getRandom(1,3)+"&question_4="+getRandom(1,3)+"&question_5="+getRandom(1,3)+"&question_6="+getRandom(1,3)+"&question_7="+getRandom(12,14)+"&question_8="+getRandom(12,13)+"&question_9="+getRandom(20,23)+"&question_10="+getRandom(7,8)+"&question_11="+getRandom(7,8)+"&question_12="+getRandom(7,8)+"&question_13="+getRandom(7,8)+"&question_13="+getRandom(7,8)+"&question_14="+getRandom(7,8)+"&question_15="+getRandom(7,8)+"&question_16="+getRandom(7,8)+"&question_17=31"+"&question_18=32"+"&question_19="+"&question_20="+"&question_21="+getRandom(34,36)+"&question_22="+getRandom(38,40)+"&question_23="+getRandom(38,40)+"&question_24="+"&question_25="+"&question_26="+getRandom(74,75)+"&question_27="+getRandom(76,77)+"&question_28="+getRandom(74,75)+"&question_29="+getRandom(74,75)+"&question_30="+getRandom(74,75)+"&question_31="+getRandom(74,75)+"&question_32="+getRandom(76,77)+"&question_33="+getRandom(74,75)+"&question_34="+getRandom(74,75)+"&question_35="+getRandom(74,75)+"&question_36="+getRandom(74,75)+"&question_37="+getRandom(74,75)+"&question_38="+getRandom(74,75)+"&question_39="+getRandom(74,75)+"&question_40="+getRandom(74,75)+"&question_41="+getRandom(76,77)+"&question_42="+getRandom(76,77)+"&question_43="+getRandom(74,75)+"&question_44="+getRandom(74,75)+"&question_45="+getRandom(74,75)+"&question_46="+getRandom(74,75)+"&question_47="+getRandom(74,75)+"&question_48="+getRandom(76,77)+"&question_49="+getRandom(74,75)+"&question_50="+getRandom(76,77)+"&question_51="+getRandom(74,75)+"&question_52="+getRandom(12,14)+"&question_53="+getRandom(12,14)+"&question_54="+getRandom(45,46)+"&question_55[]=49"+"&question_55[]=50"+"&question_55[]=53"+"&question_55others="+"&question_56="+getRandom(56,58)+"&question_56others="+"&question_57="+getRandom(62,64)+"&question_408="+getRandom(69,70)+"&question_409=";
}
/*get random answers for home econ subjects*/
function getRandomAnswersCHE(){
    return "&question_352="+getRandom(1,3)+"&question_353="+getRandom(1,3)+"&question_354="+getRandom(1,3)+"&question_355="+getRandom(1,3)+"&question_356="+getRandom(1,3)+"&question_357="+getRandom(1,3)+"&question_358="+getRandom(12,14)+"&question_359="+getRandom(12,13)+"&question_360="+getRandom(19,23)+"&question_361="+getRandom(74,75)+"&question_362="+getRandom(76,77)+"&question_363="+getRandom(74,75)+"&question_364="+getRandom(74,75)+"&question_365="+getRandom(74,75)+"&question_366="+getRandom(74,75)+"&question_367="+getRandom(76,77)+"&question_368="+getRandom(74,75)+"&question_369="+getRandom(74,75)+"&question_370="+getRandom(76,77)+"&question_371="+getRandom(74,75)+"&question_372="+getRandom(74,75)+"&question_373="+getRandom(74,75)+"&question_374="+getRandom(74,75)+"&question_375="+getRandom(74,75)+"&question_376="+getRandom(74,75)+"&question_377="+getRandom(76,77)+"&question_378="+getRandom(74,75)+"&question_379="+getRandom(76,77)+"&question_380="+getRandom(74,75)+"&question_381="+getRandom(74,75)+"&question_382="+getRandom(74,75)+"&question_383="+getRandom(74,77)+"&question_384="+getRandom(74,75)+"&question_385="+getRandom(74,75)+"&question_386="+getRandom(74,75)+"&question_388="+getRandom(7,8)+"&question_389="+getRandom(7,8)+"&question_390="+getRandom(7,8)+"&question_391="+getRandom(7,8)+"&question_392="+getRandom(7,8)+"&question_393="+getRandom(7,8)+"&question_394="+getRandom(7,8)+"&question_395="+getRandom(7,8)+"&question_396="+getRandom(7,8)+"&question_397="+getRandom(7,9)+"&question_398="++"&question_399="+"&question_400=";
}

function main(){
    if ( document.location.pathname != "/set_answer"){
        alert("Redirecting you to /set_answer. \nPaste the code again once you are in /set_answer");
        window.location = "/set_answer";
        return;
    }
    /* main setup flow*/
    console.log("Please ignore this error: 404 Not Fount crs.upd.edu.ph/none");
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

