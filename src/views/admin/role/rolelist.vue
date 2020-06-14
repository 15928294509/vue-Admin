<template>
  <div class="app-container">
    <div>
      <el-button @click="add" type="primary" style="margin-bottom:20px">添加角色</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="角色名称" align="center" width="110">
        <template slot-scope="scope">{{ scope.row.desc }}</template>
      </el-table-column>
      <el-table-column label="权限规则编号" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.rule_ids }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status===1?"正常":"禁用" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row.id)" circle></el-button>
          <el-button type="success" icon="el-icon-delete" @click="del(scope.row.id)" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
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
import { getroleList,delRole } from "@/api/role";

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
      list: null,
      listLoading: true,
      total: null,
      page: 1
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getroleList().then(response => {
        this.list = response.rolelist;
        this.total = response.total;
        this.listLoading = false;
      });
    },
    CurrentPage(page) {
      this.page = page;
      getroleList({ page }).then(response => {
        this.list = response.rolelist;
        this.total = response.total;
        this.listLoading = false;
      });
    },
    add() {
      this.$router.push("/user/addrole");
    },
    edit(id) {
      this.$router.push({
        path: "/user/editrole",
        query: { id }
      });
    },
    async del(id) {
      const page = this.page;
      this.$confirm(`是否删除${id}用户, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await delRole({ id });
          this.$message({
            type: "success",
            message: res.msg
          });
          this.CurrentPage(page);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
