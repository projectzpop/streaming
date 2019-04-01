function task(promise) {
  return promise.then(data => [null, data]).catch(err => [err, null]);
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  task,
  sleep,
};
