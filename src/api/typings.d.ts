declare namespace API {
  type archiveDeleteParams = {
    /** 档案编号 */
    archive_code: string;
  };

  type ArchiveDetail = {
    /** Id 档案id */
    id?: number;
    /** Archive code 档案编号（自动生成） */
    archive_code?: string;
    /** Archive name 档案名称 */
    archive_name?: string;
    /** Archive description 档案描述 */
    archive_description?: string;
    case_list?: CaseList[];
  };

  type ArchiveList = {
    /** Id 档案id */
    id?: number;
    /** Archive code 档案编号（自动生成） */
    archive_code?: string;
    /** Archive name 档案名称 */
    archive_name: string;
    /** Case count 包含病例数 */
    case_count?: number;
  };

  type archiveListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type archivePartialUpdateParams = {
    /** 档案编号 */
    archive_code: string;
  };

  type archiveReadParams = {
    /** 档案编号 */
    archive_code: string;
  };

  type archiveUpdateParams = {
    /** 档案编号 */
    archive_code: string;
  };

  type Case = {
    /** Id 病例id */
    id?: number;
    /** Case code 病例编号（自动生成） */
    case_code?: string;
    /** Identity 身份证号 */
    identity: string;
    /** Identity name */
    identity_name?: string;
    /** Opd id 门诊号 */
    opd_id?: string;
    /** Inhospital id 住院号 */
    inhospital_id?: string;
    /** Name 姓名 */
    name: string;
    /** Gender 性别 0-女 1-男 */
    gender: 0 | 1;
    /** Birth date 出生年月日 */
    birth_date: string;
    /** Phone number 联系电话 */
    phone_number?: string;
    /** Home address 家庭住址 */
    home_address?: string;
    /** Blood type 血型 */
    blood_type?: string;
    /** Main diagnosis 主要诊断 */
    main_diagnosis?: string;
    /** Has transplant surgery 是否行移植手术,示例 是(2025-5-27) */
    has_transplant_surgery?: string;
    /** Is in transplant queue 是否存在移植排队 */
    is_in_transplant_queue?: string;
    /** 档案编号列表 */
    archive_codes?: string[];
    /** 关联的档案列表 */
    archives?: number[];
    /** Age 年龄 */
    age?: string;
  };

  type caseDeleteParams = {
    /** 病例编号 */
    case_code: string;
  };

  type CaseDetail = {
    /** Id 病例id */
    id?: number;
    /** Case code 病例编号（自动生成） */
    case_code?: string;
    /** Identity 身份证号 */
    identity: string;
    /** Identity name */
    identity_name?: string;
    /** Opd id 门诊号 */
    opd_id?: string;
    /** Inhospital id 住院号 */
    inhospital_id?: string;
    /** Name 姓名 */
    name: string;
    /** Gender 性别 0-女 1-男 */
    gender: 0 | 1;
    /** Birth date 出生年月日 */
    birth_date: string;
    /** Phone number 联系电话 */
    phone_number?: string;
    /** Home address 家庭住址 */
    home_address?: string;
    /** Blood type 血型 */
    blood_type?: string;
    /** Main diagnosis 主要诊断 */
    main_diagnosis?: string;
    /** Has transplant surgery 是否行移植手术,示例 是(2025-5-27) */
    has_transplant_surgery?: string;
    /** Is in transplant queue 是否存在移植排队 */
    is_in_transplant_queue?: string;
    /** Archive codes 关联的档案编号列表 */
    archive_codes?: string;
    /** 关联的档案列表 */
    archives?: number[];
    /** Age 年龄 */
    age?: string;
  };

  type caseIdentityCasesParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
    /** 身份证号 */
    identity_id: string;
  };

  type CaseList = {
    /** Id 病例id */
    id?: number;
    /** Case code 病例编号（自动生成） */
    case_code?: string;
    /** Identity 身份证号 */
    identity: string;
    /** Identity name */
    identity_name?: string;
    /** Opd id 门诊号 */
    opd_id?: string;
    /** Inhospital id 住院号 */
    inhospital_id?: string;
    /** Name 姓名 */
    name: string;
    /** Gender 性别 0-女 1-男 */
    gender: 0 | 1;
    /** Birth date 出生年月日 */
    birth_date: string;
    /** Phone number 联系电话 */
    phone_number?: string;
    /** Home address 家庭住址 */
    home_address?: string;
    /** Blood type 血型 */
    blood_type?: string;
    /** Main diagnosis 主要诊断 */
    main_diagnosis?: string;
    /** Has transplant surgery 是否行移植手术,示例 是(2025-5-27) */
    has_transplant_surgery?: string;
    /** Is in transplant queue 是否存在移植排队 */
    is_in_transplant_queue?: string;
    /** Archive codes 关联的档案编号列表 */
    archive_codes?: string;
    /** Age 年龄 */
    age?: string;
  };

  type caseListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type casePartialUpdateParams = {
    /** 病例编号 */
    case_code: string;
  };

  type caseReadParams = {
    /** 病例编号 */
    case_code: string;
  };

  type caseUpdateParams = {
    /** 病例编号 */
    case_code: string;
  };

  type dataDeleteParams = {
    /** 自增id */
    id: number;
  };

  type dataListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type dataPartialUpdateParams = {
    /** 自增id */
    id: number;
  };

  type dataReadParams = {
    /** 自增id */
    id: number;
  };

  type DataTable = {
    /** Case code 病例编号 */
    case_code: string;
    /** Template code 模板编号 */
    template_code: string;
    /** Word code 词条编号 */
    word_code: string;
    /** Check time 检查时间 */
    check_time: string;
    /** Value 检查值 */
    value: string;
  };

  type DataTableDetail = {
    /** Id 自增id */
    id?: number;
    /** Case code */
    case_code?: string;
    /** Template category */
    template_category?: string;
    /** Template name */
    template_name?: string;
    /** Word name */
    word_name?: string;
    /** Value 值 */
    value: string;
    /** Check time 检查时间 */
    check_time: string;
  };

  type DataTemplate = {
    /** Id 数据模板id */
    id?: number;
    /** Template code 模板编号（自动生成） */
    template_code?: string;
    /** Template name 模板名称 */
    template_name: string;
    /** Template description 模板描述 */
    template_description?: string;
    /** Category 模板分类id */
    category: number;
    /** Category name */
    category_name?: string;
    dictionaries?: number[];
    dictionary_list?: Dictionary[];
  };

  type DataTemplateCategory = {
    /** Id 模板分类id */
    id?: number;
    /** Name 模板分类名称 */
    name: string;
    /** Template count 该分类下的模板数量 */
    template_count?: string;
  };

  type dataTemplateDeleteParams = {
    /** 模板编号 */
    template_code: string;
  };

  type dataTemplateListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type dataTemplatePartialUpdateParams = {
    /** 模板编号 */
    template_code: string;
  };

  type dataTemplateReadParams = {
    /** 模板编号 */
    template_code: string;
  };

  type dataTemplateUpdateParams = {
    /** 模板编号 */
    template_code: string;
  };

  type dataUpdateParams = {
    /** 自增id */
    id: number;
  };

  type Dictionary = {
    /** Id 词条id */
    id?: number;
    /** Word code 词条编号 (自动生成) */
    word_code?: string;
    /** Word name 中文名称 */
    word_name: string;
    /** Word eng 英文名称 */
    word_eng?: string;
    /** Word short 英文缩写 */
    word_short?: string;
    /** Word class 词条类型 */
    word_class: string;
    /** Word apply 词条应用 */
    word_apply: string;
    /** Word belong 从属别名 */
    word_belong?: string;
    /** Data type 数据类型，如数值类型、文本类型 */
    data_type?: string;
  };

  type dictionaryDeleteParams = {
    /** 词条编号 */
    word_code: string;
  };

  type dictionaryListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type dictionaryPartialUpdateParams = {
    /** 词条编号 */
    word_code: string;
  };

  type dictionaryReadParams = {
    /** 词条编号 */
    word_code: string;
  };

  type dictionaryUpdateParams = {
    /** 词条编号 */
    word_code: string;
  };

  type Identity = {
    /** Identity id 身份证号 */
    identity_id: string;
    /** Name 姓名 */
    name: string;
    /** Gender 性别 0-女 1-男 */
    gender: 0 | 1;
    /** Birth date 出生年月日 */
    birth_date: string;
    /** Case count 关联的病例数 */
    case_count?: string;
    /** Age 年龄 */
    age?: string;
  };

  type Login = {
    /** Username */
    username: string;
    /** Password */
    password: string;
  };

  type patientCaseDataParams = {
    /** 身份证号 */
    identity_id: string;
  };

  type PatientDetail = {
    /** Identity id 身份证号 */
    identity_id: string;
    /** Name 姓名 */
    name: string;
    /** Gender 性别 0-女 1-男 */
    gender: 0 | 1;
    /** Birth date 出生年月日 */
    birth_date: string;
    /** Age 年龄 */
    age?: string;
    case_list?: CaseList[];
  };

  type patientListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type patientPartialUpdateParams = {
    /** 身份证号 */
    identity_id: string;
  };

  type patientReadParams = {
    /** 身份证号 */
    identity_id: string;
  };

  type patientUpdateParams = {
    /** 身份证号 */
    identity_id: string;
  };

  type templateCategoryDeleteParams = {
    /** 模板分类id */
    id: number;
  };

  type templateCategoryListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type templateCategoryPartialUpdateParams = {
    /** 模板分类id */
    id: number;
  };

  type templateCategoryReadParams = {
    /** 模板分类id */
    id: number;
  };

  type templateCategoryUpdateParams = {
    /** 模板分类id */
    id: number;
  };

  type TokenObtainPair = {
    /** Username */
    username: string;
    /** Password */
    password: string;
  };

  type TokenRefresh = {
    /** Refresh */
    refresh: string;
    /** Access */
    access?: string;
  };

  type User = {
    /** ID */
    id?: number;
    /** Username Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only. */
    username: string;
    /** Email address */
    email?: string;
    /** Password */
    password: string;
  };
}
