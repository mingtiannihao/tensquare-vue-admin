<template>
  <div class="app-container">
    <el-button type="primary" @click="handleEdit('')">新增</el-button>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='ID' width="95" prop="id">
      </el-table-column>
      <el-table-column label="City" prop="name">
      </el-table-column>
      </el-table-column>
       <el-table-column prop="ishot" label="状态" width="80" align="center">
        <template scope="scope">
            <span v-if="scope.row.ishot==1" style="color:red;">热门城市</span>
            <span v-if="scope.row.ishot==0" style="color:green;">冷门城市</span>
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
    </el-table>

    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
    <el-form label-width="80px">
      <el-form-item label="城市">
          <el-input v-model="pojo.name" placeholder="活动名称"></el-input>
      </el-form-item>
       <el-form-item label="是否热门">
         <el-switch active-value="1" inactive-value="0" v-model="pojo.ishot"></el-switch>
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
import cityApi from '@/api/city'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      dialogFormVisible: false, // 编辑窗口是否可见
      pojo: {}, // 编辑表单绑定的实体对象
      cityList: [], // 城市列表
      id: '' // 当前用户修改的ID
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      cityApi.getCityList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleSave() {
      if (this.id !== '') {
        cityApi.update(this.id, this.pojo).then(response => {
          this.$message({
            message: response.message,
            type: (response.flag ? 'success' : 'error')
          })
          if (response.flag) { // 如果成功
            this.fetchData() // 刷新列表
          }
        })
      } else {
        cityApi.save(this.pojo).then(response => {
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
        cityApi.findById(id).then(response => {
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
        cityApi.deleteById(id).then(response => {
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
