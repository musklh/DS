// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** 用户登录 POST /login/ */
export async function loginCreate(body: API.Login, options?: { [key: string]: any }) {
  return request<API.Login>('/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
