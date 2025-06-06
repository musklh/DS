// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 获取所有数据模板 & 创建新数据模板 GET /data-templates/ */
export async function dataTemplatesList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataTemplatesListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.DataTemplates[];
  }>("/data-templates/", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取所有数据模板 & 创建新数据模板 POST /data-templates/ */
export async function dataTemplatesCreate(
  body: API.DataTemplates,
  options?: { [key: string]: any }
) {
  return request<API.DataTemplates>("/data-templates/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取、更新或删除指定 ID 的数据模板 GET /data-templates/${param0}/ */
export async function dataTemplatesRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataTemplatesReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DataTemplates>(`/data-templates/${param0}/`, {
    method: "GET",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取、更新或删除指定 ID 的数据模板 PUT /data-templates/${param0}/ */
export async function dataTemplatesUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataTemplatesUpdateParams,
  body: API.DataTemplates,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DataTemplates>(`/data-templates/${param0}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 获取、更新或删除指定 ID 的数据模板 DELETE /data-templates/${param0}/ */
export async function dataTemplatesDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataTemplatesDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/data-templates/${param0}/`, {
    method: "DELETE",
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取、更新或删除指定 ID 的数据模板 PATCH /data-templates/${param0}/ */
export async function dataTemplatesPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataTemplatesPartialUpdateParams,
  body: API.DataTemplates,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DataTemplates>(`/data-templates/${param0}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
