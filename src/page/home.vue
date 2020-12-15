<template>
<div>
    <button @click="openPage('joinInfo')">录入表单</button>
    <button @click="openPage('list')">查询表单</button>
</div>
  
</template>

<script>
export default {
    methods:{
        openPage(name) {
            this.$router.push(name);
        }
    }
}
</script>

<style>

</style>>