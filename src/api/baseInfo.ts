// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 此处后端没有提供注释 GET /base-info/ */
export async function baseInfoList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.baseInfoListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.BaseInfo[];
  }>("/base-info/", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /base-info/ */
export async function baseInfoCreate(
  body: API.BaseInfo,
  options?: { [key: string]: any }
) {
  return request<API.BaseInfo>("/base-info/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /base-info/${param0}/ */
export async function baseInfoRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.baseInfoReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseInfo>(`/base-info/${param0}/`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /base-info/${param0}/ */
export async function baseInfoUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.baseInfoUpdateParams,
  body: API.BaseInfo,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseInfo>(`/base-info/${param0}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /base-info/${param0}/ */
export async function baseInfoDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.baseInfoDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/base-info/${param0}/`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /base-info/${param0}/ */
export async function baseInfoPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.baseInfoPartialUpdateParams,
  body: API.BaseInfo,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.BaseInfo>(`/base-info/${param0}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
