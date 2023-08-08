import { reactive } from "vue";
import { getUserInfo } from "@/api/user";
import { getSonFile } from "@/api/file";
import { ElMessage } from "element-plus";

export const store = reactive({
  navList: {},
})

//保存用户信息
const getUser = () => {
  return getUserInfo()
    .then(function (res) {
      //console.log('getUser')
      let data = res.data.data;
      Reflect.set(store, 'userName', data.account);
      Reflect.set(store, 'libraryId', data.libraryId);
      Reflect.set(store, 'auth', data.auth);
      return data.libraryId
    })
    .catch((err) => console.log("can't not get userInfo:"+err));
};

//获取菜单信息
const getMenu = (libraryId) => {
  if( libraryId == 0 ) return;
  let params = {
    parentId: libraryId,
    pageNum: 1,
    pageSize: 10
  }
  return getSonFile(params)
    .then(function (res) {
      //加载目录id
      //console.log('getMenu')
      let data = res.data.data.list;
      data.forEach(el => {
        store.navList[el.fileName] = el.id;
      });
    })
    .catch((err) => console.log("can't not get menuInfo:"+err));
};

export function initStore() {
    return getUser().then(res => {
      getMenu(res);
    })
}


