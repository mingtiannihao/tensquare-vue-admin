<template>
<div>
  <br>
  <el-form :inline="true">
    <el-form-item label="活动名称">
      <el-input v-model="searchMap.name" placeholder="活动名称"></el-input>
    </el-form-item>
    <el-form-item label="活动日期">
       <el-date-picker
          v-model="searchMap.starttime_1"
          type="date"
          placeholder="选择开始日期">
      </el-date-picker>
       <el-date-picker
          v-model="searchMap.starttime_2"
          type="date"
          placeholder="选择结束日期">
      </el-date-picker>
    </el-form-item>
    <el-button type="primary" @click="fetchData()">查询</el-button>
    <el-button type="primary" @click="handleEdit('')">新增</el-button>
  </el-form>

  <el-table
    :data="list"
    border
    style="width: 100%">
    <el-table-column
      prop="id"
      label="活动ID"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="活动名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="sponsor"
      label="主办方"
      width="150">
    </el-table-column>
    <el-table-column
      prop="address"
      label="活动地址"
      width="280">
    </el-table-column>
    <el-table-column
      prop="starttime"
      label="开始日期"
      width="100">
    </el-table-column>
    <el-table-column
      prop="endtime"
      label="结束日期"
      width="100">
    </el-table-column>
     <el-table-column prop="state" label="状态" width="80" align="center">
        <template scope="scope">
            <span v-if="scope.row.state==1" style="color:red;">可见</span>
            <span v-if="scope.row.state==0" style="color:green;">不可见</span>
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
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5,10,20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  
  <el-dialog title="编辑" :visible.sync="dialogFormVisible">
    <el-form label-width="80px">
      <el-form-item label="活动名称">
          <el-input v-model="pojo.name" placeholder="活动名称"></el-input>
      </el-form-item>
      <el-form-item label="基本地址">
          <el-input v-model="pojo.address"  placeholder="基本地址"></el-input>
      </el-form-item>
      <el-form-item label="开始日期">
          <el-date-picker type="date"  v-model="pojo.starttime" placeholder="开始日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="截至日期">
          <el-date-picker type="date" v-model="pojo.endtime"  placeholder="截至日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="报名截止">
          <el-date-picker type="date" v-model="pojo.enrolltime"  placeholder="报名截止"></el-date-picker>
      </el-form-item>
      <el-form-item label="活动详情">
         <el-input v-model="pojo.detail" placeholder="活动详情" type="textarea"  :rows="2"></el-input>
      </el-form-item>
      <el-form-item label="选择城市">
          <el-select v-model="pojo.city" placeholder="请选择">
            <el-option
              v-for="item in cityList"
              :key="item.value"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
      </el-form-item>
       <el-form-item label="是否可见">
         <el-switch active-value="1" inactive-value="0" v-model="pojo.state"></el-switch>
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
import gatheringApi from '@/api/gathering'
import cityApi from '@/api/city'
export default {
  data() {
    return {
      list: [],
      total: 0, // 总记录数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页大小
      searchMap: {}, // 查询条件
      dialogFormVisible: false, // 编辑窗口是否可见
      pojo: {}, // 编辑表单绑定的实体对象
      cityList: [], // 城市列表
      id: '' // 当前用户修改的ID
    }
  },
  created() {
    this.fetchData()
    this.getCity()
  },
  methods: {
    fetchData() {
      gatheringApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },
    getCity() {
      cityApi.getCityList().then(response => {
        console.log(1111, response)
        this.cityList = response.data
      })
    },
    handleSave() {
      if (this.id !== '') {
        gatheringApi.update(this.id, this.pojo).then(response => {
          this.$message({
            message: response.message,
            type: (response.flag ? 'success' : 'error')
          })
          if (response.flag) { // 如果成功
            this.fetchData() // 刷新列表
          }
        })
      } else {
        gatheringApi.save(this.pojo).then(response => {
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
        gatheringApi.findById(id).then(response => {
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
        gatheringApi.deleteById(id).then(response => {
          this.$message({ message: response.message, type: (response.flag ? 'success' : 'error') })
          if (response.flag) {
            this.fetchData() // 刷新数据
          }
        })
      })
    },
    // 监听pagesize
    handleSizeChange(newSize) {
      this.pageSize = newSize
      console.log(this.pageSize)
      this.fetchData()
    },
    // 监听页码值
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      this.fetchData()
    }
  }
}
</script>
