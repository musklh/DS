// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** API endpoint for 数据模板分类管理. - **Create**: POST /api/template-category/
  - Required: `name`
  - Optional: none

- **List**: GET /api/template-category/
  - 支持分页: ?page=1&page_size=10

- **Retrieve**: GET /api/template-category/{id}/
  - 返回模板分类详情

- **Update**: PUT /api/template-category/{id}/
  - 可更新：name

- **Delete**: DELETE /api/template-category/{id}/ GET /template-category/ */
export async function templateCategoryList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.templateCategoryListParams,
  options?: { [key: string]: any }
) {
  return request<{
    count: number;
    next?: string;
    previous?: string;
    results: API.DataTemplateCategory[];
  }>('/template-category/', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** API endpoint for 数据模板分类管理. - **Create**: POST /api/template-category/
  - Required: `name`
  - Optional: none

- **List**: GET /api/template-category/
  - 支持分页: ?page=1&page_size=10

- **Retrieve**: GET /api/template-category/{id}/
  - 返回模板分类详情

- **Update**: PUT /api/template-category/{id}/
  - 可更新：name

- **Delete**: DELETE /api/template-category/{id}/ POST /template-category/ */
export async function templateCategoryCreate(
  body: API.DataTemplateCategory,
  options?: { [key: string]: any }
) {
  return request<API.DataTemplateCategory>('/template-category/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** API endpoint for 数据模板分类管理. - **Create**: POST /api/template-category/
  - Required: `name`
  - Optional: none

- **List**: GET /api/template-category/
  - 支持分页: ?page=1&page_size=10

- **Retrieve**: GET /api/template-category/{id}/
  - 返回模板分类详情

- **Update**: PUT /api/template-category/{id}/
  - 可更新：name

- **Delete**: DELETE /api/template-category/{id}/ GET /template-category/${param0}/ */
export async function templateCategoryRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.templateCategoryReadParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DataTemplateCategory>(`/template-category/${param0}/`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** API endpoint for 数据模板分类管理. - **Create**: POST /api/template-category/
  - Required: `name`
  - Optional: none

- **List**: GET /api/template-category/
  - 支持分页: ?page=1&page_size=10

- **Retrieve**: GET /api/template-category/{id}/
  - 返回模板分类详情

- **Update**: PUT /api/template-category/{id}/
  - 可更新：name

- **Delete**: DELETE /api/template-category/{id}/ PUT /template-category/${param0}/ */
export async function templateCategoryUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.templateCategoryUpdateParams,
  body: API.DataTemplateCategory,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DataTemplateCategory>(`/template-category/${param0}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** API endpoint for 数据模板分类管理. - **Create**: POST /api/template-category/
  - Required: `name`
  - Optional: none

- **List**: GET /api/template-category/
  - 支持分页: ?page=1&page_size=10

- **Retrieve**: GET /api/template-category/{id}/
  - 返回模板分类详情

- **Update**: PUT /api/template-category/{id}/
  - 可更新：name

- **Delete**: DELETE /api/template-category/{id}/ DELETE /template-category/${param0}/ */
export async function templateCategoryDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.templateCategoryDeleteParams,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/template-category/${param0}/`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** API endpoint for 数据模板分类管理. - **Create**: POST /api/template-category/
  - Required: `name`
  - Optional: none

- **List**: GET /api/template-category/
  - 支持分页: ?page=1&page_size=10

- **Retrieve**: GET /api/template-category/{id}/
  - 返回模板分类详情

- **Update**: PUT /api/template-category/{id}/
  - 可更新：name

- **Delete**: DELETE /api/template-category/{id}/ PATCH /template-category/${param0}/ */
export async function templateCategoryPartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.templateCategoryPartialUpdateParams,
  body: API.DataTemplateCategory,
  options?: { [key: string]: any }
) {
  const { id: param0, ...queryParams } = params;
  return request<API.DataTemplateCategory>(`/template-category/${param0}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
