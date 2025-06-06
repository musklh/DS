import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoginUserStore = defineStore('loginUser', () => {
    let loginUser = ref(localStorage.getItem("userLoginStatus") || ""); // 直接初始化

    function fetchLoginUser() {
        loginUser.value = localStorage.getItem("userLoginStatus") || ""; // 赋值给 `ref`
    }

    function logoutUser() {
        localStorage.removeItem("userLoginStatus");
        loginUser.value = ""; // 确保 `loginUser` 也清空
    }

    return { loginUser, fetchLoginUser, logoutUser }
})
