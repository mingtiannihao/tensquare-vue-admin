<template>
  <div class="app-container">
    <el-button type="primary" @click="handleEdit('')">新增</el-button>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95" prop="id">
      </el-table-column>
      <el-table-column label="标签名称" prop="name">
      </el-table-column>
      </el-table-column>
       <el-table-column prop="state" label="状态" width="80" align="center">
        <template scope="scope">
            <span v-if="scope.row.state==0" style="color:red;">无效</span>
            <span v-if="scope.row.state==1" style="color:green;">有效</span>
        </template>
     </el-table-column>
     <el-table-column label="使用数量" prop="count">
     </el-table-column>
     <el-table-column label="关注数" prop="fans">
     </el-table-column>
    <el-table-column label="是否推荐" prop="recommend">
      <template scope="scope">
            <span v-if="scope.row.recommend==0" style="color:red;">不推荐</span>
            <span v-if="scope.row.recommend==1" style="color:green;">推荐</span>
        </template>
     </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleEdit(scope.row.id)" type="text" size="small">修改</el-button>
        <el-button @click="handleDelete(scope.row.id)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
     <el-pagination
      @size-change="fetchData"
      @current-change="fetchData"
      :current-page="currentPage"
      :page-sizes="[5,10,20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-table>

    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
    <el-form label-width="80px">
      <el-form-item label="标签名称">
          <el-input v-model="pojo.labelname" placeholder="标签名称"></el-input>
      </el-form-item>
       <el-form-item label="使用数量">
          <el-input v-model="pojo.count" placeholder="使用数量"></el-input>
      </el-form-item>
       <el-form-item label="关注数">
          <el-input v-model="pojo.fans" placeholder="关注数"></el-input>
      </el-form-item>
       <el-form-item label="状态">
         <el-switch active-value="1" inactive-value="0" v-model="pojo.state"></el-switch>
      </el-form-item>
       <el-form-item label="是否推荐">
         <el-switch active-value="1" inactive-value="0" v-model="pojo.recommend"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSave()">保存</el-button>
        <el-button @click="dialogFormVisible = false" >关闭</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  </div>
</template>

<script>
import labelApi from '@/api/label'
export default {
  data() {
    return {
      list: null,
      total: 0, // 总记录数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      listLoading: true,
      dialogFormVisible: false, // 编辑窗口是否可见
      pojo: {}, // 编辑表单绑定的实体对象
      id: '' // 当前用户修改的ID
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      labelApi.getList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleSave() {
      if (this.id !== '') {
        labelApi.update(this.id, this.pojo).then(response => {
          this.$message({
            message: response.message,
            type: (response.flag ? 'success' : 'error')
          })
          if (response.flag) { // 如果成功
            this.fetchData() // 刷新列表
          }
        })
      } else {
        labelApi.save(this.pojo).then(response => {
          this.$message({
            message: response.message,
            type: (response.flag ? 'success' : 'error')
          })
          if (response.flag) { // 如果成功
            this.fetchData() // 刷新列表
          }
        })
      }
      this.dialogFormVisible = false // 关闭窗口
    },
    handleEdit(id) {
      this.id = id
      this.dialogFormVisible = true // 打开窗口
      if (id !== '') { // 修改
        labelApi.findById(id).then(response => {
          if (response.flag) {
            this.pojo = response.data
          }
        })
      } else {
        this.pojo = {} // 清空数据
      }
    },
    handleDelete(id) {
      this.$confirm('确定要删除此纪录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        labelApi.deleteById(id).then(response => {
          this.$message({ message: response.message, type: (response.flag ? 'success' : 'error') })
          if (response.flag) {
            this.fetchData() // 刷新数据
          }
        })
      })
    }
  }
}
</script>

