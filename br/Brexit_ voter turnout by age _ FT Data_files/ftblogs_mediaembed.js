ftvideo_initialize(''); //intialize when load page

// Brightcove is a CDN that takes care of all the videos at videos.ft.com.
// To get videos to load, you need to call their 'createExperience' function.
// That function is located in a js file that's in the FT Wrapper code.
function ftvideo_initialize(id) {

	if (typeof BrightcoveFT !== "undefined" && typeof BrightcoveFT.Init !== "undefined" && typeof BrightcoveFT.Init.createExperience !== "undefined") {
		var container = id ? '#' + id : 'body';
		jQuery(container + ' .video-container-ftvideo .BrightcoveExperience').each(function() {

			// Once BrightcoveFT.Init.createExperience is executed, the
			// brightcove object becomes available. As additional videos are
			// initialised, they're added to brightcove.experiences.
			if (typeof brightcove === "undefined" || typeof brightcove.experiences === "undefined" || typeof brightcove.experiences[this.id] === "undefined") {
				BrightcoveFT.Init.createExperience(this.id);
			}
		});
	}
}

//podcasts popup
function popup(mylink, windowname) { 
	if (! window.focus)return true; 
	var href; 
	if (typeof(mylink) == 'string') {
		href=mylink
	} else {
		href=mylink.href
	} 
	window.open(href, windowname, 'width=454,height=235,scrollbars=yes,target=blank'); 
	return false; 
}

function showShare(URL,title,anchorname) {
	var articleURL = URL;
	var anchor = document.getElementById(anchorname);
	var docTitle=title;
	var linkface='http://www.facebook.com/sharer.php?u='; 
	var linkredd='http://reddit.com/submit?url='; 
	var linkstumble='http://www.stumbleupon.com/submit?url=';
	var linklinkedin='http://www.linkedin.com/shareArticle?mini=true&url=';
	var linktwitter='http://twitter.com/home?status=';
	var linkgoogle='https://plus.google.com/share?url=';
	var linktumblr='http://www.tumblr.com/share/link?url=';
	var sharetwitter='<li id="twitter1"> <a target="new"  title="Post this story to Twitter" href="'+linktwitter+docTitle+'+-+'+articleURL+'"><span class="linktext">Twitter</span></a> </li>';
	var shareface='<li id="facebook1"> <a target="new"  title="Post this story to Facebook" href="'+linkface+articleURL+'&t='+docTitle+'"><span class="linktext">Facebook</span></a> </li>';
	var sharegoogle='<li id="google1"> <a target="new"  title="Post this story to Google+" href="'+linkgoogle+articleURL+'"><span class="linktext">Google+</span></a> </li>';
	var sharelinkedin='<li id="linkedin1"> <a target="new"  title="Post this story to LinkedIn" href="'+linklinkedin+articleURL+'&title='+docTitle+'"><span class="linktext">LinkedIn</span></a> </li>';
	var sharestumble='<li id="stumbleupon1"> <a target="new"  title="Post this story to StumbleUpon" href="'+linkstumble+articleURL+'&title='+docTitle+'"><span class="linktext">StumbleUpon</span></a> </li>';
	var shareredd='<li id="reddit1"> <a target="new"  title="Post this story to reddit" href="'+linkredd+articleURL+'&title='+docTitle+'"><span class="linktext">Reddit</span></a> </li>'; 
	var sharetumblr='<li id="tumblr1"> <a target="new"  title="Post this story to Tumblr" href="'+linktumblr+articleURL+'&name='+docTitle+'"><span class="linktext">Tumblr</span></a> </li>';
	var sharecontent = '<ul id="shareslist" style="margin-top:0;">'+sharetwitter+shareface+sharegoogle+sharelinkedin+'</ul><br>';
	sharecontent +='<ul id="shareslist" style="margin-top:0;">'+sharestumble+shareredd+sharetumblr+'</ul>';
	var share = "<div id='ftShare-box'><div class='Share-boxinner'><div class='ftShare-boxheader'>SHARE THIS ON<a class='ftShare-boxHideButton' href='javascript:void(0)' onclick=\"closelink(document.getElementById('"+anchorname+"'));\">Close</a></div>"+sharecontent+"</div></div>";
	anchor.innerHTML = share;
	while (!anchor.offsetTop) {
	anchor = anchor.offsetParent;
	}
	var obj =document.getElementById('ftShare-box');
	document.getElementById('ftShare-box').style.top = (parseInt(anchor.offsetTop)) - 160 + "px";
	document.getElementById('ftShare-box').style.left = (parseInt(anchor.offsetLeft)) + 10 + "px";	
	document.getElementById('ftShare-box').style.display = 'block';
} 

function closelink(anchor) {
	anchor.innerHTML = "";
}