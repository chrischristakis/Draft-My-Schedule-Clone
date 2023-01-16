let fs = require('fs');

const loadData = (callback) => {
  //Read from json file and parse it into an object
  fs.readFile('Lab3-timetable-data.json', 'utf8', function (err, jsondata) {
      if (err)
      {
        console.log("Error reading json.");
        return;
      }
      callback(JSON.parse(jsondata));
  });
};

module.exports = new Promise((resolve, reject) => {
  loadData(function(data) { //load the data and pass it back in the promise.
    setTimeout(resolve.bind(null, data, 2000));
  });
});
