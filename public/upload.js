let uploadArea;
let uploadFileCards;
let loginButton;
let registerButton;
let username;
let avatarImg;
let allowUploadTips;
let wellcomeText;
let uploadMaxFileSize;
let allowUploadFileExtension = "";
let icp;

window.onload = () => {
  uploadArea = document.getElementById("upload-box");
  uploadFileCards = document.getElementById("upload-files");
  loginButton = document.getElementsByClassName("login-button")[0];
  registerButton = document.getElementsByClassName("register-button")[0];
  username = document.getElementsByClassName("username")[0];
  avatarImg = document.getElementsByClassName("avatarImg")[0];
  allowUploadTips = document.getElementsByClassName("allow-upload-tips")[0];
  wellcomeText = document.getElementById("wellcomeText");
  uploadMaxFileSize = 0;
  allowUploadFileExtension = "";
  icp = document.getElementById("icp");

  let siteInfo = getCookie("siteinfo");
  if (siteInfo) {
    resetUI(JSON.parse(siteInfo));
  }

  ajaxGetSiteInfo(
    (data) => {
      //先获取站点信息
      if (data.code === 200) {
        let siteinfo = data.data.site;
        let uploadInfo = data.data.upload;
        setCookie("siteinfo", siteinfo, 365);
        resetUI(JSON.stringify(siteinfo));

        ajaxGetMyInfo(
          (data) => {
            let user = data.data.user;
            username.innerText = user.nickName || user.name;
            avatarImg.src = user.avatar;
            username.style.display = "inline-block";
            avatarImg.style.display = "block";

            let group = data.data.group;
            showUploadTips(group.allowFileExtension, group.maxFileSize);
            addUploadEventListener();
            uploadMaxFileSize = group.maxFileSize * 1024 * 1024;
            allowUploadFileExtension = group.allowFileExtension;
          },
          (reason) => {
            // 用户没有登录
            if (siteinfo.allowRegister) {
              registerButton.style.display = "inline-block";
            }
            loginButton.style.display = "inline-block";

            if (uploadInfo.allowAnonymousUpload) {
              addUploadEventListener();
              showUploadTips(
                uploadInfo.allowFileExtension,
                uploadInfo.maxFileSize
              );
              uploadMaxFileSize = uploadInfo.maxFileSize * 1024 * 1024;
              allowUploadFileExtension = uploadInfo.allowFileExtension;
            } else {
              allowUploadTips.innerText = "当前站点不允许匿名上传";
            }
          }
        );
      }
    },
    (reason) => {}
  );
};

function resetUI(ui) {
  let bgColor = ui.bgColor;
  let bgImage = ui.bgImage;
  let bgIsImage = ui.bgIsImage;
  let bgMobileImage = ui.bgMobileImage;
  let footBarTextColor = ui.footBarTextColor;
  let footBarBGColor = ui.footBarBGColor;
  let logo = ui.logo;
  let navBarBgColor = ui.navBarBgColor;
  let navBarTextColor = ui.navBarTextColor;
  let uploadBoxBgColor = ui.uploadBoxBgColor;
  let uploadBoxTextColor = ui.uploadBoxTextColor;
  let welcomeTextContent = ui.welcomeText;
  let welcomeTextBGColor = ui.welcomeTextBGColor;
  let welcomeTextColor = ui.welcomeTextColor;
  let icpText = ui.icp;
  let legalStatement = ui.legalStatement;
  let siteTitle = ui.siteTitle;

  if (bgIsImage && bgImage && !isMobile()) {
    document.getElementById("fullscreen").style.backgroundImage =
      "url(" + bgImage + ")";
  } else if (bgIsImage && (bgImage || bgMobileImage) && isMobile()) {
    if (bgMobileImage) {
      document.getElementById("fullscreen").style.backgroundImage =
        "url(" + bgMobileImage + ")";
    } else {
      document.getElementById("fullscreen").style.backgroundImage =
        "url(" + bgImage + ")";
    }
  } else if (bgColor) {
    document.getElementById("fullscreen").style.background = bgColor;
  }

  let navbar = document.getElementById("nav");
  if (navBarBgColor) {
    navbar.style.background = navBarBgColor;
  }

  if (logo) {
    document.getElementById("logo").src = logo;
  }

  if (navBarTextColor) {
    let links = navbar.getElementsByTagName("a");
    for (let link of links) {
      link.style.color = footBarTextColor;
    }
  }

  let wellcomeText = document.getElementById("wellcomeText");
  if (welcomeTextBGColor) {
    wellcomeText.style.background = welcomeTextBGColor;
  }

  if (welcomeTextColor) {
    wellcomeText.style.color = welcomeTextColor;
  }

  if (welcomeTextContent) {
    wellcomeText.innerHTML = welcomeTextContent;
    wellcomeText.style.display = "block";
  }

  if (icpText) {
    icp.innerHTML = `备案号:&nbsp;<a href="https://beian.miit.gov.cn/" target="_blank">${icpText}</a> &nbsp;&nbsp;`;
    icp.style.display = "inline-block";
  }

  let uploadArea = document.getElementById("upload-area");
  if (uploadBoxBgColor) {
    uploadArea.style.background = uploadBoxBgColor;
  }

  if (uploadBoxTextColor) {
    uploadArea.style.color = uploadBoxTextColor;
  }

  let foot = document.getElementById("foot");
  if (footBarBGColor) {
    foot.style.background = footBarBGColor;
  }

  if (footBarTextColor) {
    foot.style.color = footBarTextColor;
    let links = foot.getElementsByTagName("a");
    for (let link of links) {
      link.style.color = footBarTextColor;
    }
  }

  if (legalStatement) {
    document.getElementById("legalStatement").innerHTML = legalStatement;
  }

  if (siteTitle) {
    document.title = siteTitle;
  }
}

