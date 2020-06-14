<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" show-password />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="form.verifypassword" show-password />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="form.mobile" />
      </el-form-item>
      <el-form-item label="管理角色选择">
        <el-select v-model="form.role_id" placeholder="please select your zone">
          <el-option
            v-for="(role,index) in rolelist"
            :key="index"
            :label="role.desc"
            :value="role.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addUser } from "@/api/admin";
import { getroleList } from "@/api/role";

export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
        verifypassword: "",
        mobile: "",
        role_id: 1
      },
      rolelist: []
    };
  },
  async beforeMount() {
    this.rolelist = (await getroleList()).rolelist;
    console.log(this.rolelist);
  },
  methods: {
    async onSubmit() {
      // this.$router.push("/user/userlist");
      console.log(this.form);
      const form = this.form;
      //简单判断用户是否将信息填写完整
      const key = !Object.keys(form).some(
        (key, index) => form[key].length === 0
      );
      if (key) {
        //判断两次密码是否一致
        if (form.password === form.verifypassword) {
          let res = await addUser(this.form);
          if (res.status === 0) {
            this.$router.push("/user/userlist");
            this.$message({
              message: res.msg,
              type: "success"
            });
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        } else {
          this.$message({
            message: "两次密码输出不一致",
            type: "warning"
          });
        }
      } else {
        this.$message({
          message: "请将信息填完整",
          type: "warning"
        });
      }
    },
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning"
      });
    }
  }
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

