<template>
  <el-card>
    <el-alert
      title="病例是用来记录患者的一次完整病程的所有临床资料，同一个身份证号码会被识别为同一个患者。"
      type="info"
      show-icon
      class="mb-4"
    />

    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" label-position="left" hide-required-asterisk>
      <el-form-item label="病例号">
        <el-input v-model="form.caseId" disabled style="width: 300px;" />
        <el-link type="primary" class="ml-2" @click="generateCaseId"> 自动生成 </el-link>
      </el-form-item>

      <el-form-item label="档案号 *" prop="recordId">
        <el-select v-model="form.recordId" placeholder="请选择" style="width: 300px;">
          <el-option v-for="item in recordOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="身份证号 *" prop="idCard">
        <el-input v-model="form.idCard" placeholder="请输入身份证号" style="width: 300px;" @change="handleIdCardChange" />
        <span class="ml-2 tip-text">首次录入的身份证会自动创建患者资料</span>
      </el-form-item>

      <el-form-item label="门诊号">
        <el-input v-model="form.outpatientId" style="width: 300px;" />
      </el-form-item>

      <el-form-item label="住院号">
        <el-input v-model="form.inpatientId" style="width: 300px;" />
      </el-form-item>

      <el-form-item label="姓名 *" prop="name">
        <el-input v-model="form.name" style="width: 300px;" />
      </el-form-item>

      <el-form-item label="性别 *" prop="gender">
        <el-select v-model="form.gender" placeholder="请选择" style="width: 300px;">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>

      <el-form-item label="出生年月">
        <el-date-picker
          v-model="form.birthDate"
          type="date"
          placeholder="选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 300px;"
        />
        <span class="ml-2">{{ calcAge(form.birthDate) }} 岁</span>
      </el-form-item>

      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="form.phone" style="width: 300px;" />
      </el-form-item>

      <el-form-item label="家庭地址">
        <el-input v-model="form.address" style="width: 300px;" />
      </el-form-item>

      <el-form-item label="血型">
        <el-select v-model="form.bloodType" placeholder="请选择" style="width: 300px;">
          <el-option label="A型" value="A" />
          <el-option label="B型" value="B" />
          <el-option label="AB型" value="AB" />
          <el-option label="O型" value="O" />
        </el-select>
      </el-form-item>

      <el-form-item label="主要诊断">
        <el-input v-model="form.diagnosis" style="width: 300px;" />
      </el-form-item>

      <el-form-item label="是否做过移植手术 *" prop="hasTransplantSurgery">
        <el-select v-model="form.hasTransplantSurgery" placeholder="请选择" style="width: 100px; margin-right: 10px;">
          <el-option label="是" value="是" />
          <el-option label="否" value="否" />
        </el-select>
        <el-date-picker
          v-if="form.hasTransplantSurgery === '是'"
          v-model="form.hasTransplantSurgeryDate"
          type="date"
          placeholder="选择日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="updateHasTransplantSurgery"
          style="width: 190px;"
        />
      </el-form-item>

      <el-form-item label="是否在移植队列 *" prop="isInTransplantQueue">
        <el-select v-model="form.isInTransplantQueue" placeholder="请选择" style="width: 300px;">
          <el-option label="是" value="是" />
          <el-option label="否" value="否" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm"> 添加 </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { caseCreate } from '../../api/openApiCase'; // 路径根据实际位置调整

