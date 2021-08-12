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

function storageList(page, limit, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/admin/storage?page=${page}&limit=${limit}`)
    .then((resp) => resolve(resp.data))
    .catch(() => {
      reject();
    });
}

function allStorageList(resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/admin/storage/all`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function allStorageTypes(resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/admin/storage/all/types`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function findStorageById(sid, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/admin/storage/${sid}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function newStorage(storage, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .post(`${config.url}/api/admin/storage`, storage)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function updateStorage(sid, storage, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .put(`${config.url}/api/admin/storage/${sid}`, storage)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function deleteStorage(sid, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .delete(`${config.url}/api/admin/storage/${sid}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function activeStorage(sid, active, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  var bodyFormData = new FormData();
  bodyFormData.append("active", active);
  axios
    .post(`${config.url}/api/admin/storage/active/${sid}`, bodyFormData)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function defaultStorage(sid, setDefault, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  var bodyFormData = new FormData();
  bodyFormData.append("default", setDefault);
  axios
    .post(`${config.url}/api/admin/storage/default/${sid}`, bodyFormData)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function CRList(page, limit, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/admin/cr?page=${page}&limit=${limit}`)
    .then((resp) => resolve(resp.data))
    .catch(() => {
      reject();
    });
}

function allCRList(resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/admin/cr/all`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function allCRTypes(resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/admin/cr/all/types`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function findCRById(sid, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/admin/cr/${sid}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function newCR(cr, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .post(`${config.url}/api/admin/cr`, cr)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function updateCR(sid, cr, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};

  axios
    .put(`${config.url}/api/admin/cr/${sid}`, cr)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function deleteCR(sid, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .delete(`${config.url}/api/admin/cr/${sid}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function defaultCR(sid, setDefault, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  var bodyFormData = new FormData();
  bodyFormData.append("default", setDefault);
  axios
    .post(`${config.url}/api/admin/cr/default/${sid}`, bodyFormData)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function userList(query, page, limit, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(
      `${config.url}/api/admin/user?query=${query}&page=${page}&limit=${limit}`
    )
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function findUserById(userId, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/admin/user/${userId}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function newUser(user, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .post(`${config.url}/api/admin/user`, {
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
    .put(`${config.url}/api/admin/user/${userId}`, {
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
    .delete(`${config.url}/api/admin/user/${uid}`)
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
    .post(`${config.url}/api/admin/user/enable`, bodyFormData)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function groupList(query, page, limit, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(
      `${config.url}/api/admin/group?query=${query}&page=${page}&limit=${limit}`
    )
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function groupUserList(gid, query, page, limit, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(
      `${config.url}/api/admin/group/users/${gid}?query=${query}&page=${page}&limit=${limit}`
    )
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function groupAll(resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/admin/group/all`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function findGroupById(groupId, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/admin/group/${groupId}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function findFreeUser(query, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/admin/group/freeuser?query=${query}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function deleteGroup(groupId, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .delete(`${config.url}/api/admin/group/${groupId}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function newGroup(group, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .post(`${config.url}/api/admin/group`, {
      name: group.name,
      storageQuota: parseInt(group.storageQuota),
      trafficQuota: parseInt(group.trafficQuota),
      maxFileSize: parseInt(group.maxFileSize),
      allowFileExtension: group.allowFileExtension,
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
    .put(`${config.url}/api/admin/group/${groupId}`, {
      name: group.name,
      storageQuota: parseInt(group.storageQuota),
      trafficQuota: parseInt(group.trafficQuota),
      maxFileSize: parseInt(group.maxFileSize),
      allowFileExtension: group.allowFileExtension,
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
    .post(`${config.url}/api/admin/group/user/${gid}/${uid}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function deleteUserFromGroup(gid, uid, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .delete(`${config.url}/api/admin/group/user/${gid}/${uid}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function getGlobalSetting(type, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/admin/setting/${type}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function setGlobalSetting(type, setting, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .put(`${config.url}/api/admin/setting/${type}`, setting)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function userStatinfo(userId, time, beginTime, endTime, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(
      `${config.url}/api/admin/stat/${userId}?time=${time}&beginTime=${beginTime}&endTime=${endTime}`
    )
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function totalStatinfo(time, beginTime, endTime, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(
      `${config.url}/api/admin/stat?time=${time}&beginTime=${beginTime}&endTime=${endTime}`
    )
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function topStatinfo(beginTime, endTime, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(
      `${config.url}/api/admin/stat/top?beginTime=${beginTime}&endTime=${endTime}`
    )
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function visitDataStatinfo(beginTime, endTime, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(
      `${config.url}/api/admin/stat/visitdata?beginTime=${beginTime}&endTime=${endTime}`
    )
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function regionStatinfo(beginTime, endTime, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(
      `${config.url}/api/admin/stat/region?beginTime=${beginTime}&endTime=${endTime}`
    )
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function dayStatinfo(resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(
      `${config.url}/api/admin/stat/dayinfo`
    )
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}


function monitorList( resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/admin/monitor`)
    .then((resp) => resolve(resp.data))
    .catch(() => {
      reject();
    });
}

function allMonitorTypes(resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/admin/monitor/all/types`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function findMonitorById(sid, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/admin/monitor/${sid}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function newMonitor(monitor, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .post(`${config.url}/api/admin/monitor`, monitor)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function updateMonitor(sid, monitor, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .put(`${config.url}/api/admin/monitor/${sid}`, monitor)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function deleteMonitor(sid, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .delete(`${config.url}/api/admin/monitor/${sid}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function activeMonitor(sid, active, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  var bodyFormData = new FormData();
  bodyFormData.append("active", active);
  axios
    .post(`${config.url}/api/admin/monitor/active/${sid}`, bodyFormData)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}

function monitorData(sid, resolve, reject) {
  resolve = resolve || function() {};
  reject = reject || function() {};
  axios
    .get(`${config.url}/api/admin/monitor/info/${sid}`)
    .then((resp) => resolve(resp.data))
    .catch((err) => reject(err));
}



export {
  storageList,
  findStorageById,
  newStorage,
  updateStorage,
  deleteStorage,
  activeStorage,
  defaultStorage,
  allStorageList,
  allStorageTypes,
  CRList,
  findCRById,
  newCR,
  updateCR,
  deleteCR,
  defaultCR,
  allCRList,
  allCRTypes,
  userList,
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
  getGlobalSetting,
  setGlobalSetting,
  userStatinfo,
  totalStatinfo,
  topStatinfo,
  visitDataStatinfo,
  dayStatinfo,
  regionStatinfo,
  monitorList,
  allMonitorTypes,
  findMonitorById,
  newMonitor,
  updateMonitor,
  deleteMonitor,
  activeMonitor,
  monitorData
};
