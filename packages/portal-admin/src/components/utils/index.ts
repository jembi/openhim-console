export async function countdown(seconds: number, callback) {
  return new Promise(resolve => {
    let remainingSeconds = seconds

    const intervalId = setInterval(() => {
      callback(remainingSeconds)

      if (remainingSeconds <= 0) {
        clearInterval(intervalId)
        resolve(true)
      } else {
        remainingSeconds--
      }
    }, 1000)
  })
}
