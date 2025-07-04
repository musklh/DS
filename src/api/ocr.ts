// @ts-ignore
/* eslint-disable */
// OCR 识别相关接口
import request from '../request';
import axios from 'axios';

// 为OCR请求创建单独的axios实例，避免默认配置的干扰
const ocrAxios = axios.create({
  timeout: 150000, // 5分钟超时
  withCredentials: false, // OCR服务不需要cookie
  baseURL: '', // 明确设置空的baseURL，避免继承任何默认配置
});

export interface OcrUploadParams {
  file: File;
  template_code?: string; // 可选的模板代码，用于更精确的匹配
}

export interface OcrResult {
  seq: string;
  item: string;
  result: string;
  reference_range: string;
  unit: string;
}

export interface OcrResponse {
  msg: {
    patient_info: {
      case_number: string;
      name: string;
      gender: string;
      age: string;
      department: string;
      bed_number: string;
      sample_type: string;
      registration_number: string;
      report_number: string;
      sample_code: string;
      diagnosis: string;
    };
    test_results: OcrResult[];
    additional_info: {
      lab_opinion: string;
      doctor_notes: string;
      applicant: string;
      collector: string;
      signer: string;
      reporter: string;
      reviewer: string;
      apply_time: string;
      collect_time: string;
      sign_time: string;
      report_time: string;
      audit_time: string;
      note: string;
    };
  };
  code: number;
}

/**
 * 上传图片进行OCR识别
 */
