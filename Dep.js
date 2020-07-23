class Dep {
    constructor() {
        this.deps = []
    }
    addDep(dep) {
        this.deps.push(dep);

        console.log('this.deps', this.deps)
    }
    notify() {
        this.deps.forEach(dep => { dep.update() })
    }
}