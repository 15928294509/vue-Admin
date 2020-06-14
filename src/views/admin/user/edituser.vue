<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" show-password placeholder="不修改密码请置空" />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="form.verifypassword" show-password placeholder="不修改密码请置空" />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="form.mobile" />
      </el-form-item>
      <el-form-item label="管理角色选择">
        <el-select v-model="form.role_id" placeholder="该用户没有角色">
          <el-option
            v-for="(role,index) in rolelist"
            :key="index"
            :label="role.desc"
            :value="role.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-switch
          style="display: block"
          v-model="form.status"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="-1"
          active-text="启用"
          inactive-text="禁用"
        ></el-switch>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getUser, updateUser } from "@/api/admin";
import { getroleList } from "@/api/role";

export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
        verifypassword: "",
        mobile: "",
        role_id: 1,
        status: 0
      },
      rolelist: []
    };
  },
  async created() {
    const userid = this.$route.query.id;
    this.form = (await getUser({ id: userid })).userinfo;
    console.log(this.form);
  },
  async beforeMount() {
    this.rolelist = (await getroleList()).rolelist;
  },
  methods: {
    async onSubmit() {
      console.log(this.form);
      if (this.form.password) {
        if (this.form.password === this.form.verifypassword) {
          var res = await updateUser(this.form);
          if (res.status === 0) {
            this.$message({
              message: "修改成功!",
              type: "success"
            });
            this.$router.push({
              path: "/user/userlist"
            });
          }
        } else {
          this.$message({
            message: "两次密码不一致!",
            type: "warning"
          });
        }
      } else {
        res = await updateUser(this.form);
        if (res.status === 0) {
          this.$message({
            message: "修改成功!",
            type: "success"
          });
          this.$router.push({
            path: "/user/userlist"
          });
        }
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

