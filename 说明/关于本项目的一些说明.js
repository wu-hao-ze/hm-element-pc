// 首先一定要根目录打开，因为有eslint，然后启用工作区的eslint，注意一定要工作区打开！！！
// 在设置中的settings.json中加入如下
// "editor.codeActionsOnSave": {
//   "source.fixAll": true
// },
// 然后取消保存时自动格式化，因为上面的设置就自动在保存时通过eslint来格式化，而不需要本身的格式化，要不然会冲突

// 然后一定要去vue.config.js中添加publicPath: './'

// 本项目技术栈基于vue2、vuex3、vue-router3、vue-cli5、axios和element-ui
// 在vue create hm-element-pc之后选择vuex，router等，然后css预处理器这里选择scss

// sass/scss语法说明：
// less sass stylus 都是 css 预处理器，语法上稍有差异，作用一样，都是让css增强，具备变量，函数等的能力
// sass的语法两种语法：sass(旧)，scss(新)
// sass和stylus语法很像(了解)
// 要求省略 {} 和 分号，缩进表示嵌套等

// scss和less语法很像，都支持嵌套，变量...
// scss 声明变量：$变量名
// less 声明变量: @变量名
// 在style标签中使用lang="scss"

// src目录下的新增的文件夹的含义
// api：接口方法封装
// store：vuex仓库
// styles：全局样式
// utils：自己封装的一些工具函数，比如
// views：视图组件，用于路由切换
// components：通用组件，可复用的ui结构
// 其余含义不变

// 引入element-ui组件库，官方文档: https://element.eleme.io/#/zh-CN
// 先装包：npm i element-ui -S        yarn add element-ui
// 注意！！！！配置了ESLint之后就无法用npm装包了，但是可以使用yarn
// 可以使用npm i 包名 --legacy-peer-deps
// 或者npm i 包名 -force/--force都行
// 分为全部导入和按需导入
// 全部导入：
// 在main.js中写入
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);
// 注意pc端不纠结按需还是全部，所以都行，而移动端要求较高，所以一定要按需导入
// element-ui中按需有时候有问题，所以不如直接全局导入

// 按需导入(可以减轻将来打包后的包的体积)：
// 借助 babel-plugin-component，我们可以只引入需要的组件，以达到减小项目体积的目的
// npm install babel-plugin-component -D          yarn add babel-plugin-component -D
// 然后，将babel.config.js修改，之后就可以引入部分组件，抽离到utils中的element.js导入注册

// element-ui定制主题
// vant是基于less，element-ui是基于scss，如果你的项目也使用了SCSS，那么可以直接在项目中改变 Element 的样式变量
// 可以在styles中的index.scss中定制主题，然后在main.js中导入该scss文件

// 一般项目开发中都会对axios进行基本的二次封装，单独封装到一个模块中，便于使用
// 新建utils/request.js封装axios模块，新建utils/storage.js封装本地存储模块

// 路由设计：但凡是单个页面，独立展示的，都是一级路由(登录，注册，首页架子，文章详情...)
// 登录页(一级)login  首页架子(一级) layout   首页架子下面有：数据看板(二级)dashboard   文章管理(二级)article
// 一个模块一个文件夹，如果大项目比如views下面的article中可能会用到一些自己复用的组件，也可以自己再新建一个component组件

// 富文本编辑器：https://www.npmjs.com/package/vue-quill-editor
// 基于 Quill、适用于 Vue 的富文本编辑器，支持服务端渲染和单页应用
// 装包：npm install vue-quill-editor --save
// 然后可以全局注册使用，也可以局部注册使用
// 全局的话：
// import Vue from 'vue'
// import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// Vue.use(VueQuillEditor)

// 局部组件注册的话：
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
// import { quillEditor } from 'vue-quill-editor'
// export default {
//   components: {
//     quillEditor
//   }
// }

// 使用时在结构中使用quill-editor标签，可以使用v-model来双向绑定控制该富文本编辑器
// <quill-editor v-model=""></quill-editor>
