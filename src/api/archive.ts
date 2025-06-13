// @ts-ignore
/* eslint-disable */
import request from '@/request';

/** API endpoint for 专病档案管理. - **Create**: POST /api/archive/
  - `archive_code` 自动生成
  - Required: `archive_name`, `archive_description`

  请求示例:
  ```json
  {
      "archive_name": "string",
      "archive_description": "string"
  }
  ```

  实际示例:
  ```json
  {
      "archive_name": "肾移植档案",
      "archive_description": "收集肾移植患者的术前术后检查数据"
  }
  ```

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "创建成功",
      "data": {
          "archive_code": "A000001",
          "archive_name": "肾移植档案",
          "archive_description": "收集肾移植患者的术前术后检查数据",
          "created_at": "2025-05-27T10:00:00"
      }
  }
  ```

- **List**: GET /api/archive/
  - 支持分页: ?page=1&page_size=10
  - 返回档案基本信息和包含的病例数

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "查询成功",
      "data": {
          "list": [
              {
                  "archive_code": "A000001",
                  "archive_name": "肾移植档案",
                  "archive_description": "收集肾移植患者的术前术后检查数据",
                  "case_count": 10,
                  "created_at": "2025-05-27T10:00:00"
              }
          ],
          "total": 1,
          "page": 1,
          "page_size": 10
      }
  }
  ```

- **Retrieve**: GET /api/archive/{archive_code}/
  - 返回档案详细信息

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "查询成功",
      "data": {
          "archive_code": "A000001",
          "archive_name": "肾移植档案",
          "archive_description": "收集肾移植患者的术前术后检查数据",
          "created_at": "2025-05-27T10:00:00",
          "cases": [
              {
                  "case_code": "C000001",
                  "name": "张三",
                  "gender": "男",
                  "age": 45
              }
          ]
      }
  }
  ```

- **Update**: PUT /api/archive/{archive_code}/
  - 可更新：archive_name, archive_description

  请求示例:
  ```json
  {
      "archive_name": "肾移植随访档案",
      "archive_description": "收集肾移植患者的术前术后以及随访检查数据"
  }
  ```

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "更新成功",
      "data": {
          "archive_code": "A000001",
          "archive_name": "肾移植随访档案",
          "archive_description": "收集肾移植患者的术前术后以及随访检查数据",
          "created_at": "2025-05-27T10:00:00"
      }
  }
  ```

- **Delete**: DELETE /api/archive/{archive_code}/

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "删除成功",
      "data": null
  }
  ```

## 错误响应示例
```json
{
    "code": 400,
    "msg": "请求参数错误",
    "data": {
        "archive_name": ["该字段是必填项。"],
        "archive_description": ["该字段是必填项。"]
    }
} GET /archive/ */
export async function archiveList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.archiveListParams,
  options?: { [key: string]: any }
) {
  return request<{ count: number; next?: string; previous?: string; results: API.ArchiveList[] }>(
    '/archive/',
    {
      method: 'GET',
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** API endpoint for 专病档案管理. - **Create**: POST /api/archive/
  - `archive_code` 自动生成
  - Required: `archive_name`, `archive_description`

  请求示例:
  ```json
  {
      "archive_name": "string",
      "archive_description": "string"
  }
  ```

  实际示例:
  ```json
  {
      "archive_name": "肾移植档案",
      "archive_description": "收集肾移植患者的术前术后检查数据"
  }
  ```

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "创建成功",
      "data": {
          "archive_code": "A000001",
          "archive_name": "肾移植档案",
          "archive_description": "收集肾移植患者的术前术后检查数据",
          "created_at": "2025-05-27T10:00:00"
      }
  }
  ```

- **List**: GET /api/archive/
  - 支持分页: ?page=1&page_size=10
  - 返回档案基本信息和包含的病例数

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "查询成功",
      "data": {
          "list": [
              {
                  "archive_code": "A000001",
                  "archive_name": "肾移植档案",
                  "archive_description": "收集肾移植患者的术前术后检查数据",
                  "case_count": 10,
                  "created_at": "2025-05-27T10:00:00"
              }
          ],
          "total": 1,
          "page": 1,
          "page_size": 10
      }
  }
  ```

- **Retrieve**: GET /api/archive/{archive_code}/
  - 返回档案详细信息

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "查询成功",
      "data": {
          "archive_code": "A000001",
          "archive_name": "肾移植档案",
          "archive_description": "收集肾移植患者的术前术后检查数据",
          "created_at": "2025-05-27T10:00:00",
          "cases": [
              {
                  "case_code": "C000001",
                  "name": "张三",
                  "gender": "男",
                  "age": 45
              }
          ]
      }
  }
  ```

- **Update**: PUT /api/archive/{archive_code}/
  - 可更新：archive_name, archive_description

  请求示例:
  ```json
  {
      "archive_name": "肾移植随访档案",
      "archive_description": "收集肾移植患者的术前术后以及随访检查数据"
  }
  ```

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "更新成功",
      "data": {
          "archive_code": "A000001",
          "archive_name": "肾移植随访档案",
          "archive_description": "收集肾移植患者的术前术后以及随访检查数据",
          "created_at": "2025-05-27T10:00:00"
      }
  }
  ```

- **Delete**: DELETE /api/archive/{archive_code}/

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "删除成功",
      "data": null
  }
  ```

## 错误响应示例
```json
{
    "code": 400,
    "msg": "请求参数错误",
    "data": {
        "archive_name": ["该字段是必填项。"],
        "archive_description": ["该字段是必填项。"]
    }
} POST /archive/ */
export async function archiveCreate(body: API.ArchiveDetail, options?: { [key: string]: any }) {
  return request<API.ArchiveDetail>('/archive/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** API endpoint for 专病档案管理. - **Create**: POST /api/archive/
  - `archive_code` 自动生成
  - Required: `archive_name`, `archive_description`

  请求示例:
  ```json
  {
      "archive_name": "string",
      "archive_description": "string"
  }
  ```

  实际示例:
  ```json
  {
      "archive_name": "肾移植档案",
      "archive_description": "收集肾移植患者的术前术后检查数据"
  }
  ```

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "创建成功",
      "data": {
          "archive_code": "A000001",
          "archive_name": "肾移植档案",
          "archive_description": "收集肾移植患者的术前术后检查数据",
          "created_at": "2025-05-27T10:00:00"
      }
  }
  ```

- **List**: GET /api/archive/
  - 支持分页: ?page=1&page_size=10
  - 返回档案基本信息和包含的病例数

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "查询成功",
      "data": {
          "list": [
              {
                  "archive_code": "A000001",
                  "archive_name": "肾移植档案",
                  "archive_description": "收集肾移植患者的术前术后检查数据",
                  "case_count": 10,
                  "created_at": "2025-05-27T10:00:00"
              }
          ],
          "total": 1,
          "page": 1,
          "page_size": 10
      }
  }
  ```

- **Retrieve**: GET /api/archive/{archive_code}/
  - 返回档案详细信息

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "查询成功",
      "data": {
          "archive_code": "A000001",
          "archive_name": "肾移植档案",
          "archive_description": "收集肾移植患者的术前术后检查数据",
          "created_at": "2025-05-27T10:00:00",
          "cases": [
              {
                  "case_code": "C000001",
                  "name": "张三",
                  "gender": "男",
                  "age": 45
              }
          ]
      }
  }
  ```

- **Update**: PUT /api/archive/{archive_code}/
  - 可更新：archive_name, archive_description

  请求示例:
  ```json
  {
      "archive_name": "肾移植随访档案",
      "archive_description": "收集肾移植患者的术前术后以及随访检查数据"
  }
  ```

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "更新成功",
      "data": {
          "archive_code": "A000001",
          "archive_name": "肾移植随访档案",
          "archive_description": "收集肾移植患者的术前术后以及随访检查数据",
          "created_at": "2025-05-27T10:00:00"
      }
  }
  ```

