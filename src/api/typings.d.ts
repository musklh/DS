declare namespace API {
  type AnalysisSheet = {
    /** Id */
    id?: number;
    /** Analysis table id */
    analysis_table_id: number;
    /** Sheet code */
    sheet_code: string;
    /** Sheet name */
    sheet_name: string;
    /** Remark */
    remark?: string;
  };

  type analysisSheetDeleteParams = {
    /** A unique integer value identifying this analysis sheet. */
    id: number;
  };

  type analysisSheetListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type analysisSheetPartialUpdateParams = {
    /** A unique integer value identifying this analysis sheet. */
    id: number;
  };

  type analysisSheetReadParams = {
    /** A unique integer value identifying this analysis sheet. */
    id: number;
  };

  type analysisSheetUpdateParams = {
    /** A unique integer value identifying this analysis sheet. */
    id: number;
  };

  type Archive = {
    /** Id */
    id: number;
    /** Arcive id */
    arcive_id: string;
    /** Archive name */
    archive_name: string;
    /** Description */
    description?: string;
  };

  type ArchiveCaseRelative = {
    /** Id */
    id: number;
    /** Archive id */
    archive_id: string;
    /** Case id */
    case_id: string;
  };

  type archiveCaseRelativesDeleteParams = {
    /** A unique value identifying this archive case relative. */
    id: number;
  };

  type archiveCaseRelativesListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type archiveCaseRelativesPartialUpdateParams = {
    /** A unique value identifying this archive case relative. */
    id: number;
  };

  type archiveCaseRelativesReadParams = {
    /** A unique value identifying this archive case relative. */
    id: number;
  };

  type archiveCaseRelativesUpdateParams = {
    /** A unique value identifying this archive case relative. */
    id: number;
  };

  type archivesDeleteParams = {
    /** A unique value identifying this archive. */
    id: number;
  };

  type archivesListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type archivesPartialUpdateParams = {
    /** A unique value identifying this archive. */
    id: number;
  };

  type archivesReadParams = {
    /** A unique value identifying this archive. */
    id: number;
  };

  type archivesUpdateParams = {
    /** A unique value identifying this archive. */
    id: number;
  };

  type BaseInfo = {
    /** Id */
    id: number;
    /** Case id */
    case_id: string;
    /** Name */
    name: string;
    /** Name code */
    name_code: string;
    /** Category */
    category: string;
    /** Category code */
    category_code: string;
    /** Type */
    type: string;
    /** Type code */
    type_code: string;
    /** Value */
    value: string;
  };

  type baseInfoDeleteParams = {
    /** A unique value identifying this base info. */
    id: number;
  };

  type baseInfoListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type baseInfoPartialUpdateParams = {
    /** A unique value identifying this base info. */
    id: number;
  };

  type baseInfoReadParams = {
    /** A unique value identifying this base info. */
    id: number;
  };

  type baseInfoUpdateParams = {
    /** A unique value identifying this base info. */
    id: number;
  };

  type Cases = {
    /** Id */
    id?: string;
    /** Case id */
    case_id: string;
    /** Identity id */
    identity_id: string;
    /** Inhospital id */
    inhospital_id?: string;
  };

  type casesDeleteParams = {
    /** A unique value identifying this cases. */
    id: number;
  };

  type casesListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type casesPartialUpdateParams = {
    /** A unique value identifying this cases. */
    id: number;
  };

  type casesReadParams = {
    /** A unique value identifying this cases. */
    id: number;
  };

  type casesUpdateParams = {
    /** A unique value identifying this cases. */
    id: number;
  };

  type categoriesDeleteParams = {
    /** A unique value identifying this data template category. */
    id: number;
  };

  type categoriesListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type categoriesPartialUpdateParams = {
    /** A unique value identifying this data template category. */
    id: number;
  };

  type categoriesReadParams = {
    /** A unique value identifying this data template category. */
    id: number;
  };

  type categoriesUpdateParams = {
    /** A unique value identifying this data template category. */
    id: number;
  };

  type ClinicalInfo = {
    /** ID */
    id?: number;
    /** Name */
    name: string;
    /** Name code */
    name_code: string;
    /** Case id */
    case_id: string;
  };

  type clinicalInfoDeleteParams = {
    /** A unique integer value identifying this clinical info. */
    id: number;
  };

  type clinicalInfoListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type clinicalInfoPartialUpdateParams = {
    /** A unique integer value identifying this clinical info. */
    id: number;
  };

  type clinicalInfoReadParams = {
    /** A unique integer value identifying this clinical info. */
    id: number;
  };

  type clinicalInfoUpdateParams = {
    /** A unique integer value identifying this clinical info. */
    id: number;
  };

  type DataTable = {
    /** Id */
    id: number;
    /** Case id */
    case_id: number;
    /** Table name */
    table_name: string;
    /** Data template id */
    data_template_id: number;
  };

  type dataTablesDeleteParams = {
    /** A unique value identifying this data table. */
    id: number;
  };

  type dataTablesListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type dataTablesPartialUpdateParams = {
    /** A unique value identifying this data table. */
    id: number;
  };

  type dataTablesReadParams = {
    /** A unique value identifying this data table. */
    id: number;
  };

  type dataTablesUpdateParams = {
    /** A unique value identifying this data table. */
    id: number;
  };

  type DataTemplateCategory = {
    /** Id */
    id: number;
    /** Name */
    name: string;
  };

  type DataTemplates = {
    /** Id */
    id?: string;
    /** Name */
    name: string;
    /** Description */
    description?: string;
    /** Category id */
    category_id: number;
    /** Category name */
    category_name?: string;
    /** Used n */
    used_n?: number;
  };

  type dataTemplatesDeleteParams = {
    /** A unique value identifying this data template. */
    id: number;
  };

  type dataTemplatesListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type dataTemplatesPartialUpdateParams = {
    /** A unique value identifying this data template. */
    id: number;
  };

  type dataTemplatesReadParams = {
    /** A unique value identifying this data template. */
    id: number;
  };

  type dataTemplatesUpdateParams = {
    /** A unique value identifying this data template. */
    id: number;
  };

  type Dictionary = {
    /** Id */
    id?: number;
    /** Word code */
    word_code: string;
    /** Word name */
    word_name: string;
    /** Word eng */
    word_eng?: string;
    /** Word short */
    word_short?: string;
    /** Word class */
    word_class: string;
    /** Word apply */
    word_apply: string;
    /** Word belong */
    word_belong?: string;
  };

  type dictionaryDeleteParams = {
    /** A unique integer value identifying this dictionary. */
    id: number;
  };

  type dictionaryListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type dictionaryPartialUpdateParams = {
    /** A unique integer value identifying this dictionary. */
    id: number;
  };

  type dictionaryReadParams = {
    /** A unique integer value identifying this dictionary. */
    id: number;
  };

  type dictionaryUpdateParams = {
    /** A unique integer value identifying this dictionary. */
    id: number;
  };

  type DocumentChart = {
    /** Id */
    id: number;
    /** Document id */
    document_id: number;
    /** Chart id */
    chart_id: number;
    /** X */
    x: number;
    /** Y */
    y: number;
    /** Height */
    height: number;
    /** Width */
    width: number;
  };

  type documentChartsDeleteParams = {
    /** A unique value identifying this document chart. */
    id: number;
  };

  type documentChartsListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type documentChartsPartialUpdateParams = {
    /** A unique value identifying this document chart. */
    id: number;
  };

  type documentChartsReadParams = {
    /** A unique value identifying this document chart. */
    id: number;
  };

  type documentChartsUpdateParams = {
    /** A unique value identifying this document chart. */
    id: number;
  };

  type Documents = {
    /** Id */
    id: number;
    /** Title */
    title: string;
    /** Author */
    author?: string;
    /** Description */
    description?: string;
    /** Properties */
    properties: string;
  };

  type documentsDeleteParams = {
    /** A unique value identifying this documents. */
    id: number;
  };

  type documentsListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type documentsPartialUpdateParams = {
    /** A unique value identifying this documents. */
    id: number;
  };

  type documentsReadParams = {
    /** A unique value identifying this documents. */
    id: number;
  };

  type documentsUpdateParams = {
    /** A unique value identifying this documents. */
    id: number;
  };

  type ExaminationImages = {
    /** Id */
    id: number;
    /** Examination sheet id */
    examination_sheet_id: number;
    /** Url */
    url: string;
    /** Remark */
    remark?: string;
  };

  type examinationImagesDeleteParams = {
    /** A unique value identifying this examination images. */
    id: number;
  };

  type examinationImagesListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type examinationImagesPartialUpdateParams = {
    /** A unique value identifying this examination images. */
    id: number;
  };

  type examinationImagesReadParams = {
    /** A unique value identifying this examination images. */
    id: number;
  };

  type examinationImagesUpdateParams = {
    /** A unique value identifying this examination images. */
    id: number;
  };

  type ExaminationSheet = {
    /** Id */
    id: number;
    /** Data table id */
    data_table_id: number;
    /** Case id */
    case_id?: number;
    /** Name */
    name: string;
    /** Name code */
    name_code: string;
    /** Category */
    category: string;
    /** Category code */
    category_code: string;
    /** Diagnosis */
    diagnosis: string;
    /** Description */
    description?: string;
    /** Exam date */
    exam_date: string;
    /** Inspector */
    inspector?: string;
  };

  type examinationSheetsDeleteParams = {
    /** A unique value identifying this examination sheet. */
    id: number;
  };

  type examinationSheetsListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type examinationSheetsPartialUpdateParams = {
    /** A unique value identifying this examination sheet. */
    id: number;
  };

  type examinationSheetsReadParams = {
    /** A unique value identifying this examination sheet. */
    id: number;
  };

  type examinationSheetsUpdateParams = {
    /** A unique value identifying this examination sheet. */
    id: number;
  };

  type Identity = {
    /** Id */
    id: number;
    /** Identity id */
    identity_id: string;
    /** True name */
    true_name: string;
    /** Gender */
    gender: number;
    /** Birth date */
    birth_date: string;
  };

  type identityDeleteParams = {
    /** A unique value identifying this identity. */
    id: number;
  };

  type identityListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type identityPartialUpdateParams = {
    /** A unique value identifying this identity. */
    id: number;
  };

  type identityReadParams = {
    /** A unique value identifying this identity. */
    id: number;
  };

  type identityUpdateParams = {
    /** A unique value identifying this identity. */
    id: number;
  };

  type Image = {
    /** Id */
    id: number;
    /** Document id */
    document_id: number;
    /** Url */
    url: string;
    /** Remark */
    remark?: string;
    /** X */
    x: number;
    /** Y */
    y: number;
    /** Height */
    height: number;
    /** Width */
    width: number;
    /** Is stroke */
    is_stroke: number;
    /** Stroke weight */
    stroke_weight: number;
    /** Stroke color */
    stroke_color: string;
  };

  type imagesDeleteParams = {
    /** A unique value identifying this image. */
    id: number;
  };

  type imagesListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type imagesPartialUpdateParams = {
    /** A unique value identifying this image. */
    id: number;
  };

  type imagesReadParams = {
    /** A unique value identifying this image. */
    id: number;
  };

  type imagesUpdateParams = {
    /** A unique value identifying this image. */
    id: number;
  };

  type Login = {
    /** Username */
    username: string;
    /** Password */
    password: string;
  };

  type Shape = {
    /** Id */
    id: number;
    /** Document id */
    document_id: number;
    /** X */
    x: number;
    /** Y */
    y: number;
    /** Height */
    height: number;
    /** Width */
    width: number;
    /** Is fill */
    is_fill: number;
    /** Fill color */
    fill_color: string;
    /** Is stroke */
    is_stroke: number;
    /** Stroke color */
    stroke_color: string;
    /** Path */
    path: string;
  };

  type shapesDeleteParams = {
    /** A unique value identifying this shape. */
    id: number;
  };

  type shapesListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type shapesPartialUpdateParams = {
    /** A unique value identifying this shape. */
    id: number;
  };

  type shapesReadParams = {
    /** A unique value identifying this shape. */
    id: number;
  };

  type shapesUpdateParams = {
    /** A unique value identifying this shape. */
    id: number;
  };

  type TestingSheet = {
    /** Id */
    id: number;
    /** Data table id */
    data_table_id: number;
    /** Case id */
    case_id?: number;
    /** Name */
    name: string;
    /** Name code */
    name_code: string;
    /** Name eng */
    name_eng: string;
    /** Name short */
    name_short: string;
    /** Category */
    category: string;
    /** Category code */
    category_code: string;
    /** Type */
    type: string;
    /** Type code */
    type_code: string;
    /** Value */
    value: string;
    /** Test date */
    test_date: string;
    /** Inspector */
    inspector?: string;
  };

  type testingSheetsDeleteParams = {
    /** A unique value identifying this testing sheet. */
    id: number;
  };

  type testingSheetsListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type testingSheetsPartialUpdateParams = {
    /** A unique value identifying this testing sheet. */
    id: number;
  };

  type testingSheetsReadParams = {
    /** A unique value identifying this testing sheet. */
    id: number;
  };

  type testingSheetsUpdateParams = {
    /** A unique value identifying this testing sheet. */
    id: number;
  };

  type Text = {
    /** Id */
    id: number;
    /** Document id */
    document_id: number;
    /** X */
    x: number;
    /** Y */
    y: number;
    /** Height */
    height: number;
    /** Width */
    width: number;
    /** Family */
    family: string;
    /** Size */
    size: number;
    /** Color */
    color: string;
    /** Weight */
    weight: number;
    /** Underline */
    underline: number;
    /** Slope */
    slope: number;
  };

  type textsDeleteParams = {
    /** A unique value identifying this text. */
    id: number;
  };

  type textsListParams = {
    /** A page number within the paginated result set. */
    page?: number;
    /** Number of results to return per page. */
    page_size?: number;
  };

  type textsPartialUpdateParams = {
    /** A unique value identifying this text. */
    id: number;
  };

  type textsReadParams = {
    /** A unique value identifying this text. */
    id: number;
  };

  type textsUpdateParams = {
    /** A unique value identifying this text. */
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
