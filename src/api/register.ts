// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 注册新用户 POST /register/ */
export async function registerCreate(
  body: API.User,
  options?: { [key: string]: any }
) {
  return request<API.User>("/register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
