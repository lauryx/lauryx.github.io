var ctoken = getCookie('token');
var gt = JSON.parse('{"token":"' + ctoken + '"}');
const $login = document.querySelector("#login");
const $logoff = document.querySelector("#logoff");
log.value = ctoken;
const WORKER_URL = "https://github-oauth-login.laurex.workers.dev";
var code = new URL(location.href).searchParams.get("code");
$logoff.onclick = function logoff() {
 setCookie("token", null, -1);
 window.location.reload(true);
};

function getCookie(n) {
 let a = `; ${document.cookie}`.match(`;\\s*${n}=([^;]+)`);
 return a ? a[1] : '';
}

function setCookie(cname, cvalue, exdays) {
 var d = new Date();
 d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
 var expires = "expires=" + d.toUTCString();
 document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
(async function() {
  if (code) {
   async function login(code) { // remove ?code=... from URL   	const path = location.pathname + location.search.replace(/\bcode=\w+/, "").replace(/\?$/, "");   	history.pushState({}, "", path);   	document.body.dataset.state = "loading";   	try {    	let response = await fetch(WORKER_URL, {     	method: "POST",     	mode: "cors",     	headers: {      	"content-type": "application/json"     	},     	body: JSON.stringify({      	code     	})    	});    	gt = await response.json();           	if (gt.error) {     	return alert(JSON.stringify(gt, null, 2));    	}        setCookie("token", gt.token, 1);             return gt;                     } catch (error) {           alert(error);           location.reload();         }       }              gt = await login(code);
    try {
     const getUserResponse = await fetch("https://api.github.com/user", {
      headers: {
       accept: "application/vnd.github.v3+json",
       authorization: `token ${gt.token}`
      }
     });
     let dta = await getUserResponse.json();
     $login.textContent = dta.login;
     document.body.dataset.state = "signed-in";
    } catch (error) {
     alert(error);
     document.body.dataset.state = "signed-out";
    }
   } else if (ctoken) {
    try {
     const getUserResponse = await fetch("https://api.github.com/user", {
      headers: {
       accept: "application/vnd.github.v3+json",
       authorization: `token ${gt.token}`
      }
     });
     let dta = await getUserResponse.json();
     $login.textContent = dta.login;
     document.body.dataset.state = "signed-in";
    } catch (error) {
     alert(error);
     document.body.dataset.state = "signed-out";
    }
   }
  })(); CKEDITOR.replace('px_body', {
  height: 400,
  baseFloatZIndex: 10005,
  filebrowserBrowseUrl: 'javascript:void(0)'
 }); CKEDITOR.instances.px_body.on("change", function() {
  e = CKEDITOR.instances.px_body.document.getBody().getHtml();
  $('#p_body').val(e);
 }); CKEDITOR.on('dialogDefinition', function(ev) { //dialogDefinition is a ckeditor event it's fired when ckeditor dialog instance is called           var dialogName = ev.data.name;           var dialogDefinition = ev.data.definition;                   if (dialogName == 'image') { //dialogName is name of dialog and identify which dialog is fired.                            var infoTab = dialogDefinition.getContents('info'); // get tab of the dialog               var linkTab = dialogDefinition.getContents('Link');               linkTab.remove('browse');              var browse = infoTab.get('browse'); //get browse server button               browse.onClick = function() {                   //here we can invoke our custom fileuploader or server files popup                   var API_ASSETS = 'https://api.github.com/repos/'+'{{ site.github.repo }}'+'/contents/assets/';
   async function getimg() {
    img = [];
    try {
     const getUserResponse = await fetch(API_ASSETS, {
      headers: {
       accept: "application/vnd.github.v3+json",
       authorization: `token ${gt.token}`
      }
     });
     let dta = await getUserResponse.json();
     for (const value of dta) {
      if (value.path.match(/.(jpg|jpeg|jfif|pjpeg|pjp|apng|ico|cur|webp|png|gif|bmp|svg|tiff)$/i)) {
       let imgurl = '/' + value.path;
       img.push(imgurl);
      }
     }
     let sel = document.querySelector("#imgselect");
     for (const src of img) {
      var myOption = document.createElement("option");
      myOption.setAttribute('data-img-src', src);
      myOption.value = src;
      myOption.text = src;
      sel.add(myOption);
     }
     $("#imgselect > option").each(function() {
      $(this).addClass("col-xs-2 col-md-4");
     });
     $("#imgselect").imagepicker();
    } catch (error) {
     alert(error);
    }
   }
   getimg();
   $('#selectimages').modal('show');
  };
 }
});
$('#use').on("click", function() {
 var simg = $('#imgselect').val();
 var dialog = CKEDITOR.dialog.getCurrent();
 dialog.selectPage('info');
 var tUrl = dialog.getContentElement('info', 'txtUrl');
 tUrl.setValue(simg);
 $('#selectimages').modal('hide');
});
var messages = document.querySelector('#messages');
var p_bodyval = document.querySelector('#p_body').value;
var go = document.querySelector('#go');
var title = document.querySelector('#p_title').value;
var ctoken = getCookie('token');
var gt = JSON.parse('{"token":"' + ctoken + '"}');
var API_NEW_POST = 'https://api.github.com/repos/' + '{{ site.github.repo }}' + '/contents/_posts/';
var upimg = document.querySelector('#upimg');
var API_NEW_IMG = 'https://api.github.com/repos/' + '{{ site.github.repo }}' + '/contents/assets/';

