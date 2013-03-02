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
            if (hrefLinkTag == null)
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
var baseModal = '<div class="modal hide fade" id="main-modal" style="width:700px"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3>Badass SET Automator!</h3></div><div class="modal-body"></div><div class="modal-footer"><span style="float:left"><a href="#">About this Badass Automator</a></span><a hraf="#" class="btn">Select All</a><a href="#" class="btn btn-success" onClick="evalSelected()">Auto Evaluate Selected</a></div></div>';
function insertBaseModal(){
    console.log("generating new interface...")
    var content = $("div#content").html();
    var newContent = content + baseModal;
    $("div#content").html(newContent);
}

function main(){
    if ( document.location.pathname != "/set_answer"){
        alert("Redirecting you to /set_answer. \nPaste the code again once you are in /set_answer");    
        window.location = "/set_answer";
        return;
    }
    /* main setup flow*/
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
        $("div.modal-body").html(generateFromCourses(c));
        console.log("dropping random courses...")
        $("#main-modal").modal("show");
        console.log("just kidding.")
    }
}

/*
 * Methods for generating table content for Modal
 */
function generateFromCourses(courses_list){
    var tableMarkup = "<table class='table table-bordered table-condensed' id='main-table'><caption>Your Courses</caption><thead><tr><td><b>Course</b></td><td><b>Professors</b></td><td>Evaluate One</td><td><b>Select</b></td></tr></thead>";
    for (i in courses_list){
        var course = courses_list[i];
        var profs = course.profs;
        var rspan = profs.length;
        var p1 = profs.shift();
        var mkup = "<tr><td rowspan='"+rspan+"'>"+course.course_name+"</td>\
            <td>"+p1.prof_name+"</td>\
            <td><a href='#' onClick='set_answer("+course.course_id+","+p1.prof_id+")'>auto evaluate</a></td>\
            <td><input type='checkbox' name='to-answer' value='"+p1.prof_id+"'></td></tr>";
            for (j in profs){
                var prof = profs[j];
                mkup+= "<td>"+prof.prof_name+"</td>\
                <td><a href='#' onClick='set_answer("+course.course_id+","+prof.prof_id+")'>auto evaluate</a></td>\
                <td><input type='checkbox' name='to-answer' value='"+prof.prof_id+"'></td></tr>";
            }
            tableMarkup+=mkup;
    }
    tableMarkup +="</table>"
    return tableMarkup;
}

/*
 * Methods that do the answering and Ajax posting
 */

function set_answer(course, prof){
    alert("course: "+course+"\nprof: "+prof);
}