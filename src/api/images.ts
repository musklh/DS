// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 此处后端没有提供注释 GET /images/ */
export async function imagesList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.imagesListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.Image[];
  }>("/images/", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /images/ */
export async function imagesCreate(
  body: API.Image,
  options?: { [key: string]: any }
) {
  return request<API.Image>("/images/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /images/${param0}/ */
export async function imagesRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.imagesReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Image>(`/images/${param0}/`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /images/${param0}/ */
export async function imagesUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.imagesUpdateParams,
  body: API.Image,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Image>(`/images/${param0}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /images/${param0}/ */
export async function imagesDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.imagesDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/images/${param0}/`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /images/${param0}/ */
export async function imagesPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.imagesPartialUpdateParams,
  body: API.Image,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Image>(`/images/${param0}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