function post_date() {
 var d = new Date();
 return d.toISOString();
}

function slugify(text) {
 return text.toString().toLowerCase().replace(/\s+/g, '-') // Replace spaces with -   .replace(/[^\w\-]+/g, '') // Remove all non-word chars   .replace(/\-\-+/g, '-') // Replace multiple - with single -   .replace(/^-+/, '') // Trim - from start of text   .replace(/-+$/, ''); // Trim - from end of text
}

function getBase64(file) {
 return new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
   let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
   if ((encoded.length % 4) > 0) {
    encoded += '='.repeat(4 - (encoded.length % 4));
   }
   resolve(encoded);
  };
  reader.onerror = error => reject(error);
 });
}

function post_file() {
 let title = document.querySelector('#p_title').value;
 var d = new Date();
 var dd = d.getDate();
 if (dd < 10) dd = '0' + dd;
 var mm = d.getMonth() + 1;
 if (mm < 10) mm = '0' + mm;
 var yyyy = d.getFullYear();
 var filename = yyyy + '-' + mm + '-' + dd;
 if (!title) {
  filename = filename + '-' + d.getTime();
 } else {
  var slugified = slugify(title);
  filename = filename + '-' + slugified;
 }
 return filename;
}

function gathertext() {
 var p_bodyval = document.querySelector('#p_body').value;
 var title = document.querySelector('#p_title').value;
 var p_body = '---\n';
 p_body = p_body + 'layout: post \n';
 p_body = p_body + 'title:  "' + title + '" \n';
 p_body = p_body + 'date:   ' + post_date() + ' \n';
 /* Setting the category here is not the most elegant way...
 p_body = p_body + 'categories: tests \n';
 */
 p_body = p_body + '---\n';
 p_body = p_body + '\n' + p_bodyval;
 console.log(p_body);
 return btoa(unescape(encodeURIComponent(p_body)));
}
async function fetchAsync(url, postcontent) {
 const putFile = {
  method: 'PUT',
  headers: {
   accept: "application/vnd.github.v3+json",
   authorization: `token ${gt.token}`
  },
  body: JSON.stringify({
   content: `${postcontent}`,
   message: 'posted via web',
   branch: '{{ site.github.branch }}'
  })
 };
 let response = await fetch(url, putFile);
 if (!response.ok) {
  throw Error(response.status + ' ' + response.statusText)
 } else {
  let data = await response.json();
  return data;
 }
}
go.onclick = async function() {
 try {
  let urlnp = post_file() + '.md';
  urlnp = API_NEW_POST + urlnp;
  let postcontent = gathertext();
  await fetchAsync(urlnp, postcontent).then(data => function(data) {
   console.log(data.content);
  }) let container1 = document.querySelector('#container1');
  container1.innerHTML = '<h2>Successfully posted to {{ site.title }}</h2';
 } catch (reason) {
  var msg = '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><p>';
  msg += reason.message + '</p>';
  messages.insertAdjacentHTML('beforeend', msg);
 }
}
upimg.onchange = async function() {
 $('#selectimages').modal('hide');
 $('#loader').css("display", "block");
 try {
  urlnp = API_NEW_IMG + upimg.files.item(0).name;
  let postcontent = await getBase64(upimg.files.item(0));
  console.log("b64: " + postcontent);
  await fetchAsync(urlnp, postcontent).then(data => function(data) {
   console.log(data.content);
  })
  $('#loader').css("display", "none");
 } catch (reason) {
  var msg = '<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><p>';
  msg += reason.message + '</p>';
  messages.insertAdjacentHTML('beforeend', msg);
 }
}
