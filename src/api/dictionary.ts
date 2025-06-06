// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 获取所有词条 & 创建新词条 GET /dictionary/ */
export async function dictionaryList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dictionaryListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.Dictionary[];
  }>("/dictionary/", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取所有词条 & 创建新词条 POST /dictionary/ */
export async function dictionaryCreate(
  body: API.Dictionary,
  options?: { [key: string]: any }
) {
  return request<API.Dictionary>("/dictionary/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取、更新或删除指定 ID 的词条 GET /dictionary/${param0}/ */
export async function dictionaryRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dictionaryReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Dictionary>(`/dictionary/${param0}/`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取、更新或删除指定 ID 的词条 PUT /dictionary/${param0}/ */
export async function dictionaryUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dictionaryUpdateParams,
  body: API.Dictionary,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Dictionary>(`/dictionary/${param0}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 获取、更新或删除指定 ID 的词条 DELETE /dictionary/${param0}/ */
export async function dictionaryDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dictionaryDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/dictionary/${param0}/`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取、更新或删除指定 ID 的词条 PATCH /dictionary/${param0}/ */
export async function dictionaryPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dictionaryPartialUpdateParams,
  body: API.Dictionary,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Dictionary>(`/dictionary/${param0}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
