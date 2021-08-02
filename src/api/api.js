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

function storageList(page, limit, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/storage?page=${page}&limit=${limit}`)
    .then((resp) => resolve(resp.data))
    .catch(() => {
      reject();
    });
}

function allStorageList(resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/storage/all`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function findStorageById(sid, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/storage/${sid}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function newStorage(storage, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  storage.config.externUrls = storage.externUrls;
  storage.externUrls = null;
  axios
    .post(`${config.url}/api/storage`, storage)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function updateStorage(sid, storage, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  storage.config.externUrls = storage.externUrls;
  storage.externUrls = null;
  axios
    .put(`${config.url}/api/storage/${sid}`, storage)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function deleteStorage(sid, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .delete(`${config.url}/api/storage/${sid}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function activeStorage(sid, active, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  var bodyFormData = new FormData();
  bodyFormData.append("active", active);
  axios
    .post(`${config.url}/api/storage/active/${sid}`, bodyFormData)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function defaultStorage(sid, setDefault, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  var bodyFormData = new FormData();
  bodyFormData.append("default", setDefault);
  axios
    .post(`${config.url}/api/storage/default/${sid}`, bodyFormData)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function userList(query, page, limit, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/user?query=${query}&page=${page}&limit=${limit}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function myInfo(resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/user/my`)
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

function findUserById(userId, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/user/${userId}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function newUser(user, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .post(`${config.url}/api/user`, {
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.password,
      storageQuota: parseInt(user.storageQuota),
      trafficQuota: parseInt(user.trafficQuota),
      groupId: user.groupId,
    })
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function updateUser(userId, newuser, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .put(`${config.url}/api/user/${userId}`, {
      email: newuser.email,
      role: newuser.role,
      password: newuser.password,
      storageQuota: parseInt(newuser.storageQuota),
      trafficQuota: parseInt(newuser.trafficQuota),
      groupId: newuser.groupId,
    })
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function deleteUser(uid, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .delete(`${config.url}/api/user/${uid}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function enableUser(userId, enable, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  var bodyFormData = new FormData();
  bodyFormData.append("userId", userId);
  bodyFormData.append("enable", enable);
  axios
    .post(`${config.url}/api/user/enable`, bodyFormData)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function groupList(query, page, limit, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/group?query=${query}&page=${page}&limit=${limit}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function groupUserList(gid, query, page, limit, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(
      `${config.url}/api/group/users/${gid}?query=${query}&page=${page}&limit=${limit}`
    )
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function groupAll(resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/group/all`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function findGroupById(groupId, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/group/${groupId}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function findFreeUser(query, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/group/freeuser?query=${query}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function deleteGroup(groupId, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .delete(`${config.url}/api/group/${groupId}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function newGroup(group, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .post(`${config.url}/api/group`, {
      name: group.name,
      storageQuota: parseInt(group.storageQuota),
      trafficQuota: parseInt(group.trafficQuota),
      groupStorages: [
        {
          storageId: group.storageId,
          allowUseExternUrl: group.allowUseExternUrl,
        },
      ],
    })
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function updateGroup(groupId, group, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .put(`${config.url}/api/group/${groupId}`, {
      name: group.name,
      storageQuota: parseInt(group.storageQuota),
      trafficQuota: parseInt(group.trafficQuota),
      groupStorages: [
        {
          storageId: group.storageId,
          allowUseExternUrl: group.allowUseExternUrl,
        },
      ],
    })
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function addUserToGroup(gid, uid, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .post(`${config.url}/api/group/user/${gid}/${uid}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function deleteUserFromGroup(gid, uid, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .delete(`${config.url}/api/group/user/${gid}/${uid}`)
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

function userStatinfo(userId, time, beginTime, endTime, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(
      `${config.url}/api/stat/${userId}?time=${time}&beginTime=${beginTime}&endTime=${endTime}`
    )
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function totalStatinfo(time, beginTime, endTime, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(
      `${config.url}/api/stat?time=${time}&beginTime=${beginTime}&endTime=${endTime}`
    )
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


export {
  siteInfo,
  storageList,
  findStorageById,
  newStorage,
  updateStorage,
  deleteStorage,
  activeStorage,
  defaultStorage,
  allStorageList,
  userList,
  myInfo,
  updateMyInfo,
  findUserById,
  findFreeUser,
  newUser,
  updateUser,
  deleteUser,
  enableUser,
  groupList,
  groupUserList,
  groupAll,
  findGroupById,
  deleteGroup,
  newGroup,
  updateGroup,
  addUserToGroup,
  deleteUserFromGroup,
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
  getSetting,
  setSetting,
  login,
  userStatinfo,
  totalStatinfo,
  uploadFile,
  downloadTaskList,
  getDownloadTaskByUUID,
  submitDownloadTask
};
