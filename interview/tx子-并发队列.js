// class TaskQueue {
//   constructor(max = 10) {
//     this.max = max
//     this.resultArr = []
//     this.queue = []
//     this.count = 0
//   }

//   addTask(task) {
//     this.queue.push({
//       task,
//       index: this.count++
//     })
//   }

//   run() {
//     debugger
//     return new Promise((resolve) => {
//       this.next(resolve)
//     })
//   }

//   async next(resolve) {
//     const len = this.queue.length
//     if (len === 0) return
//     const min = Math.min(len, this.max)
//     for (let i = 0; i < min; i++) {
//       let { task, index } = this.queue.shift()
//       // console.log(task)

//       this.max--
//       try {
//         const result = await task()
//         this.resultArr[index] = result
//       } catch (e) {
//         console.log(e)
//       } finally {
//         this.count--
//         if (this.count === 0) {
//           resolve(this.resultArr)
//         }
//         this.max++
//         this.next(resolve)
//       }
//     }
//   }
// }

// // function createTask(i) {
// //   return () => {
// //     new Promise((resolve) => {
// //       setTimeout(() => {
// //         resolve(i)
// //       }, 1000)
// //     })
// //   }
// // }

// const createTask = (i) => {
//   return () => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve(i)
//       }, 2500)
//     })
//   }
// }

// async function test() {
//   const taskQueue = new TaskQueue(10)
//   for (let i = 0; i < 2; i++) {
//     taskQueue.addTask(createTask(i))
//   }
//   // console.log(taskQueue)

//   const arr = await taskQueue.run()
//   console.log(arr)
// }

// console.log(test())

// 法二：
class concurrentQueue {
  constructor(concurrency = 3) {
    this.concurrency = concurrency
    this.queue = []
    this.running = 0
  }
  enqueue(task) {
    this.queue.push(task)
    this._processQueue()
  }
  async _processQueue() {
    if (this.running < this.concurrency && this.queue.length > 0) {
      const task = this.queue.shift()
      try {
        this.running++
        const result = await task()
        console.log('res', result)
      } catch (e) {
        console.log('error', e)
      } finally {
        this.running--
        this._processQueue()
      }
    }
  }

  getSize() {
    return this.queue.length + this.running
  }
}

function simulateRequest(id, delay, isSuccess = true) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isSuccess) {
        console.log('request ' + id + ' successfully')
        resolve(`data from req ${id}`)
      } else {
        console.log('request ' + id + ' fail')
        reject(`Error from req ${id}`)
      }
    }, delay)
  })
}

async function runTest() {
  const req = [
    () => simulateRequest(1, 500),
    () => simulateRequest(2, 1500),
    () => simulateRequest(3, 3500),
    () => simulateRequest(4, 500, false),
    () => simulateRequest(5, 200),
    () => simulateRequest(6, 900),
    () => simulateRequest(7, 1900)
  ]

  const instance = new concurrentQueue()

  req.map((r) => {
    instance.enqueue(r)
  })

  // 等待所有任务完成 (简单轮询，生产环境不推荐)
  while (instance.getSize() > 0) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  console.log('All requests processed.')
}
runTest()
