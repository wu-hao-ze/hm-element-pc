<template>
  <div class="login-page">
    <!-- my-card是自定义类名，这里是element组件内置用法，可以直接给组件标签加类名，然后下面定义样式 -->
    <!-- 也可以直接使用组件标签名作为类名，也是内置用法，下面可以直接.el-card来写样式 -->
    <el-card class="my-card">
      <!-- header插槽 -->
      <!-- element组件内部必然写了<slot name="header"></slot> -->
      <template #header>
        <div>浩泽面经运营后台</div>
      </template>
      <!-- 下面是默认插槽 -->
      <!--
            实现表单校验：4个关键属性
            el-form 整个form组件
              :model 需要绑定一个对象，对象有着很多属性，每个属性都会和表单元素双向绑定。明确要校验的是哪个对象
              :rules 配置校验的规则，和下面的prop配合

            el-form-item 表单域，一行，可以存放格式类型的表单元素
              prop 属性值为表单域model字段，也就是form中的值，决定了校验效果的配置，必须对应(特别容易漏！！！)

            el-input 文本框
              v-model 和对象中的属性双向绑定，实时收集表单数据，和上面的:model配合
      -->
      <el-form ref="myForm" :model="form" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item class="tc">
          <el-button type="primary" @click="clickLogin">登录</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 原则：每次写导入的时候思考一下，要导入的是按需还是默认
import { login } from '@/api/user.js'

export default {
  name: 'LoginIndex',
  data () {
    return {
      form: {
        username: 'admin5',
        password: 'admin'
      },
      rules: {
        // 设置对应字段的校验规则
        // 1.required: true 必填
        // 2.message: xx    错误提示消息
        // 3.trigger: 'blur'/'change' 设置触发校验的时机，可选项就两个值
        // (1)blur 失去焦点校验
        // (2)change 实时校验，类似于输入框input事件的效果
        username: [
          { required: true, message: '请输入账户名称', trigger: ['change', 'blur'] },
          { min: 5, max: 11, message: '长度必须是5-11位', trigger: ['change', 'blur'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: ['change', 'blur'] },
          // \d 0-9
          // \w 数字字母下滑线
          // {m,n} 前一个字符可以出现m~n次(包含m n)
          { pattern: /^\w{5,11}$/, message: '请输入5-11位的字符', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  methods: {
    async clickLogin () {
      // 先校验整个表单，通过了校验，才发请求
      try {
        // validate或者下面的resetFields都是组件的方法，所以要通过$refs获取dom元素
        // validate：对整个表单进行校验的方法，参数为一个回调函数
        // 该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
        // 得到的promise对象，前面可以 await 处理，然后就会等待校正通过，才往下进行
        // 没有通过校验就会报错，通过try和catch捕获
        await this.$refs.myForm.validate()
        // 调用api的login方法，发送请求
        const res = await login(this.form)
        // 公司里面实际规范：将token等个人信息，存入vuex，便于各个页面组件访问 => 存storage(持久化存储)
        // vuex中的数据，类似于data中的数据，一旦刷新页面，就会重新初始化(vuex刷新会重新初始化数据)
        // 所有访问token，访问个人信息，一律找vuex。存本地就一个目的：保证刷新之后，vuex的数据还在
        this.$store.commit('user/setUserToken', res.data.token)
        // 注意：一定要等vuex token存好了，再跳首页
        this.$router.push('/')
      } catch (e) {
        console.log(e)
      }
    },
    reset () {
      // resetFields：对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.myForm.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
// 如何给组件标签设置样式？
// 1.可以给组件标签加自定义类
// .my-card {
//   width: 420px;
//   margin: 0 auto;
// }
// 2.直接使用组件标签名作为类名控制样式
// 组件库定义组件的规范: 声明的所有组件的根元素都有一个和组件名同名的类名，所以可以直接.el-card
.login-page {
  min-height: 100vh;
  background: url(@/assets/login-bg.svg) no-repeat center / cover;
  // 利用flex水平垂直居中
  display: flex;
  justify-content: center;
  align-items: center;

  .el-card {
    width: 420px;
    // vue为style节点提供了scoped属性，从而防止组件之间的样式冲突问题
    // scoped属性自动为每个组件分配唯一的自定义属性，并自动为当前组件的所有DOM元素以及style样式中写的选择器应用这个自定义属性
    // 也就是说上面的每一个DOM元素和style这里写的选择器的名称，在匹配元素的时候都会自带一个属性选择器
    // 所以如果这里直接写本组件上面没有的DOM元素的样式，是不会生效的
    // 比如el-card__header这个类名，就是通过插槽最后渲染到页面上的，那么在这里直接写这个类名，就会自动添加一个自定义属性
    // 那么因为el-card__header在页面上是不带有自定义属性的，所以这里的.el-card__header[自定义属性]是匹配不到的，也就不生效
    // 那么加上深度选择器之后，就会取消给这个选择器加自定义属性，也就可以匹配到.el-card__header了
    // 深度作用选择器:
    // ::v-deep   scss
    // /deep/     less

    // scoped唯独会影响其他子组件的就是子组件的根标签也会加上这里的自定义属性，子组件中的其他元素都不会加这个组件的自定义属性
    // 在当前组件内直接写子组件标签里的元素的样式是不生效的，如果想生效，需要使用/deep/深度选择器来取消自动添加自定义属性
    ::v-deep .el-card__header{
      height: 80px;
      background: rgb(222, 170, 225);
      text-align: center;
      line-height: 40px;
      color: #fff;
      font-size: 18px;
    }
  }
  .el-form {
    padding: 0 20px;
  }
  .tc {
    text-align: center;
  }
}

</style>