- **Delete**: DELETE /api/archive/{archive_code}/

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "删除成功",
      "data": null
  }
  ```

## 错误响应示例
```json
{
    "code": 400,
    "msg": "请求参数错误",
    "data": {
        "archive_name": ["该字段是必填项。"],
        "archive_description": ["该字段是必填项。"]
    }
} GET /archive/${param0}/ */
export async function archiveRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.archiveReadParams,
  options?: { [key: string]: any }
) {
  const { archive_code: param0, ...queryParams } = params;
  return request<API.ArchiveDetail>(`/archive/${param0}/`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** API endpoint for 专病档案管理. - **Create**: POST /api/archive/
  - `archive_code` 自动生成
  - Required: `archive_name`, `archive_description`

  请求示例:
  ```json
  {
      "archive_name": "string",
      "archive_description": "string"
  }
  ```

  实际示例:
  ```json
  {
      "archive_name": "肾移植档案",
      "archive_description": "收集肾移植患者的术前术后检查数据"
  }
  ```

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "创建成功",
      "data": {
          "archive_code": "A000001",
          "archive_name": "肾移植档案",
          "archive_description": "收集肾移植患者的术前术后检查数据",
          "created_at": "2025-05-27T10:00:00"
      }
  }
  ```

- **List**: GET /api/archive/
  - 支持分页: ?page=1&page_size=10
  - 返回档案基本信息和包含的病例数

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "查询成功",
      "data": {
          "list": [
              {
                  "archive_code": "A000001",
                  "archive_name": "肾移植档案",
                  "archive_description": "收集肾移植患者的术前术后检查数据",
                  "case_count": 10,
                  "created_at": "2025-05-27T10:00:00"
              }
          ],
          "total": 1,
          "page": 1,
          "page_size": 10
      }
  }
  ```

- **Retrieve**: GET /api/archive/{archive_code}/
  - 返回档案详细信息

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "查询成功",
      "data": {
          "archive_code": "A000001",
          "archive_name": "肾移植档案",
          "archive_description": "收集肾移植患者的术前术后检查数据",
          "created_at": "2025-05-27T10:00:00",
          "cases": [
              {
                  "case_code": "C000001",
                  "name": "张三",
                  "gender": "男",
                  "age": 45
              }
          ]
      }
  }
  ```

- **Update**: PUT /api/archive/{archive_code}/
  - 可更新：archive_name, archive_description

  请求示例:
  ```json
  {
      "archive_name": "肾移植随访档案",
      "archive_description": "收集肾移植患者的术前术后以及随访检查数据"
  }
  ```

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "更新成功",
      "data": {
          "archive_code": "A000001",
          "archive_name": "肾移植随访档案",
          "archive_description": "收集肾移植患者的术前术后以及随访检查数据",
          "created_at": "2025-05-27T10:00:00"
      }
  }
  ```

