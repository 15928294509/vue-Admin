<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="商品名称">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="商品价格">
        <el-input v-model="form.price" />
      </el-form-item>
      <el-form-item label="商品类别">
        <el-select v-model="form.categoryid">
          <el-option
            v-for="(category,index) in categorylist"
            :key="index"
            :label="category.title"
            :value="category.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-upload
          class="upload-demo"
          drag
          name="uploadFile"
          action="/api/assets/upload/upImgs"
          :file-list="filelist||[]"
          :on-success="upLoad"
          :on-remove="remove"
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="SKU设置">
        <el-table
          :data="form.skulist"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="名称" width="95">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column label="类型" align="center" type="110">
            <template slot-scope="scope">{{ scope.row.type }}</template>
          </el-table-column>
          <el-table-column label="价格" align="center" width="110">
            <template slot-scope="scope">{{ scope.row.sku_price }}</template>
          </el-table-column>
          <el-table-column label="数量" align="center" width="110">
            <template slot-scope="scope">{{ scope.row.sku_stock }}</template>
          </el-table-column>
          <el-table-column label="编码" width="110" align="center">
            <template slot-scope="scope">{{ scope.row.sku_code }}</template>
          </el-table-column>
          <el-table-column align="center" prop="created_at" label="删除" width="200">
            <template slot-scope="scope">
              <el-button type="success" icon="el-icon-delete" @click="del(scope.$index)" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item label="sku名称">
          <el-input v-model="sku.name" />
        </el-form-item>
        <el-form-item label="sku类型">
          <el-input v-model="sku.type" />
        </el-form-item>
        <el-form-item label="sku价格">
          <el-input v-model="sku.sku_price" />
        </el-form-item>
        <el-form-item label="sku数量">
          <el-input v-model="sku.sku_stock" />
        </el-form-item>
        <el-form-item label="sku编码">
          <el-input v-model="sku.sku_code" />
        </el-form-item>
        <el-button type="primary" @click="addSku">添加</el-button>
      </el-form-item>
      <el-form-item>
        <tinymce v-model="form.content" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">创建</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getcategoryList } from "@/api/category";
import { updateProduct, removeImg } from "@/api/product";
import Tinymce from "@/components/Tinymce";
const base = process.env.VUE_APP_BASE_API;
export default {
  components: {
    Tinymce
  },
  data() {
    return {
      form: {
        title: "",
        price: "",
        categoryid: "",
        imgs: "",
        skulist: [],
        content: ""
      },
      categorylist: [],
      base,
      filelist: [],
      sku: {
        name: "",
        type: "",
        sku_price: null,
        sku_stock: "",
        sku_code: ""
      },
      filename: ""
    };
  },
  async created() {
    this.categorylist = (await getcategoryList()).categorylist;
    const form = this.$route.query;
    console.log(form);
    form.imgs = form.imgs ? form.imgs : "[]";
    this.filelist =form.imgs&& JSON.parse(form.imgs);
    delete form.imgs;
    const skuObj = JSON.parse(form.sku);
    delete form.sku;
    form.skulist = [];
    //因为数据库的不完善需要一些处理
    if(skuObj.data){
        form.skulist = skuObj.data
    }else{
        for(let key in skuObj){
            form.skulist = skuObj[key];
        }
    }

    this.form = form;
  },
  methods: {
    async remove(file) {
      //简单的移除不要的图片
      this.filelist = this.filelist.filter((f, index) => f.uid !== file.uid);
      this.form.imgs = this.filelist;
      await removeImg({ filename: this.filename });
    },
    upLoad(res) {
      this.filename = res.data.filename;
      this.filelist.push({
        name: res.data.filename,
        url: "/api/static/upload/" + res.data.filename
      });
      this.form.imgs = this.filelist;
    },
    addSku() {
      const skuCopy = { ...this.sku };
      const sku = this.sku;
      this.form.skulist.push(skuCopy);
      for (let key in sku) {
        sku[key] = "";
      }
    },
    del(index) {
      this.form.skulist.splice(index, 1);
      const sku = this.sku;
      for (let key in sku) {
        sku[key] = "";
      }
      this.sku = sku;
    },
    async onSubmit() {
      const skulist = this.form.skulist;
      const skuObj = {};
      skulist &&
        skulist.forEach((sku, index) => {
          if (skuObj["type"]) {
            if (skuObj["type"].indexOf(sku.type) === -1) {
              skuObj["type"] = [...skuObj["type"], sku.type];
            }
          } else {
            skuObj["type"] = [sku.type];
          }
          if (skuObj["data"]) {
            skuObj["data"] = [...skuObj["data"], sku];
          } else {
            skuObj["data"] = [sku];
          }
        });
      this.form.sku = skuObj;
      delete this.form.skulist;
      console.log(this.form);
      updateProduct(this.form).then(res => {
        if (res.status === 0) {
          this.$router.push("/shop/product");
          this.$message({
            type: "success",
            message: res.msg
          });
        } else {
          this.$message({
            type: "warning",
            message: res.msg
          });
        }
      });
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

