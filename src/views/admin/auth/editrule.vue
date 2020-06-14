<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="权限名称">
        <el-input v-model="form.desc" />
      </el-form-item>
      <el-form-item label="权限路径">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          style="display: block;margin-top:10px"
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
import { getRule,updateRule } from "@/api/rule";

export default {
  data() {
    return {
      form: {
        desc: "",
        name: "",
        status: -1
      }
    };
  },
  async created() {
    const id = this.$route.query.id;
    this.form = (await getRule({ id })).ruleinfo;
  },
  methods: {
    async onSubmit() {
      const form = this.form;
      //简单判断用户是否将信息填写完整
      console.log(form)
      const key = !Object.keys(form).some(
        (key, index) => form[key].length === 0
      );
      if (key) {
        let res = await updateRule(form);
        if (res.status === 0) {
          this.$router.push({
            path: "/user/authlist"
          });
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