function addUploadEventListener() {
  uploadArea.addEventListener("click", () => {
    let fileInput = document.createElement("input");
    fileInput.setAttribute("type", "file");
    fileInput.setAttribute("style", "visibility:hidden");
    fileInput.setAttribute("multiple", "multiple");
    fileInput.addEventListener("change", function() {
      for (let i = 0; i < this.files.length && i < 10; i++) {
        uploadFile(this.files[i]);
      }
    });
    fileInput.click();
  });

  document.addEventListener("paste", () => {
    var items = event.clipboardData && event.clipboardData.items;
    var file = null;
    if (items && items.length) {
      // 检索剪切板items
      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          file = items[i].getAsFile();
          uploadFile(file, false);
          break;
        }
      }
    }
  });
}

function showUploadTips(allowFileExtension, maxFileSize) {
  let uploadTipText = "";
  if (allowFileExtension === "*") {
    uploadTipText = `可以上传任意文件，文件大小不能超过${maxFileSize}M`;
  } else {
    uploadTipText = `只允许上传${allowFileExtension}后缀的文件，且文件大小不能超过${maxFileSize}M`;
  }
  allowUploadTips.innerText = uploadTipText;
}

let fileIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAB4CAMAAABCfAldAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ2MCwgMjAyMC8wNS8xMi0xNjowNDoxNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyM0Y1MDQ4MENDMjExRUM4REU0OEE1MDU4MDcwQzc0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyM0Y1MDQ5MENDMjExRUM4REU0OEE1MDU4MDcwQzc0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDIzRjUwNDYwQ0MyMTFFQzhERTQ4QTUwNTgwNzBDNzQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDIzRjUwNDcwQ0MyMTFFQzhERTQ4QTUwNTgwNzBDNzQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6iYlHBAAAABlBMVEX+/v5iaXSzRjSLAAABHUlEQVR42uyZ0RLCIAwEc///0/qqY63QJJx091Vnsl4wLRABAAAAAHAndAyC53Jf/Z6Gsg3PIsc9/NY5ylxQQ6zXO/l8ueDwL+jUi8/TTrFuJP4azaIMB8q6+71+29JvgeBw27oVh+u1Zzhcb1WEYe6n8DScKdZpOFmrz3BOUAjuLsgaRPCWazBo8cxZ1uQ2LVtQs3StwXRBmwQP67sLGiWofxTMHzLuflsnqJYHcaqfzFusKHgMZyZY8p6Ql2DRCWuNn2OCVUfUGX6ltxAZCZbek+iSod5vSPJf9JWOuWDl1i3FT96CtZvf6+FZCzYcH+wn2HsVsqFgkCAJkiBjhhYjSItJkAQZM7SYFtNiEuRPcvcWAwAAAACs4yHAAA0nERye1c/2AAAAAElFTkSuQmCC`;
let badImageIcon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAB4CAMAAABCfAldAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDAyIDc5LjE2NDQ2MCwgMjAyMC8wNS8xMi0xNjowNDoxNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjM0QTA4QkQ2MENDMjExRUM4OThGRTU2MEI2QTREQUFGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjM0QTA4QkQ3MENDMjExRUM4OThGRTU2MEI2QTREQUFGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MzRBMDhCRDQwQ0MyMTFFQzg5OEZFNTYwQjZBNERBQUYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MzRBMDhCRDUwQ0MyMTFFQzg5OEZFNTYwQjZBNERBQUYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5PRbecAAAABlBMVEX+/v5iaXMtIqEoAAABfElEQVR42uybSQ6EMAwEu///6TmjCVm9BXUd0cguGRIShwGEEEIIIYQQog/J5sU+EWLoZCMTFYlxqhxBYjoXGapILCZioOBWIsYZbuVhnOBmnjDBiRw8iOpbQfA4qo8e7OKaF9Dw7WgtaP76NhZEdcG7KkicxrafZgaXKt1ikzHtMFE3553ygqwnSAkeDmOj9ZLHaqa9eFAFV2PVfQZZdZrpCqKgIE4FCesF8OvL2GAL4bN02wzu1lpoBSMs9BwFrTavRQSdu0dWc54EPXo7+XvESEGP3lhyBVlckLUFE7rotwu2GyQhByVT4f5bTPEHJeNf5QjOVJDvXbBAwfeArCLI4YDNmKixdOyVLvjcnqCbNOw8liuUF2S8IOlVwuxbDD2DEkwwzJioweqC8JkFJXilYMqK+gJBrAuyZgWRJAifAkrwPsHt30uw++lFyIfA3xBMGyKrgvyGINIEE/QmjmQi/t6wZVjAbNjjQjFFVHQTQgghhBBC3MhPgAEAWaMQfg/TFS4AAAAASUVORK5CYII=`;

