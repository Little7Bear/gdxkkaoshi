import Vue from 'vue';

// 处理首字母大写 abc => Abc
function changeStr(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const requireComponent = require.context('./', false, /\.vue$/)
// 1.获取文件名数组 requireComponent.keys() => [./OtherDemo.vue,./Weibo.vue,...]
requireComponent.keys().forEach(fileName => {
    const config = requireComponent(fileName) //2.获取文件
    const componentName = changeStr(    //3.处理文件名 ./otherDemo.vue => OtherDemo
        fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
    )
    Vue.component(componentName, config.default || config) //4.动态注册该目录下的所有.vue文件
})