<template>
  <div>
    <h3>对话框的使用</h3>
    <el-button @click="isShow = true">显示弹框</el-button>
    <el-dialog
      title="提示"
      width="30%"
      :visible.sync="isShow"
      @close="handleClose"
    >
      <el-form label-width="80px">
        <el-form-item label="分类名称">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="分类别名">
          <el-input></el-input>
        </el-form-item>
      </el-form>
      <!-- 具名插槽配置底部 -->
      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </el-dialog>
    <h3>确认框的使用</h3>
    <button @click="showConfirm">显示确认框</button>
  </div>
</template>

<script>
export default {
  name: 'TestIndex',
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    handleClose () {
      this.isShow = false
    },
    async showConfirm () {
      try {
        await this.$confirm('亲, 你确认要进行退出操作么?', '温馨提示', {
          confirmButtonText: 'yes',
          cancelButtonText: 'no',
          type: 'warning'
        })
        this.$message.success('已确认退出')
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>

</style>
