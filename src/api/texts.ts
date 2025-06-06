// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 此处后端没有提供注释 GET /texts/ */
export async function textsList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.textsListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.Text[];
  }>("/texts/", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /texts/ */
export async function textsCreate(
  body: API.Text,
  options?: { [key: string]: any }
) {
  return request<API.Text>("/texts/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /texts/${param0}/ */
export async function textsRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.textsReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Text>(`/texts/${param0}/`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /texts/${param0}/ */
export async function textsUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.textsUpdateParams,
  body: API.Text,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Text>(`/texts/${param0}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /texts/${param0}/ */
export async function textsDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.textsDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/texts/${param0}/`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PATCH /texts/${param0}/ */
export async function textsPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.textsPartialUpdateParams,
  body: API.Text,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.Text>(`/texts/${param0}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