export default defineComponent({
  name: 'NewMedicalCase',
  setup() {
    const formRef = ref();
    const form = reactive({
      caseId: '',
      recordId: '',
      idCard: '',
      outpatientId: '',
      inpatientId: '',
      name: '',
      gender: '',
      birthDate: '',
      phone: '',
      address: '',
      bloodType: '',
      diagnosis: '',
      hasTransplantSurgery: '',
      hasTransplantSurgeryDate: '',
      isInTransplantQueue: '',
    });

    const rules = {
      recordId: [{ required: true, message: '请选择档案号', trigger: 'change' }],
      idCard: [
        { required: true, message: '请输入身份证号', trigger: 'blur' },
        { 
          validator: (_rule: any, value: string, callback: any) => {
            if (value && value.length !== 18) {
              callback(new Error('身份证号必须是18位'));
              return;
            }
            // 验证前17位是否都是数字
            const reg = /^\d{17}[\dXx]$/;
            if (!reg.test(value)) {
              callback(new Error('身份证号格式不正确'));
              return;
            }
            callback();
          },
          trigger: 'blur'
        }
      ],
      name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
      hasTransplantSurgery: [{ required: true, message: '请选择是否做过移植手术', trigger: 'change' }],
      isInTransplantQueue: [{ required: true, message: '请选择是否在移植队列', trigger: 'change' }],
      phone: [
        {
          validator: (_rule: any, value: string, callback: any) => {
            if (value && value.length !== 11) {
              callback(new Error('手机号必须是11位'));
              return;
            }
            // 验证是否都是数字
            const reg = /^1[3-9]\d{9}$/;
            if (!reg.test(value)) {
              callback(new Error('手机号格式不正确'));
              return;
            }
            callback();
          },
          trigger: 'blur'
        }
      ],
    };

    const recordOptions = JSON.parse(localStorage.getItem('archiveCodes') || '[]');
    console.log('读取缓存中的档案编号:', recordOptions);


    const generateCaseId = () => {
      const num = Math.floor(10000000 + Math.random() * 90000000);
      form.caseId = `C${num}`;
    };

    const calcAge = (birth: string) => {
      if (!birth) return '';
      const [year, month] = birth.split('-').map(Number);
      const now = new Date();
      let age = now.getFullYear() - year;
      if (now.getMonth() + 1 < month) age--;
      return age;
    };

    const updateHasTransplantSurgery = () => {
      if (form.hasTransplantSurgery === '否') {
        form.hasTransplantSurgeryDate = '';
      }
    };

    const submitForm = () => {
      formRef.value.validate(async (valid: boolean) => {
        if (valid) {
          try {
            // 处理移植手术信息，如果有日期则拼接
            const transplantSurgeryInfo = form.hasTransplantSurgery === '是' && form.hasTransplantSurgeryDate 
              ? `${form.hasTransplantSurgery}(${form.hasTransplantSurgeryDate})`
              : form.hasTransplantSurgery;

            const payload = {
              archive_codes: [form.recordId],
              identity: form.idCard,
              opd_id: form.outpatientId,
              inhospital_id: form.inpatientId,
              name: form.name,
              gender: form.gender === '男' ? 1 : 0 as 0 | 1,
              birth_date: form.birthDate,
              phone_number: form.phone,
              home_address: form.address,
              blood_type: form.bloodType,
              main_diagnosis: form.diagnosis,
              has_transplant_surgery: transplantSurgeryInfo,
              is_in_transplant_queue: form.isInTransplantQueue,
            } as unknown as API.Case;
            console.log("提交的payload:", payload);
            const response = await caseCreate(payload);
            
            if (response?.data?.code === 200) {
              ElMessage.success('病例添加成功！');
              console.log('提交成功，返回数据：', response);
              formRef.value.resetFields();
            } else {
              ElMessage.error(response?.data?.msg || '病例添加失败，请检查数据后重试');
              console.error('提交失败，返回数据：', response);
            }
          } catch (error) {
            console.error('提交失败：', error);
            ElMessage.error('提交失败，请稍后重试。');
          }
        }
      });
    };

    // 监听身份证号变化
    const handleIdCardChange = (value: string) => {
      if (value && value.length === 18) {
        // 验证身份证号格式
        const reg = /^\d{17}[\dXx]$/;
        if (reg.test(value)) {
          // 从身份证号中提取出生年月日
          const year = value.substring(6, 10);
          const month = value.substring(10, 12);
          const day = value.substring(12, 14);
          form.birthDate = `${year}-${month}-${day}`;
        }
      }
    };

    // 自动生成初始病例号
    generateCaseId();

    return {
      form,
      formRef,
      rules,
      recordOptions,
      generateCaseId,
      submitForm,
      calcAge,
      updateHasTransplantSurgery,
      handleIdCardChange,
    };
  },

  
});
</script>

<style scoped>
.ml-2 {
  margin-left: 8px;
}
.mb-4 {
  margin-bottom: 20px;
}
.tip-text {
  font-size: 14px;
  color: #909399;
}
</style>