function addUploadCard(file, callback) {
  callback = callback || function() {};
  let addCard = (imgUrl) => {
    let cardHtml = `<div class="upload-file-thumb">
                      <img width="160" height="120" src="${imgUrl}" onerror="this.src='${badImageIcon}'" >
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
      `;
    let card = document.createElement("div");
    card.className = "upload-file-card";
    card.innerHTML = cardHtml;
    uploadFileCards.prepend(card);
    let progressBar = card.getElementsByClassName("progress-bar")[0];
    let errReason = card.getElementsByClassName("errorReason")[0];
    let uploadErrorCover = card.getElementsByClassName("upload-error-cover")[0];
    let fileLinks = card.getElementsByClassName("file-links")[0];
    callback(
      (percent) => {
        progressBar.style.width = percent + "%";
      },
      (path) => {
        progressBar.style.background = "#67C23A";
        card.setAttribute("path", path);
        ajaxGetFile(
          path,
          (data) => {
            let urls = data.data.urls;
            for (let url of urls) {
              let inputDiv = document.createElement("div");
              inputDiv.style.position = "relative";
              inputDiv.innerHTML = `<input class="link" readonly value="${url}" /><span class="copytip" style="display:none">复制成功</span>`;
              inputDiv.addEventListener("click", () => {
                copyText(
                  url,
                  () => {
                    let copyTips = inputDiv.getElementsByClassName(
                      "copytip"
                    )[0];
                    copyTips.style.display = "inline-block";
                    setTimeout(() => {
                      copyTips.style.display = "none";
                    }, 3000);
                  },
                  () => {}
                );
              });
              fileLinks.append(inputDiv);
            }
          },
          (reason) => {
            errReason.innerText = reason;
            uploadErrorCover.style.display = "block";
          }
        );
      },
      (reason) => {
        progressBar.style.background = "#F56C6C";
        errReason.innerText = reason;
        uploadErrorCover.style.display = "block";
      }
    );
  };
  let fileType = file.type;
  if (fileType.indexOf("image/") === 0) {
    // 这是一个图片
    let reader = new FileReader();
    reader.onload = (event) => {
      let base64Str = event.target.result;
      addCard(base64Str);
    };
    reader.readAsDataURL(file);
  } else {
    addCard(fileIcon);
  }
}

