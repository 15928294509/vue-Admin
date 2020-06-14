<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="角色名称">
        <el-input v-model="form.desc" />
      </el-form-item>
      <el-form-item>
        <el-table
          v-loading="listLoading"
          :data="this.form.rulelist"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="ID" width="95">
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column label="权限名称" align="center" width="110">
            <template slot-scope="scope">{{ scope.row.desc }}</template>
          </el-table-column>
          <el-table-column label="权限路径" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="created_at" label="状态" width="200">
            <template slot-scope="scope">
              <el-switch
                style="display: block;margin-top:10px"
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="-1"
                active-text="启用"
                inactive-text="禁用"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">修改</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
    <el-pagination
      @current-change="CurrentPage"
      background
      style="padding-top:20px"
      layout="prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import { getruleList } from "@/api/rule";
import { updateRole, getRole } from "@/api/role";

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
        desc: "",
        rulelist: []
      },
      list: null,
      listLoading: true,
      total: null,
      page: 1,
      rule_ids: []
    };
  },
  async created() {
    const id = this.$route.query.id;
    const res = await getRole({ id });
    const rule_ids = res.roleinfo.rule_ids.split(",");
    this.rule_ids = rule_ids;
    this.form.desc = res.roleinfo.desc;
    this.form.id = id;
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getruleList().then(response => {
        let rulelist = response.rulelist;
        rulelist.map((rule, index) => {
          if (this.rule_ids.includes(rule.id + "")) {
            rule.status = 1;
          } else {
            rule.status = -1;
          }
        });
        this.form.rulelist = rulelist;
        this.total = response.total;
        this.listLoading = false;
      });
    },
    CurrentPage(page) {
      this.page = page;
      getruleList({ page }).then(response => {
        this.list = response.rulelist;
        this.total = response.total;
        this.listLoading = false;
      });
    },
    onSubmit() {
      const form = this.form;
      console.log(form);
      const desc = form.desc;
      //过滤掉禁用的
      const rule_idsArr = form.rulelist.reduce((pre, rule) => {
        if (rule.status === 1) {
          pre.push(rule.id);
        }
        return pre;
      }, []);
      const rule_ids = rule_idsArr.join(",");
       form.rule_ids = rule_ids;
      delete form.rulelist;
      updateRole({ desc, ...form }).then(res => {
        if (res.status === 0) {
          this.$message({
            message: res.msg,
            type: "success"
          });
          this.$router.push("/user/rolelist");
        } else {
          this.$message({
            message: res.msg,
            type: "warning"
          });
        }
      });
    },
    onCancel() {}
  }
};
</script>
