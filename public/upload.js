let uploadArea = document.getElementById("upload-box")
let uploadFileCards = document.getElementById("upload-files")
let loginButton = document.getElementsByClassName("login-button")[0]
let registerButton = document.getElementsByClassName("register-button")[0]
let username = document.getElementsByClassName("username")[0]
let avatarImg = document.getElementsByClassName("avatarImg")[0]
let allowUploadTips = document.getElementsByClassName("allow-upload-tips")[0]
let wellcomeText = document.getElementById("wellcomeText")
let uploadMaxFileSize = 0;
let allowUploadFileExtension = ""
let icp = document.getElementById("icp")


window.onload = () => {

  ajaxGetSiteInfo(data => {
    //先获取站点信息
    if (data.code === 200) {
      let siteinfo = data.data.site
      let uploadInfo = data.data.upload

      resetUI(siteinfo)

      ajaxGetMyInfo(data => {
        let user = data.data.user
        username.innerText = user.nickName || user.name
        avatarImg.src = user.avatar
        username.style.display = "inline-block"
        avatarImg.style.display = "block"

        let group = data.data.group
        showUploadTips(group.allowFileExtension, group.maxFileSize)
        addUploadEventListener();
        uploadMaxFileSize = group.maxFileSize * 1024 * 1024
        allowUploadFileExtension = group.allowFileExtension
      }, reason => {
        // 用户没有登录
        if (siteinfo.allowRegister) {
          registerButton.style.display = "inline-block"
        }
        loginButton.style.display = "inline-block"
        
        if (uploadInfo.allowAnonymousUpload) {
          addUploadEventListener();
          showUploadTips(uploadInfo.allowFileExtension, uploadInfo.maxFileSize)
          uploadMaxFileSize = uploadInfo.maxFileSize * 1024 * 1024
          allowUploadFileExtension = uploadInfo.allowFileExtension
        } else {
          allowUploadTips.innerText = "当前站点不允许匿名上传"
        }
      })
    }
  }, reason => {

  })


}

function resetUI(ui) {
  
  let bgColor = ui.bgColor;
  let bgImage = ui.bgImage;
  let bgIsImage =  ui.bgIsImage;
  let footBarTextColor = ui.footBarTextColor;
  let footBarBGColor =  ui.footBarBGColor;
  let logo = ui.logo;
  let navBarBgColor = ui.navBarBgColor;
  let navBarTextColor = ui.navBarTextColor;
  let uploadBoxBgColor = ui.uploadBoxBgColor;
  let uploadBoxTextColor = ui.uploadBoxTextColor;
  let welcomeTextContent = ui.welcomeText;
  let welcomeTextBGColor = ui.welcomeTextBGColor;
  let welcomeTextColor = ui.welcomeTextColor;
  let icpText = ui.icp
  let legalStatement = ui.legalStatement
  let siteTitle = ui.siteTitle

  if(bgIsImage && bgImage){
    document.getElementById("fullscreen").style.background = 'url('+ bgImage + ')'
  }else if(bgColor){
    document.getElementById("fullscreen").style.background = bgColor
  }

  let navbar = document.getElementById("nav")
  if(navBarBgColor){
    navbar.style.background = navBarBgColor 
  }

  if(logo){
    document.getElementById("logo").src = logo
  }


  if(navBarTextColor){
    let links = navbar.getElementsByTagName("a")
    for(let link of links){
      link.style.color = footBarTextColor
    }
  }

  let wellcomeText = document.getElementById("wellcomeText")
  if(welcomeTextBGColor){
    wellcomeText.style.background = welcomeTextBGColor
  }

  if(welcomeTextColor){
    wellcomeText.style.color = welcomeTextColor
  }

  if (welcomeTextContent) {
    wellcomeText.innerHTML = welcomeTextContent
    wellcomeText.style.display = "block"
  }



  if (icpText) {
    icp.innerHTML =
      `备案号:&nbsp;<a href="https://beian.miit.gov.cn/" target="_blank">${icpText}</a> &nbsp;&nbsp;`
    icp.style.display = "inline-block"
  }

 

  let uploadArea = document.getElementById("upload-area")
  if(uploadBoxBgColor){
    uploadArea.style.background = uploadBoxBgColor
  }

  if(uploadBoxTextColor){
    uploadArea.style.color = uploadBoxTextColor
  }

  let foot = document.getElementById("foot")
  if(footBarBGColor){
    foot.style.background = footBarBGColor
  }

  if(footBarTextColor){
    foot.style.color = footBarTextColor
    let links = foot.getElementsByTagName("a")
    for(let link of links){
      link.style.color = footBarTextColor
    }
    
  }

  if(legalStatement){
      document.getElementById("legalStatement").innerHTML = legalStatement
  }

  if(siteTitle){
      document.title = siteTitle
  }

}