function copyText(text, success, error) {
  success = success || function() {};
  error = error || function() {};
  let input = document.createElement("input");
  input.value = text;
  input.style.width = "1px";
  document.body.append(input);
  input.select();
  if (document.execCommand("copy")) {
    success();
  } else {
    error();
  }
  document.body.removeChild(input);
}

function uploadFile(file, hasname) {
  hasname = hasname === undefined ? true : hasname;
  addUploadCard(file, (setProgress, uploadSuccess, uploadError) => {
    // 检查是否允许上传
    let size = file.size;
    let name = file.name;
    if (size > uploadMaxFileSize) {
      uploadError("超过了上传文件最大限制");
      return;
    }
    if (allowUploadFileExtension !== "*") {
      extensions = allowUploadFileExtension.split(",");
      let pass = false;
      for (let extension of extensions) {
        if (name.lastIndexOf(extension) === name.length - extension.length) {
          pass = true;
          break;
        }
      }
      if (!pass) {
        uploadError("不允许上传此后缀");
        return;
      }
    }

    ajaxUploadFile(file, hasname, setProgress, uploadSuccess, uploadError);
  });
}

function ajaxGetSiteInfo(callback, errCallback) {
  callback = callback || function() {};
  errCallback = errCallback || function() {};
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      if (request.status === 200) {
        let resp = JSON.parse(request.response);
        callback(resp);
      } else {
        let resp = JSON.parse(request.response);
        errCallback(resp.reason);
      }
    }
  };
  request.open("GET", `${window.globalConfig.url}/siteinfo`, true);
  request.send();
}

function ajaxGetMyInfo(callback, errCallback) {
  callback = callback || function() {};
  errCallback = errCallback || function() {};
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      if (request.status === 200) {
        let resp = JSON.parse(request.response);
        callback(resp);
      } else {
        let resp = JSON.parse(request.response);
        errCallback(resp.reason);
      }
    }
  };
  request.open("GET", `${window.globalConfig.url}/api/user/my`, true);
  request.setRequestHeader("authorization", getCookie("authorization"));
  request.send();
}

function ajaxGetFile(path, callback, errCallback) {
  callback = callback || function() {};
  errCallback = errCallback || function() {};
  let request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      if (request.status === 200) {
        let resp = JSON.parse(request.response);
        callback(resp);
      } else {
        let resp = JSON.parse(request.response);
        errCallback(resp.reason);
      }
    }
  };
  request.open(
    "GET",
    `${window.globalConfig.url}/api/file/file?path=${path}`,
    true
  );
  request.setRequestHeader("authorization", getCookie("authorization"));
  request.send();
}

function ajaxUploadFile(
  file,
  hasname,
  setProgress,
  uploadSuccess,
  uploadError
) {
  let formData = new FormData();
  formData.append("file", file);
  formData.append("noname", !hasname);
  formData.append("changeName", hasname);

  let request = new XMLHttpRequest();
  request.open("POST", `${window.globalConfig.url}/file/upload`);
  request.setRequestHeader("authorization", getCookie("authorization"));
  request.upload.addEventListener("progress", (e) => {
    let percent_complete = (e.loaded / e.total) * 100;
    setProgress(percent_complete);
  });

  request.addEventListener("load", (e) => {
    let resp = JSON.parse(request.response);
    if (request.status === 200) {
      let filePath = `${resp.data.filePath}/${resp.data.fileName}`;
      uploadSuccess(filePath);
    } else {
      uploadError(resp.reason);
    }
  });

  request.send(formData);
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function isMobile() {
  var userAgentInfo = navigator.userAgent;
  var mobileAgents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];
  var mobile_flag = false;
  for (var v = 0; v < mobileAgents.length; v++) {
    if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
      mobile_flag = true;
      break;
    }
  }
  var screen_width = window.screen.width;
  var screen_height = window.screen.height;
  if (screen_width < 500 && screen_height < 800) {
    mobile_flag = true;
  }
  return mobile_flag;
}
