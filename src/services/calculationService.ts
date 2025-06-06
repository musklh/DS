import type { CalculationAttribute } from '../types/calculation' // 假设有一个类型定义文件
import api from "../request.ts"


// 获取计算属性列表（带分页）
export const fetchCalculationList = async (page: number, size: number, keyword: string = ''): Promise<{ data: CalculationAttribute[], total: number }> => {
  try {
    const response = await api.get('/calculations', {
      params: { page, size, keyword }
    })
    return response.data
  } catch (error) {
    console.error('获取计算属性列表失败:', error)
    throw error
  }
}

// 添加计算属性
export const addCalculationAttribute = async (item: CalculationAttribute): Promise<CalculationAttribute> => {
  try {
    const response = await api.post('/calculations', item)
    return response.data
  } catch (error) {
    console.error('添加计算属性失败:', error)
    throw error
  }
}

// 更新计算属性
export const updateCalculationAttribute = async (id: number, item: CalculationAttribute): Promise<CalculationAttribute> => {
  try {
    const response = await api.put(`/calculations/${id}`, item)
    return response.data
  } catch (error) {
    console.error('更新计算属性失败:', error)
    throw error
  }
}

// 删除计算属性
export const deleteCalculationAttribute = async (id: number): Promise<void> => {
  try {
    await api.delete(`/calculations/${id}`)
  } catch (error) {
    console.error('删除计算属性失败:', error)
    throw error
  }
}