- **Delete**: DELETE /api/archive/{archive_code}/

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "删除成功",
      "data": null
  }
  ```

## 错误响应示例
```json
{
    "code": 400,
    "msg": "请求参数错误",
    "data": {
        "archive_name": ["该字段是必填项。"],
        "archive_description": ["该字段是必填项。"]
    }
} PUT /archive/${param0}/ */
export async function archiveUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.archiveUpdateParams,
  body: API.ArchiveDetail,
  options?: { [key: string]: any }
) {
  const { archive_code: param0, ...queryParams } = params;
  return request<API.ArchiveDetail>(`/archive/${param0}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** API endpoint for 专病档案管理. - **Create**: POST /api/archive/
  - `archive_code` 自动生成
  - Required: `archive_name`, `archive_description`

  请求示例:
  ```json
  {
      "archive_name": "string",
      "archive_description": "string"
  }
  ```

  实际示例:
  ```json
  {
      "archive_name": "肾移植档案",
      "archive_description": "收集肾移植患者的术前术后检查数据"
  }
  ```

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "创建成功",
      "data": {
          "archive_code": "A000001",
          "archive_name": "肾移植档案",
          "archive_description": "收集肾移植患者的术前术后检查数据",
          "created_at": "2025-05-27T10:00:00"
      }
  }
  ```

- **List**: GET /api/archive/
  - 支持分页: ?page=1&page_size=10
  - 返回档案基本信息和包含的病例数

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "查询成功",
      "data": {
          "list": [
              {
                  "archive_code": "A000001",
                  "archive_name": "肾移植档案",
                  "archive_description": "收集肾移植患者的术前术后检查数据",
                  "case_count": 10,
                  "created_at": "2025-05-27T10:00:00"
              }
          ],
          "total": 1,
          "page": 1,
          "page_size": 10
      }
  }
  ```

- **Retrieve**: GET /api/archive/{archive_code}/
  - 返回档案详细信息

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "查询成功",
      "data": {
          "archive_code": "A000001",
          "archive_name": "肾移植档案",
          "archive_description": "收集肾移植患者的术前术后检查数据",
          "created_at": "2025-05-27T10:00:00",
          "cases": [
              {
                  "case_code": "C000001",
                  "name": "张三",
                  "gender": "男",
                  "age": 45
              }
          ]
      }
  }
  ```

- **Update**: PUT /api/archive/{archive_code}/
  - 可更新：archive_name, archive_description

  请求示例:
  ```json
  {
      "archive_name": "肾移植随访档案",
      "archive_description": "收集肾移植患者的术前术后以及随访检查数据"
  }
  ```

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "更新成功",
      "data": {
          "archive_code": "A000001",
          "archive_name": "肾移植随访档案",
          "archive_description": "收集肾移植患者的术前术后以及随访检查数据",
          "created_at": "2025-05-27T10:00:00"
      }
  }
  ```

- **Delete**: DELETE /api/archive/{archive_code}/

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "删除成功",
      "data": null
  }
  ```

