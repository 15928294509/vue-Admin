<template>
  <div class="app-container">
    <div>
      <el-button @click="add" type="primary" style="margin-bottom:20px">添加商品</el-button>
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
      <el-table-column label="商品名称" align="center" width="110">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column label="商品价格" align="center" width="110">
        <template slot-scope="scope">{{ scope.row.price }}</template>
      </el-table-column>
      <el-table-column label="商品图片" align="center">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.imgs"
            style="width: 100px; height: 100px"
            :src="JSON.parse(scope.row.imgs)[0]&&base+'/static/upload/'+JSON.parse(scope.row.imgs)[0].name"
            fit="cover"
          ></el-image>
          <el-image
            v-else
            style="width: 100px; height: 100px"
            :src="base+'/static/upload/goods.png'"
            fit="cover"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column label="产品类别" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.category }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row)" circle></el-button>
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
import { getproductList, delProduct } from "@/api/product";
const base = process.env.VUE_APP_BASE_API;
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
      page: 1,
      base
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getproductList().then(response => {
        this.list = response.productlist;
        this.total = response.total;
        this.listLoading = false;
      });
    },
    CurrentPage(page) {
      this.page = page;
      getproductList({ page }).then(response => {
        this.list = response.productlist;
        this.total = response.total;
        this.listLoading = false;
      });
    },
    add() {
      this.$router.push("/shop/addproduct");
    },
    edit(product) {
      this.$router.push({
        path: "/shop/editproduct",
        query: product
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
          let res = await delProduct({ id });
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