function addUploadEventListener() {
  uploadArea.addEventListener("click", () => {
    let fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("style", "visibility:hidden");
    fileInput.setAttribute("multiple", "multiple")
    fileInput.addEventListener("change", function () {
      for (let i = 0; i < this.files.length && i < 10; i++) {
        uploadFile(this.files[i])
      }
    });
    fileInput.click();
  })

  document.addEventListener("paste", () => {
    var items = event.clipboardData && event.clipboardData.items;
    var file = null;
    if (items && items.length) {
      // 检索剪切板items
      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          file = items[i].getAsFile();
          uploadFile(file, false)
          break;
        }
      }
    }
  });

}

function showUploadTips(allowFileExtension, maxFileSize) {
  let uploadTipText = ""
  if (allowFileExtension === "*") {
    uploadTipText = `可以上传任意文件，文件大小不能超过${maxFileSize}M`
  } else {
    uploadTipText = `只允许上传${allowFileExtension}后缀的文件，且文件大小不能超过${maxFileSize}M`
  }
  allowUploadTips.innerText = uploadTipText
}

function addUploadCard(file, callback) {
  callback = callback || function () {}
  let addCard = imgUrl => {
    let cardHtml = `<div class="upload-file-thumb">
                      <img width="160" height="120" src="${imgUrl}" >
                    </div>
                    <div class="file-links-box">
                      <div class="file-links">
                      </div>
                    </div>
                    <div class="upload-error-cover" style="display:none">
                      <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30"><path fill="red" d="M512 53.248c129.707008 3.412992 237.739008 48.299008 324.096 134.656S967.339008 382.292992 970.752 512c-3.412992 129.707008-48.299008 237.739008-134.656 324.096S641.707008 967.339008 512 970.752c-129.707008-3.412992-237.739008-48.299008-324.096-134.656S56.660992 641.707008 53.248 512c3.412992-129.707008 48.299008-237.739008 134.656-324.096S382.292992 56.660992 512 53.248z m0 403.456L405.504 350.208c-8.192-8.192-17.579008-12.288-28.16-12.288-10.580992 0-19.796992 3.924992-27.648 11.776-7.851008 7.851008-11.776 17.067008-11.776 27.648 0 10.580992 4.096 19.968 12.288 28.16l106.496 106.496-106.496 106.496c-8.192 8.192-12.288 17.579008-12.288 28.16 0 10.580992 3.924992 19.796992 11.776 27.648 7.851008 7.851008 17.067008 11.776 27.648 11.776 10.580992 0 19.968-4.096 28.16-12.288l106.496-106.496 106.496 106.496c10.923008 10.24 23.552 13.483008 37.888 9.728s23.380992-12.8 27.136-27.136c3.755008-14.336 0.512-26.964992-9.728-37.888L567.296 512l106.496-106.496c8.192-8.192 12.288-17.579008 12.288-28.16 0-10.580992-3.924992-19.796992-11.776-27.648-7.851008-7.851008-17.067008-11.776-27.648-11.776-10.580992 0-19.968 4.096-28.16 12.288L512 456.704z" ></path></svg>          
                      <div style="height:8px"></div>
                      <span class="errorReason"></span>
                    </div>
                    <div class="upload-progress">
                      <div class="progress-bar" style="width: 0%;"></div>
                    </div>
      `
    let card = document.createElement("div");
    card.className = "upload-file-card"
    card.innerHTML = cardHtml
    uploadFileCards.prepend(card)
    let progressBar = card.getElementsByClassName("progress-bar")[0]
    let errReason = card.getElementsByClassName("errorReason")[0]
    let uploadErrorCover = card.getElementsByClassName("upload-error-cover")[0]
    let fileLinks = card.getElementsByClassName("file-links")[0]
    callback((percent) => {
        progressBar.style.width = percent + '%'
      },
      (path) => {
        progressBar.style.background = "#67C23A"
        card.setAttribute("path", path)
        ajaxGetFile(path, data => {
          let urls = data.data.urls;
          for (let url of urls) {
            //<input class="link" disabled value="https://www.baidu.com"></input>  
            let urlInput = document.createElement("input")
            urlInput.className = "link"
            urlInput.setAttribute("readonly", "readonly")
            urlInput.value = url
            urlInput.addEventListener("click", () => {
              copyText(url, () => {
                console.log("复制成功")
              }, () => {
                console.log("复制失败")
              })
            })
            fileLinks.append(urlInput)
          }
        }, reason => {
          errReason.innerText = reason
          uploadErrorCover.style.display = "block"
        })
      },
      reason => {
        progressBar.style.background = "#F56C6C"
        errReason.innerText = reason
        uploadErrorCover.style.display = "block"
      },
    )
  }
  let fileType = file.type
  if (fileType.indexOf("image/") === 0) {
    // 这是一个图片
    let reader = new FileReader();
    reader.onload = (event) => {
      let base64Str = event.target.result;
      addCard(base64Str)

    };
    reader.readAsDataURL(file);
  } else {
    addCard("")
  }

}

