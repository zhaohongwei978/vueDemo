// Watcher： 负责创建data中的key和更新函数的映射关系

class Watcher {
    //vm 代表当前这个vue实例
    constructor(vm, key, cb) {
        this.vm = vm;
        this.key = key;
        //watcher的回调函数
        this.cb = cb;
        Dep.target = this;//把当前watcher实例添加到Dep静态属性上

        this.vm[this.key];//触发依赖收集
        Dep.target = null;//置空
    }

    update() {
        console.log(`${this.key}属性更新了`)
        this.cb.call(this.vm, this.vm[this.key])
    }
}