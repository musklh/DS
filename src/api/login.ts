import request from "../request";

/** 用户登录 POST /login/ */
export async function loginCreate(
  body: API.Login,
  options?: { [key: string]: any }
) {
  return request<any>("/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
