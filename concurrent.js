/**
 * You need this when from a certain promise task list
 * you need a certain number of promises to run parallely but not all, to manage load
 */
const logUpdate = require("log-update")
const delay = (seconds) => new Promise((resolves) => {
    setTimeout(resolves, seconds*1000);
});

const toX = () => 'X'

const tasks = [
  delay(4),
  delay(6),
  delay(4),
  delay(3),
  delay(5),
  delay(7),
  delay(9),
  delay(10),
  delay(3),
  delay(5)
];

class PromiseQueue {
    constructor(taskList=[], concurrentCount=1) {
        this.promises = taskList
        this.total = taskList.length
        this.concurrentCount = concurrentCount
        this.running = []
        this.complete = []
    }

    get runAnother() {
        return (this.running.length < this.concurrentCount) && this.promises.length
    }

    graphTask() {
        const {promises, running, complete} = this
        logUpdate(`
        
        promises: [${promises.map(toX)}],
        running: [${running.map(toX)}],
        complete: [${complete.map(toX)}],

        `)
    }

    run() {
        while(this.runAnother) {
            const currentPromise = this.promises.shift()
            currentPromise.then(() => {
                this.complete.push(this.running.shift())
                this.graphTask()
                this.run()
            })
            this.running.push(currentPromise)
            this.graphTask()
        }
    }
}


const concurrentQueue = new PromiseQueue(tasks, 2)
concurrentQueue.run()