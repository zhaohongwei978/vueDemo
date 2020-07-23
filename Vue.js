// new Vue({data:{}})
class Vue {
    constructor(options) {
        this.$options = options;
        //处理传入data
        this.$data = options.data
        //响应化
        this.observe(this.$data)
        //依赖收集
        // new Watcher(this,'test')
        // new Watcher(this,'test')
        // this.test;
        // this.test;

        //真实DOM的版本 根据真实DOM compiler
        new Compiler(options.el, this);
        if (options.created) {
            options.created.call(this);
        }
    }
    observe(value) {
        //如果不是对象return
        if (!value || typeof value !== 'object') {
            return;
        }
        //遍历对象
        Object.keys(value).forEach(key => {
            //递归
            //真正的响应化处理defind                 ·                                                                             ·更好 ··4                                
            this.defineReactive(value, key, value[key])

            //代理data中的属性到vue实例上
            this.proxyData(key);
        })
    }
    //通过一个函数定义了一个 局部作用域的val，
    //既 get(){  return val } 这个局部作用域的val 可以通过函数暴露给外界
    //所以这个val在这个闭包中的状态不会被释放，set时候 也是改变的这个局部变量
    //如果不巧妙的运用这个闭包 就会出现死循环

    defineReactive(obj, key, val) {
        this.observe(val)

        // 创建Dep实例和key一一对应,就是每一个属性值会对应一个属性
        const dep = new Dep();

        Object.defineProperty(obj, key, {
            enumerable: true, // 可枚举
            configurable: true, // 可修改或删除
            get() {
                //依赖收集 
                Dep.target && dep.addDep(Dep.target)
                return val;
            },
            //此处的val是非常有意义的，如果在setter中直接修改$data中的数据，就会产生死循环，
            //此处的val的使用是一个典型的闭包 defineReactive通过return一个函数 能够缓存这个key 和 value 
            set(newValue) {
                if (newValue === val) {
                    return;
                }
                val = newValue;
                console.log('setter触发')
                //console.log('属性set更新了', newValue)
                //通知更新
                dep.notify();
            }
        })
    }
    proxyData(key) {
        Object.defineProperty(this, key, {
            get() {
                return this.$data[key]
            },
            set(newValue) {
                this.$data[key] = newValue;
            }
        })
    }
}