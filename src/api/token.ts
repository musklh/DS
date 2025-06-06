// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** Takes a set of user credentials and returns an access and refresh JSON web
token pair to prove the authentication of those credentials. POST /token/ */
export async function tokenCreate(
  body: API.TokenObtainPair,
  options?: { [key: string]: any }
) {
  return request<API.TokenObtainPair>("/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Takes a refresh type JSON web token and returns an access type JSON web
token if the refresh token is valid. POST /token/refresh/ */
export async function tokenRefreshCreate(
  body: API.TokenRefresh,
  options?: { [key: string]: any }
) {
  return request<API.TokenRefresh>("/token/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