export const ocrUpload = (params: OcrUploadParams): Promise<{ data: OcrResponse }> => {
  const formData = new FormData();
  formData.append('file', params.file);
  if (params.template_code) {
    formData.append('template_code', params.template_code);
  }

  return ocrAxios({
    url: '/getOcrData', // 使用代理路径
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * 模拟OCR识别结果（开发阶段使用）
 */
export const mockOcrRecognition = (): Promise<{ data: OcrResponse }> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      const testData: OcrResponse = {
        "msg": {
          "patient_info": {
            "case_number": "00044618",
            "name": "丁长林",
            "gender": "男",
            "age": "49岁",
            "department": "普通外科",
            "bed_number": "27床",
            "sample_type": "全血",
            "registration_number": "0000568949",
            "report_number": "13",
            "sample_code": "1002810255",
            "diagnosis": "肝硬化"
          },
          "test_results": [
            {
              "seq": "1",
              "item": "白细胞计数",
              "result": "2.06",
              "reference_range": "3.5-9.5",
              "unit": "x10^9/L"
            },
            {
              "seq": "2",
              "item": "中性粒细胞比值",
              "result": "61.2",
              "reference_range": "40-75",
              "unit": "%"
            },
            {
              "seq": "3",
              "item": "中性粒细胞计数",
              "result": "1.26",
              "reference_range": "1.8-6.3",
              "unit": "x10^9/L"
            },
            {
              "seq": "4",
              "item": "淋巴细胞比值",
              "result": "25.7",
              "reference_range": "20-50",
              "unit": "%"
            },
            {
              "seq": "5",
              "item": "淋巴细胞计数",
              "result": "0.53",
              "reference_range": "1.1-3.2",
              "unit": "x10^9/L"
            },
            {
              "seq": "6",
              "item": "单核细胞比值",
              "result": "9.2",
              "reference_range": "3-10",
              "unit": "%"
            },
            {
              "seq": "7",
              "item": "单核细胞计数",
              "result": "0.19",
              "reference_range": "0.1-0.6",
              "unit": "x10^9/L"
            },
            {
              "seq": "8",
              "item": "嗜酸性粒细胞比值",
              "result": "3.4",
              "reference_range": "0.4-8",
              "unit": "%"
            },
            {
              "seq": "9",
              "item": "嗜酸性粒细胞计数",
              "result": "0.07",
              "reference_range": "0.02-0.52",
              "unit": "x10^9/L"
            },
            {
              "seq": "10",
              "item": "嗜碱性粒细胞比值",
              "result": "0.5",
              "reference_range": "0-1.0",
              "unit": "%"
            },
            {
              "seq": "11",
              "item": "嗜碱性粒细胞计数",
              "result": "0.01",
              "reference_range": "0.00-0.06",
              "unit": "x10^9/L"
            },
            {
              "seq": "12",
              "item": "红细胞计数",
              "result": "3.31",
              "reference_range": "4.3-5.8",
              "unit": "x10^12/L"
            },
            {
              "seq": "13",
              "item": "血红蛋白",
              "result": "79",
              "reference_range": "130-175",
              "unit": "g/L"
            },
            {
              "seq": "14",
              "item": "红细胞压积",
              "result": "25.9",
              "reference_range": "40-50",
              "unit": "%"
            },
            {
              "seq": "15",
              "item": "平均红细胞体积",
              "result": "78.2",
              "reference_range": "82-100",
              "unit": "fL"
            },
            {
              "seq": "16",
              "item": "平均红细胞血红蛋白含量",
              "result": "23.9",
              "reference_range": "27-34",
              "unit": "pg"
            },
            {
              "seq": "17",
              "item": "平均红细胞血红蛋白浓度",
              "result": "305.00",
              "reference_range": "316-354",
              "unit": "g/L"
            },
            {
              "seq": "18",
              "item": "红细胞分布宽度CV值",
              "result": "16.4",
              "reference_range": "11.9-14.5",
              "unit": "%"
            },
            {
              "seq": "19",
              "item": "血小板计数",
              "result": "66.00",
              "reference_range": "125-350",
              "unit": "x10^9/L"
            },
            {
              "seq": "20",
              "item": "血小板平均体积",
              "result": "10.4",
              "reference_range": "9.4-12.6",
              "unit": "fL"
            },
            {
              "seq": "21",
              "item": "血小板分布宽度",
              "result": "14.0",
              "reference_range": "9.8-16.2",
              "unit": "%"
            },
            {
              "seq": "22",
              "item": "血小板压积",
              "result": "0.07",
              "reference_range": "0.130-0.350",
              "unit": "%"
            },
            {
              "seq": "23",
              "item": "大血小板比值",
              "result": "32.0",
              "reference_range": "",
              "unit": "%"
            },
            {
              "seq": "24",
              "item": "有核红细胞百分比",
              "result": "0.5",
              "reference_range": "0-0",
              "unit": "%"
            },
            {
              "seq": "25",
              "item": "有核红细胞计数绝对值",
              "result": "0.01",
              "reference_range": "0-0",
              "unit": "x10^9/L"
            },
            {
              "seq": "26",
              "item": "网织红细胞计数",
              "result": "0.061",
              "reference_range": "0.02-0.10",
              "unit": "x10^12/L"
            },
            {
              "seq": "27",
              "item": "网织红细胞比值",
              "result": "1.84",
              "reference_range": "0.5-2.0",
              "unit": "%"
            },
            {
              "seq": "28",
              "item": "网织红细胞血红蛋白含量",
              "result": "20.2",
              "reference_range": "28-36",
              "unit": "pg"
            },
            {
              "seq": "29",
              "item": "高荧光网织红比值",
              "result": "8.800",
              "reference_range": "≤1.7",
              "unit": "%"
            },
            {
              "seq": "30",
              "item": "未成熟网织红指数",
              "result": "18.5",
              "reference_range": "1.6-10.5",
              "unit": ""
            }
          ],
          "additional_info": {
            "lab_opinion": "",
            "doctor_notes": "",
            "applicant": "王杰",
            "collector": "张琪",
            "signer": "杨春华",
            "reporter": "",
            "reviewer": "吕淼淼",
            "apply_time": "2023-12-23 17:14",
            "collect_time": "2023-12-24 04:30",
            "sign_time": "2023-12-24 05:10",
            "report_time": "2023-12-24 07:00",
            "audit_time": "2023-12-24 07:00",
            "note": "本报告仅对所检测的标本负责，如有疑问，请在出报告后72小时内到检验科查询。"
          }
        },
        "code": 200
      };
      
      resolve({ data: testData });
    }, 2000);
  });
};
