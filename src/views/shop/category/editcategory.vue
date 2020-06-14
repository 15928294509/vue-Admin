<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="分类名称">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateCategory } from "@/api/category";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  data() {
    return {
      form: {
        title: ""
      }
    };
  },
  created() {
    this.form = this.$route.query;
  },
  methods: {
    onSubmit() {
      const form = this.form;
      if (form.title) {
        updateCategory(this.form).then(res => {
          if (res.status === 0) {
            this.$message({
              type: "success",
              message: res.msg
            });
            this.$router.push("/shop/category");
          } else {
            this.$message({
              type: "warning",
              message: res.msg
            });
          }
        });
      } else {
        this.$message({
          type: "warning",
          message: "不能为空"
        });
      }
    },
    onCancel() {}
  }
};
</script>
