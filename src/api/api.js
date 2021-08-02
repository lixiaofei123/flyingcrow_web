const axios = require("axios");
var cookies = require("vue-cookie");

const config = {
  url: window.globalConfig.url,
};

axios.interceptors.request.use(
  (config) => {
    let authorization = cookies.get("authorization");
    if (authorization !== "") {
      config.headers["authorization"] = authorization;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (error.response) {
      if (error.response.status === 401) {
        let href = window.location.href;
        if (
          href.indexOf("/login") !== -1 ||
          href.indexOf("/index") !== -1 ||
          href.indexOf("/register") !== -1
        ) {
          return Promise.reject(error.response.data);
        } else {
          window.location = "#/login";
        }
      } else if (error.response.status === 401) {
      } else {
        if (error.response.data) {
          return Promise.reject(error.response.data);
        }
      }
    }
    return Promise.reject(error);
  }
);

function siteInfo(resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/siteinfo`)
    .then((resp) => resolve(resp.data))
    .catch(() => {
      reject();
    });
}

function myInfo(resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/user/my`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function myStatinfo(time, beginTime, endTime, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(
      `${config.url}/api/stat/?time=${time}&beginTime=${beginTime}&endTime=${endTime}`
    )
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}


function updateMyInfo(user, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .put(`${config.url}/api/user/my`, {
      email: user.email,
      avatar: user.avatar,
      mood: user.mood,
      password: user.password,
      nickName: user.nickName
    })
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function tokenList(page, limit, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/token?page=${page}&limit=${limit}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function findTokenById(tid, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/token/${tid}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function newToken(expireTime, permission, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  var bodyFormData = new FormData();
  bodyFormData.append("expireTime", expireTime);
  bodyFormData.append("permission", permission);
  axios
    .post(`${config.url}/api/token`, bodyFormData)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function updateToken(token, expireTime, permission, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  var bodyFormData = new FormData();
  bodyFormData.append("token", token);
  bodyFormData.append("expireTime", expireTime);
  bodyFormData.append("permission", permission);
  axios
    .put(`${config.url}/api/token`, bodyFormData)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function enableToken(token, enable, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  var bodyFormData = new FormData();
  bodyFormData.append("token", token);
  bodyFormData.append("enable", enable);
  axios
    .post(`${config.url}/api/token/enable`, bodyFormData)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function fileList(path, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/file/list?path=${path}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function mkDir(path, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  var bodyFormData = new FormData();
  bodyFormData.append("path", path);
  axios
    .post(`${config.url}/api/file/mkdir`, bodyFormData)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function fileInfo(path, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/file/file?path=${path}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function fileInfoById(fileId, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/file/${fileId}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}


function deleteFile(fileId, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .delete(`${config.url}/api/file/${fileId}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function login(username, password, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  var bodyFormData = new FormData();
  bodyFormData.append("username", username);
  bodyFormData.append("password", password);
  axios
    .post(`${config.url}/user/login`, bodyFormData)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function register(username, email,password, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .post(`${config.url}/user/register`, {
      name: username,
      email: email,
      password: password
    })
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}



function uploadFile(file, path, uploadProgress, resolve, reject) {
  uploadProgress = uploadProgress || function() {};
  resolve = resolve || function() {};
  reject = reject || function() {};
  var formData = new FormData();
  formData.append("file", file);
  formData.append("path", path);
  formData.append("changeName", "false");
  axios
    .post(`${config.url}/file/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "*/*",
      },
      onUploadProgress: (progressEvent) => {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        uploadProgress(percentCompleted);
      },
    })
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function downloadTaskList(page, limit, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/download?page=${page}&limit=${limit}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function getDownloadTaskByUUID( uuid, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/download/${uuid}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function submitDownloadTask(url, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  var formData = new FormData();
  formData.append("url", url);
  axios
    .post(`${config.url}/api/download`,formData)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function getSetting(type, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/setting/${type}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function setSetting(type, setting, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .put(`${config.url}/api/setting/${type}`, setting)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

export {
  siteInfo,
  myInfo,
  updateMyInfo,
  tokenList,
  findTokenById,
  newToken,
  updateToken,
  enableToken,
  fileList,
  fileInfoById,
  mkDir,
  fileInfo,
  deleteFile,
  login,
  uploadFile,
  downloadTaskList,
  getDownloadTaskByUUID,
  submitDownloadTask,
  getSetting,
  setSetting,
  myStatinfo,
  register
};
