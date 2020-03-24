const schemePage = {
  namespaced: true,
  state: {

    division: '#_#&$_$&^_^&*_*', // scheme 特定分割符 (目前用于海报焦点图)

    component: null, // 当前编辑的组件
    componentRoot: null, // 当前编辑的组件的根

    hoverComponentType: '', // 当前鼠标悬停的 组件类型 用于 actionBar 模块元素之间操作条的展示问题

    nowPageType: 0, // 当前模式 0 预览 1 编辑 2 归档
    showStatus: {
      componentLibrary: false, // 组件库选择区

      componentAssemble: false, // 组件组装区
      componentAssemble_main: false, // 组件组装区-主体
      componentAssemble_radioChange: false, // 组件组装区-页面切换块
      componentAssemble_module_actionBar: false, // 编辑器-模块操作条
      componentAssemble_module_drag: false, // 编辑器-模块拖拽  ****暂没用到
      componentAssemble_element_actionBar: false, // 编辑器-元素操作条
      componentAssemble_module_individualizationBar: false, // 个性化操作条
      // componentAssemble_element_drag: false, // 编辑器-元素拖拽

      componentIndex: false, // 组件索引区
      componentIndex_main: false, // 组件索引区-主体
      componentIndex_operation: false, // 组件索引区-操作块
      componentIndex_preview: false, // 组件索引区-预览
      componentIndex_pdf: false, // 组件索引区-导出pdf
      componentIndex_save: false, // 组件索引区-保存编辑
      componentIndex_exit: false // 组件索引区-退出 编辑/预览

    },

    highlightModuleTimeout: null, // 高亮定时器
    highlightModuleName: null, // 高亮模块名

    elementZindex: 2, // 所有模块中最大的层级

    InToViewHighlight: '', // 高亮模块名-设置背景色

    componentPreviewModule: null, // 预览时的module

    libraryGroup: '' // 当前点击的元素库

  },
  mutations: {
    // 初始化预览模式的状态
    initPreviewState (state) {
      state.nowPageType = 0
      state.showStatus = {
        componentLibrary: false, // 组件库选择区

        componentAssemble: true, // 组件组装区
        componentAssemble_main: true, // 组件组装区-主体 ****暂没用到
        componentAssemble_radioChange: true, // 组件组装区-页面切换块
        componentAssemble_module_actionBar: false, // 编辑器-模块操作条
        componentAssemble_module_drag: false, // 编辑器-模块拖拽  ****暂没用到
        componentAssemble_element_actionBar: false, // 编辑器-元素操作条
        componentAssemble_module_individualizationBar: true,
        // componentAssemble_element_drag: false, // 编辑器-元素拖拽

        componentIndex: true, // 组件索引区
        componentIndex_main: true, // 组件索引区-主体
        componentIndex_operation: true, // 组件索引区-操作块
        componentIndex_preview: false, // 组件索引区-预览
        componentIndex_pdf: true, // 组件索引区-导出pdf
        componentIndex_save: false, // 组件索引区-保存编辑
        componentIndex_exit: true, // 组件索引区-退出 编辑/预览

        componentHasPadding: false // 页面是否拥有上下内边距
      }
    },
    // 初始化编辑模式的状态
    initEditState (state) {
      state.nowPageType = 1
      state.showStatus = {
        componentLibrary: true, // 组件库选择区

        componentAssemble: true, // 组件组装区
        componentAssemble_main: true, // 组件组装区-主体 ****暂没用到
        componentAssemble_radioChange: true, // 组件组装区-页面切换块
        componentAssemble_module_actionBar: true, // 编辑器-模块操作条
        componentAssemble_module_drag: true, // 编辑器-模块拖拽  ****暂没用到
        componentAssemble_element_actionBar: true, // 编辑器-元素操作条
        componentAssemble_module_individualizationBar: true,
        // componentAssemble_element_drag: true, // 编辑器-元素拖拽

        componentIndex: true, // 组件索引区
        componentIndex_main: true, // 组件索引区-主体
        componentIndex_operation: true, // 组件索引区-操作块
        componentIndex_preview: true, // 组件索引区-预览
        componentIndex_pdf: true, // 组件索引区-导出pdf
        componentIndex_save: true, // 组件索引区-保存编辑
        componentIndex_exit: true, // 组件索引区-退出 编辑/预览

        componentHasPadding: true // 页面是否拥有上下内边距
      }
    },
    // 初始化归档模式的状态
    initFileState (state) {
      state.nowPageType = 2
      state.showStatus = {
        componentLibrary: false, // 组件库选择区

        componentAssemble: true, // 组件组装区
        componentAssemble_main: true, // 组件组装区-主体 ****暂没用到
        componentAssemble_radioChange: true, // 组件组装区-页面切换块
        componentAssemble_module_actionBar: true, // 编辑器-模块操作条
        componentAssemble_module_drag: false, // 编辑器-模块拖拽  ****暂没用到
        componentAssemble_element_actionBar: true, // 编辑器-元素操作条
        componentAssemble_module_individualizationBar: true,
        // componentAssemble_element_drag: false, // 编辑器-元素拖拽

        componentIndex: true, // 组件索引区
        componentIndex_main: true, // 组件索引区-主体
        componentIndex_operation: true, // 组件索引区-操作块
        componentIndex_preview: false, // 组件索引区-预览
        componentIndex_pdf: true, // 组件索引区-导出pdf
        componentIndex_save: false, // 组件索引区-保存编辑
        componentIndex_exit: true, // 组件索引区-退出 编辑/预览

        componentHasPadding: true // 页面是否拥有上下内边距
      }
    },

    // 展示编辑框
    showComponentEditor (state, data) {
      if (data.type === 'module') {
        state.componentRoot = null
      } else if (data.type === 'element') {
        state.componentRoot = data.componentRoot
      }
      state.component = data.component
    },
    // 隐藏编辑框
    hideComponentEditor (state) {
      state.component = null
      state.componentRoot = null
    },
    // 鼠标悬停元素组件
    hoverElementComponent (state) {
      state.hoverComponentType = 'element'
    },
    // 鼠标离开元素组件
    leaveElementComponent (state) {
      state.hoverComponentType = ''
    },

    // 设置导航高亮
    scrollInToViewHighlight (state, data) {
      clearTimeout(state.highlightModuleTimeout)
      state.highlightModuleName = data
      state.InToViewHighlight = data
      state.highlightModuleTimeout = setTimeout(() => {
        state.highlightModuleName = null
      }, 5000)
    },

    rollNavHighlightBackgrond (state, data) {
      state.InToViewHighlight = data
    },

    setElementZindex (state, data) {
      state.elementZindex = data
    },

    setComponentPreviewModule (state, data) {
      state.componentPreviewModule = data
    },

    setLibraryGroup (state, data) {
      state.libraryGroup = data
    }
  }
}

export default schemePage
