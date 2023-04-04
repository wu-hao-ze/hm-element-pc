<template>
  <div class="article-page">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>面经后台</el-breadcrumb-item>
      <el-breadcrumb-item>面经管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card shadow="never" border="false">
      <!-- 配置头部插槽 -->
      <template #header>
        <div class="header">
          <span>共 {{ total }} 条记录</span>
          <el-button @click="openDrawer('add')" icon="el-icon-plus" size="small" type="primary" round>
            添加面经
          </el-button>
        </div>
      </template>
      <!-- 内容部分
           el-table 表格
           el-table-column 表格的列，其中的属性：label是列名，prop是渲染的数据
      -->
      <el-table :data="list" style="width: 100%">
        <el-table-column prop="stem" label="标题" width="300"></el-table-column>
        <el-table-column prop="creator" label="作者"></el-table-column>
        <el-table-column prop="likeCount" label="点赞"></el-table-column>
        <el-table-column prop="views" label="浏览数"></el-table-column>
        <el-table-column prop="createdAt" label="更新时间" width="250"></el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <!-- 作用域插槽，内部封装的row表示这一行的数据对象 -->
            <!-- 其实内部还有一个$index表示下标 -->
            <div class="actions">
              <i class="el-icon-view" @click="openDrawer('preview', row.id)"></i>
              <i class="el-icon-edit-outline" @click="openDrawer('edit', row.id)"></i>
              <i class="el-icon-delete" @click="del(row.id)"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--
        分页功能
        @size-change                       每页条数变化，每页10条 => 每页20条
        @current-change                    当前页变化，重新加载数据
        :current-page="当前页"             绑定当前生效的是第几页，可以控制高亮
        :page-sizes="[100, 200, 300, 400]" 可供选择的每页数据
        :page-size="100"                   当前生效的每页条数
        :total="值"                        总数量
        layout                             布局容器，设定有哪些控件展示在页面中
        background                         给分页加背景颜色
       -->
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-size="pageSize"
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="[4, 5, 8, 10]"
        @size-change="handleSizeChange"
      ></el-pagination>
    </el-card>
    <!--
        有些时候Dialog弹出框组件并不满足我们的需求，比如表单很长亦或是需要临时展示一些文档
        Drawer拥有和Dialog几乎相同的API，在UI上带来不一样的体验
        title             配置标题
        :visible.sync     绑定一个布尔值，控制显示隐藏(.sync修饰符 后面人资讲)
        direction="rtl"   弹出方式，从右侧弹出是rtl，right to left
        before-close      处理弹框关闭事件
    -->
    <el-drawer
      direction="rtl"
      size="50%"
      :title="drawerTitle"
      :visible.sync="isShowDrawer"
      :before-close="handleClose"
    >
      <div v-if="drawerType === 'preview'" class="article-preview">
        <h5>{{ form.stem }}</h5>
        <div v-html="form.content"></div>
      </div>
      <!-- 接下来是表单验证，在表单中加入富文本编辑器 -->
      <el-form v-else ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="stem">
          <el-input v-model="form.stem" placeholder="输入面经标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- 注意quill-editor不是element的元素，所以不受element的rules的失去焦点校验的控制，而是要手动绑定事件 -->
          <!-- validateField是对整个表单的部分内容做校验 -->
          <quill-editor v-model="form.content" @blur="$refs.form.validateField('content')"></quill-editor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit">确认</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { createArticle, getArticleDetail, getArticleList, removeArticle, updateArticle } from '@/api/article'
// 下面是富文本编辑器的导入
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'article-page',
  components: {
    quillEditor
  },
  data () {
    return {
      list: [], // 文章列表
      current: 1, // 当前页
      pageSize: 5, // 每页条数
      total: 0, // 总条数
      isShowDrawer: false, // 默认不显示抽屉
      drawerType: '', // 弹框操作类型   取值为 add preview edit
      form: {
        stem: '', // 表单的标题
        content: '' // 表单的内容
      },
      rules: {
        stem: [{ required: true, message: '请输入面经标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入面经内容', trigger: 'blur' }]
      }
    }
  },
  computed: {
    drawerTitle () {
      let title = '默认标题'
      if (this.drawerType === 'add') title = '添加面经'
      if (this.drawerType === 'preview') title = '面经预览'
      if (this.drawerType === 'edit') title = '修改面经'
      return title
    }
  },
  async created () {
    this.initData()
  },
  methods: {
    // 根据当前页和每页条数，初始化数据
    async initData () {
      const { data } = await getArticleList({
        current: this.current,
        pageSize: this.pageSize
      })
      console.log(data)
      this.list = data.rows
      this.total = data.total
    },
    async del (id) {
      await removeArticle(id)
      this.$message.success('删除成功')
      this.initData() // 重新渲染
    },
    handleSizeChange (val) {
      // 这个函数内置一个参数，值为每页多少条
      this.pageSize = val
      this.initData()
    },
    handleCurrentChange (val) {
      // 这个函数内置一个参数，值为当前页
      this.current = val
      this.initData()
    },
    async openDrawer (type, id) {
      // type的值add preview edit => 对应(自动)设置标题 => 计算属性
      this.drawerType = type
      this.isShowDrawer = true // 显示弹框
      // 除了添加，编辑和预览都要回显
      if (type !== 'add') {
        const res = await getArticleDetail(id)
        // 将res.data的所有数据展开到form中用于回显，注意这一步就会给form直接新增很多属性和属性值，比如id，avatar，likeCount等
        this.form = {
          ...res.data
        }
      }
    },
    handleClose () {
      // 预览时是没有form的ref，可以在上面看到预览在form的上面，所以无法使用this.$refs.form重置表单
      // 但是关闭时仍然要重置表单，所以可以手动把form元素清零
      this.form = { stem: '', content: '' }
      if (this.drawerType !== 'preview') {
        // 如果是add edit，则调用resetFields重置校验状态
        this.$refs.form.resetFields()
      }
      this.isShowDrawer = false // 关闭弹框
    },
    async submit () {
      try {
        // 校验表单
        await this.$refs.form.validate()
        if (this.drawerType === 'add') {
          await createArticle(this.form)
          this.$message.success('添加成功')
        }
        if (this.drawerType === 'edit') {
          const { id, stem, content } = this.form
          await updateArticle({ id, stem, content })
          this.$message.success('修改成功')
        }
        // 后端接口设置的无论是修改还是添加，都会把该内容加到第一页，所以我们要重置页码
        this.current = 1
        this.initData() // 重新渲染
        this.handleClose() // 关闭弹框
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 25px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 16px;
  }
  .actions {
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    color: #666;
    > i:hover {
      color: rgba(114, 124, 245, 1);
      cursor: pointer;
    }
  }
}
.el-pagination {
  margin-top: 20px;
  text-align: center;
}
.el-breadcrumb {
  margin-top: 10px;
}
.el-form {
  padding-right: 40px;
}
.quill-editor {
  ::v-deep .ql-editor {
    height: 300px;
  }
}
.el-rate {
  padding: 10px 0;
}
.article-preview {
  padding: 0 40px 40px 40px;
  > h5 {
    font-size: 20px;
    color: #666;
    border-bottom: 1px dashed #ccc;
    padding-bottom: 30px;
    margin: 0 0 20px 0;
  }
}
</style>
