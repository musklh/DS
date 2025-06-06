import type { DiseaseData } from '../types/disease' // 假设有一个类型定义文件

import api from "../request.ts"

// 获取病例列表
export const fetchDiseaseList = async (keyword: string = ''): Promise<DiseaseData[]> => {
  try {
    const response = await api.get('/diseases', {
      params: { keyword }
    })
    return response.data
  } catch (error) {
    console.error('获取病例列表失败:', error)
    throw error
  }
}

// 添加病例
export const addDisease = async (item: DiseaseData): Promise<DiseaseData> => {
  try {
    const response = await api.post('/diseases', item)
    return response.data
  } catch (error) {
    console.error('添加病例失败:', error)
    throw error
  }
}

// 更新病例
export const updateDisease = async (id: number, item: DiseaseData): Promise<DiseaseData> => {
  try {
    const response = await api.put(`/diseases/${id}`, item)
    return response.data
  } catch (error) {
    console.error('更新病例失败:', error)
    throw error
  }
}

// 删除病例
export const deleteDisease = async (id: number): Promise<void> => {
  try {
    await api.delete(`/diseases/${id}`)
  } catch (error) {
    console.error('删除病例失败:', error)
    throw error
  }
}