## 错误响应示例
```json
{
    "code": 400,
    "msg": "请求参数错误",
    "data": {
        "archive_name": ["该字段是必填项。"],
        "archive_description": ["该字段是必填项。"]
    }
} DELETE /archive/${param0}/ */
export async function archiveDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.archiveDeleteParams,
  options?: { [key: string]: any }
) {
  const { archive_code: param0, ...queryParams } = params;
  return request<any>(`/archive/${param0}/`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** API endpoint for 专病档案管理. - **Create**: POST /api/archive/
  - `archive_code` 自动生成
  - Required: `archive_name`, `archive_description`

  请求示例:
  ```json
  {
      "archive_name": "string",
      "archive_description": "string"
  }
  ```

  实际示例:
  ```json
  {
      "archive_name": "肾移植档案",
      "archive_description": "收集肾移植患者的术前术后检查数据"
  }
  ```

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "创建成功",
      "data": {
          "archive_code": "A000001",
          "archive_name": "肾移植档案",
          "archive_description": "收集肾移植患者的术前术后检查数据",
          "created_at": "2025-05-27T10:00:00"
      }
  }
  ```

- **List**: GET /api/archive/
  - 支持分页: ?page=1&page_size=10
  - 返回档案基本信息和包含的病例数

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "查询成功",
      "data": {
          "list": [
              {
                  "archive_code": "A000001",
                  "archive_name": "肾移植档案",
                  "archive_description": "收集肾移植患者的术前术后检查数据",
                  "case_count": 10,
                  "created_at": "2025-05-27T10:00:00"
              }
          ],
          "total": 1,
          "page": 1,
          "page_size": 10
      }
  }
  ```

- **Retrieve**: GET /api/archive/{archive_code}/
  - 返回档案详细信息

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "查询成功",
      "data": {
          "archive_code": "A000001",
          "archive_name": "肾移植档案",
          "archive_description": "收集肾移植患者的术前术后检查数据",
          "created_at": "2025-05-27T10:00:00",
          "cases": [
              {
                  "case_code": "C000001",
                  "name": "张三",
                  "gender": "男",
                  "age": 45
              }
          ]
      }
  }
  ```

- **Update**: PUT /api/archive/{archive_code}/
  - 可更新：archive_name, archive_description

  请求示例:
  ```json
  {
      "archive_name": "肾移植随访档案",
      "archive_description": "收集肾移植患者的术前术后以及随访检查数据"
  }
  ```

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "更新成功",
      "data": {
          "archive_code": "A000001",
          "archive_name": "肾移植随访档案",
          "archive_description": "收集肾移植患者的术前术后以及随访检查数据",
          "created_at": "2025-05-27T10:00:00"
      }
  }
  ```

- **Delete**: DELETE /api/archive/{archive_code}/

  响应示例:
  ```json
  {
      "code": 200,
      "msg": "删除成功",
      "data": null
  }
  ```

## 错误响应示例
```json
{
    "code": 400,
    "msg": "请求参数错误",
    "data": {
        "archive_name": ["该字段是必填项。"],
        "archive_description": ["该字段是必填项。"]
    }
} PATCH /archive/${param0}/ */
export async function archivePartialUpdate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.archivePartialUpdateParams,
  body: API.ArchiveDetail,
  options?: { [key: string]: any }
) {
  const { archive_code: param0, ...queryParams } = params;
  return request<API.ArchiveDetail>(`/archive/${param0}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
