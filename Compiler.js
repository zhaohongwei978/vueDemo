// compiler ；遍历模版，分析其中哪些地方用到了data中的key以及事件等指令
//  这时认为是一个依赖，创建一个watcher实例，使界面中的dom更新函数 和 那个key挂钩，如果更新了key  则执行更新函数。

class Compiler {
    constructor(el, vm) {
        this.$vm = vm;
        this.$el = document.querySelector(el);
        this.compiler(this.$el)
    }

    compiler(el) {
        const childNodes = el.childNodes;
        //console.log(childNodes)
        Array.from(childNodes).forEach(node => {
            //console.log(node)
            if (this.isElement(node)) {
                //元素<span> <div>
                //console.log('编译标签元素', node.nodeName);
                this.compileELement(node)
            }
            else if (this.isInter(node)) {
                // 插值文本{{name}}
                //console.log('编译插值文本', node.textContent)
                this.compilerText(node);
            }

            //递归子元素
            this.compiler(node);
        })
    }

    isElement(node) {
        return node.nodeType === 1
    }
    isInter(node) {
        //满足条件是文本节点，并且满足是{{}}的正则 
        return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
    //编译文本
    compilerText(node) {
        //node.textContent = this.$vm[RegExp.$1]
        //通过watcher的update来更新
        this.update(node, RegExp.$1, 'text')
    }

    //编译元素
    compileELement(node) {
        //获取属性
        const nodeAttrs = node.attributes;

        Array.from(nodeAttrs).forEach(attr => {
            const attrName = attr.name
            const exp = attr.value
            if (this.isDirective(attrName)) {
                //获取指令名字
                const dir = attrName.substring(2);
                //执行相对应的更新函数
                this[dir] && this[dir](node, exp);
            }
        })
    }

    // update函数  负责更新DOM 同时创建watcher实例在两者之间挂钩
    update(node, exp, dir) {
        //首次初始化
        console.log('---dir', dir)
        const updaterFn = this[dir + 'Update']
        updaterFn && updaterFn(node, this.$vm[exp])

        //更新
        new Watcher(this.$vm, exp, function (value) {
            updaterFn && updaterFn(node, value)
        })

    }
    //文本更新
    textUpdate(node, value) {
        node.textContent = value;
    }
    //判断指令
    isDirective(attrName) {
        return attrName.indexOf('v-') == 0;
    }
    //text指令
    text(node, exp) {
        this.update(node, exp, 'text')
    }
    model(node, exp) {
        console.log('---exp', exp)
        this.update(node, exp, 'model')
        node.addEventListener('input', e => {
            console.log('---e.target', e.target.value)
            this.$vm[exp] = e.target.value
        })
    }
    modelUpdate(node, value) {
        node.value = value
    }
}