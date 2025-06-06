import { useLoginUserStore } from "./stores/LoginStore.ts";
import { ElMessage } from "element-plus";
import router from "./router";

router.beforeEach((to, from, next) => {
  const loginUserStore = useLoginUserStore();
  loginUserStore.fetchLoginUser(); // 重新获取登录状态

  // if (!loginUserStore.loginUser) {
  //   if (to.path !== "/login") {
  //     ElMessage.error('未登录');
  //     return next("/login");
  //   }
  // }

  next();
});
