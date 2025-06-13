// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** API endpoint for 临床模板管理. - **Create**: POST /api/data-template/
  - `template_code` 自动生成
  - Required: `template_name`, `category`
  - Optional: `template_description`, `dictionaries`

- **List**: GET /api/data-template/
  - 支持分页: ?page=1&page_size=10

- **Retrieve**: GET /api/data-template/{template_code}/
  - 返回模板详情，包括关联的词条列表

- **Update**: PUT /api/data-template/{template_code}/
  - 可更新：template_name, template_description, category, dictionaries

- **Delete**: DELETE /api/data-template/{template_code}/ GET /data-template/ */
export async function dataTemplateList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataTemplateListParams,
  options?: { [key: string]: any }
) {
  return request<{ count: number; next?: string; previous?: string; results: API.DataTemplate[] }>(
    '/data-template/',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** API endpoint for 临床模板管理. - **Create**: POST /api/data-template/
  - `template_code` 自动生成
  - Required: `template_name`, `category`
  - Optional: `template_description`, `dictionaries`

- **List**: GET /api/data-template/
  - 支持分页: ?page=1&page_size=10

- **Retrieve**: GET /api/data-template/{template_code}/
  - 返回模板详情，包括关联的词条列表

- **Update**: PUT /api/data-template/{template_code}/
  - 可更新：template_name, template_description, category, dictionaries

- **Delete**: DELETE /api/data-template/{template_code}/ POST /data-template/ */
export async function dataTemplateCreate(body: API.DataTemplate, options?: { [key: string]: any }) {
  return request<API.DataTemplate>('/data-template/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** API endpoint for 临床模板管理. - **Create**: POST /api/data-template/
  - `template_code` 自动生成
  - Required: `template_name`, `category`
  - Optional: `template_description`, `dictionaries`

- **List**: GET /api/data-template/
  - 支持分页: ?page=1&page_size=10

- **Retrieve**: GET /api/data-template/{template_code}/
  - 返回模板详情，包括关联的词条列表

- **Update**: PUT /api/data-template/{template_code}/
  - 可更新：template_name, template_description, category, dictionaries

- **Delete**: DELETE /api/data-template/{template_code}/ GET /data-template/${param0}/ */
export async function dataTemplateRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataTemplateReadParams,
  options?: { [key: string]: any }
) {
  const { template_code: param0, ...queryParams } = params;
  return request<API.DataTemplate>(`/data-template/${param0}/`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** API endpoint for 临床模板管理. - **Create**: POST /api/data-template/
  - `template_code` 自动生成
  - Required: `template_name`, `category`
  - Optional: `template_description`, `dictionaries`

- **List**: GET /api/data-template/
  - 支持分页: ?page=1&page_size=10

- **Retrieve**: GET /api/data-template/{template_code}/
  - 返回模板详情，包括关联的词条列表

- **Update**: PUT /api/data-template/{template_code}/
  - 可更新：template_name, template_description, category, dictionaries

- **Delete**: DELETE /api/data-template/{template_code}/ PUT /data-template/${param0}/ */
export async function dataTemplateUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataTemplateUpdateParams,
  body: API.DataTemplate,
  options?: { [key: string]: any }
) {
  const { template_code: param0, ...queryParams } = params;
  return request<API.DataTemplate>(`/data-template/${param0}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** API endpoint for 临床模板管理. - **Create**: POST /api/data-template/
  - `template_code` 自动生成
  - Required: `template_name`, `category`
  - Optional: `template_description`, `dictionaries`

- **List**: GET /api/data-template/
  - 支持分页: ?page=1&page_size=10

- **Retrieve**: GET /api/data-template/{template_code}/
  - 返回模板详情，包括关联的词条列表

- **Update**: PUT /api/data-template/{template_code}/
  - 可更新：template_name, template_description, category, dictionaries

- **Delete**: DELETE /api/data-template/{template_code}/ DELETE /data-template/${param0}/ */
export async function dataTemplateDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataTemplateDeleteParams,
  options?: { [key: string]: any }
) {
  const { template_code: param0, ...queryParams } = params;
  return request<any>(`/data-template/${param0}/`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** API endpoint for 临床模板管理. - **Create**: POST /api/data-template/
  - `template_code` 自动生成
  - Required: `template_name`, `category`
  - Optional: `template_description`, `dictionaries`

- **List**: GET /api/data-template/
  - 支持分页: ?page=1&page_size=10

- **Retrieve**: GET /api/data-template/{template_code}/
  - 返回模板详情，包括关联的词条列表

- **Update**: PUT /api/data-template/{template_code}/
  - 可更新：template_name, template_description, category, dictionaries

- **Delete**: DELETE /api/data-template/{template_code}/ PATCH /data-template/${param0}/ */
export async function dataTemplatePartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.dataTemplatePartialUpdateParams,
  body: API.DataTemplate,
  options?: { [key: string]: any }
) {
  const { template_code: param0, ...queryParams } = params;
  return request<API.DataTemplate>(`/data-template/${param0}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