function copyText(text, success, error) {
  success = success || function () {}
  error = error || function () {}
  let input = document.createElement("input")
  input.value = text
  input.style.width = "1px"
  document.body.append(input)
  input.select();
  if (document.execCommand("copy")) {
    success()
  } else {
    error()
  }
  document.body.removeChild(input)
}

function uploadFile(file, hasname) {
  hasname = hasname === undefined ? true : hasname
  addUploadCard(file, (setProgress, uploadSuccess, uploadError) => {
    // 检查是否允许上传
    let size = file.size
    let name = file.name
    if (size > uploadMaxFileSize) {
      uploadError("超过了上传文件最大限制")
      return
    }
    if (allowUploadFileExtension !== "*") {
      extensions = allowUploadFileExtension.split(",")
      let pass = false
      for (let extension of extensions) {
        if (name.lastIndexOf(extension) === (name.length - extension.length)) {
          pass = true
          break
        }
      }
      if (!pass) {
        uploadError("不允许上传此后缀")
        return
      }
    }

    ajaxUploadFile(file, hasname, setProgress, uploadSuccess, uploadError)
  })
}

function ajaxGetSiteInfo(callback, errCallback) {
  callback = callback || function () {}
  errCallback = errCallback || function () {}
  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      if (request.status === 200) {
        let resp = JSON.parse(request.response)
        callback(resp)
      } else {
        let resp = JSON.parse(request.response)
        errCallback(resp.reason)
      }

    }
  };
  request.open("GET", `${window.globalConfig.url}/siteinfo`, true);
  request.send();
}

function ajaxGetMyInfo(callback, errCallback) {
  callback = callback || function () {}
  errCallback = errCallback || function () {}
  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      if (request.status === 200) {
        let resp = JSON.parse(request.response)
        callback(resp)
      } else {
        let resp = JSON.parse(request.response)
        errCallback(resp.reason)
      }

    }
  };
  request.open("GET", `${window.globalConfig.url}/api/user/my`, true);
  request.setRequestHeader("authorization", getCookie("authorization"));
  request.send();
}

function ajaxGetFile(path, callback, errCallback) {
  callback = callback || function () {}
  errCallback = errCallback || function () {}
  let request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      if (request.status === 200) {
        let resp = JSON.parse(request.response)
        callback(resp)
      } else {
        let resp = JSON.parse(request.response)
        errCallback(resp.reason)
      }

    }
  };
  request.open("GET", `${window.globalConfig.url}/api/file/file?path=${path}`, true);
  request.setRequestHeader("authorization", getCookie("authorization"));
  request.send();
}

function ajaxUploadFile(file, hasname, setProgress, uploadSuccess, uploadError) {
  let formData = new FormData();
  formData.append("file", file);
  formData.append("noname", !hasname);
  formData.append("changeName", hasname);

  let request = new XMLHttpRequest();
  request.open('POST', `${window.globalConfig.url}/file/upload`);
  request.setRequestHeader("authorization", getCookie("authorization"));
  request.upload.addEventListener('progress', (e) => {
    let percent_complete = (e.loaded / e.total) * 100;
    setProgress(percent_complete)
  });

  request.addEventListener('load', (e) => {
    let resp = JSON.parse(request.response)
    if (request.status === 200) {
      let filePath = `${resp.data.filePath}/${resp.data.fileName}`
      uploadSuccess(filePath)
    } else {
      uploadError(resp.reason)
    }
  });

  request.send(formData);
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}