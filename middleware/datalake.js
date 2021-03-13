var AWS = require("aws-sdk");
const BUCKET = "pointcloudlabelingtool";
AWS.config.update({ region: "eu-central-1" });

// Create S3 service object
s3 = new AWS.S3({ apiVersion: "2006-03-01" });

// call S3 to retrieve policy for selected bucket
s3.getBucketAcl({ Bucket: BUCKET }, function (err, data) {
  if (err) {
    console.log("Error", err);
  } else if (data) {
    console.log("Success", data.Grants);
  }
});

console.log("Selected S3 Bucket: " + BUCKET);
console.log('http://localhost:3000/');

var point_cloud_data_json = "";

// This method is triggered if user requests
// labeling_tool/"name_of_the_point_cloud_json" eg. labeling_tool/point_cloud_next.json
// point_cloud_next.json is passed as parameter through req.params and downloaded from datalake
// parent function is inside of index.js
exports.download_point_cloud_and_show = function (req, res, next) {
  if (req.params.point_cloud_path.includes("to_label")) {
    var file_name = req.params.point_cloud_path.replace("to_label", "");
    var prefix = "to_label/" + file_name;
  } else {
    var file_name = req.params.point_cloud_path.replace("labeled", "");
    var prefix = "labeled/" + file_name;
  }

  console.log(
    "### Calling datalake.download_point_cloud_and_show method " + prefix
  );

  s3.getObject({ Bucket: BUCKET, Key: prefix }, function (error, data) {
    if (error != null) {
      console.log("Failed to retrieve an object: " + error);
    } else {
      point_cloud_data_json = JSON.parse(data.Body);
      console.log(point_cloud_data_json);
      console.log(req.params.point_cloud_path);

      res.render("point_cloud_viewer", {
        point_cloud_path: req.params.point_cloud_path,
        point_cloud_data: point_cloud_data_json,
      });
      next();
    }
  });
};

// Downloads one point cloud json and saves it temporarily in point_cloud_data_json
exports.download_point_cloud = function (req, res, next) {
  if (req.params.point_cloud_path.includes("to_label")) {
    var file_name = req.params.point_cloud_path.replace("to_label", "");
    var prefix = "to_label/" + file_name;
  } else {
    var file_name = req.params.point_cloud_path.replace("labeled", "");
    var prefix = "labeled/" + file_name;
  }
  console.log("### Calling datalake.download_point_cloud method " + prefix);
  s3.getObject({ Bucket: BUCKET, Key: prefix }, function (error, data) {
    if (error != null) {
      console.log("Failed to retrieve an object: " + error);
    } else {
      point_cloud_data_json = JSON.parse(data.Body);
      console.log(point_cloud_data_json);
      console.log(req.params.point_cloud_path);
      next();
    }
  });
};

// Query List of objects in to_label and labeled folder of Main Bucket
exports.get_list_of_files_from_datalake = function (req, res, next) {
  console.log("### Calling datalake.get_list_of_files_from_datalake method.");
  var table_data_not_labeled_json = new Array();
  var table_data_labeled_json = new Array();

  // Call S3 to obtain a list of the objects in the bucket
  s3.listObjects({ Bucket: BUCKET }, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      var bucket_content = data["Contents"];
      bucket_content.forEach(function (item, index) {
        if (item["Key"].includes("to_label") && item["Key"].includes(".json")) {
          table_data_not_labeled_json.push(item);
        }
        if (item["Key"].includes("labeled") && item["Key"].includes(".json")) {
          table_data_labeled_json.push(item);
        }
      });

      console.log(table_data_not_labeled_json);
      console.log(table_data_labeled_json);

      res.render("datalake", {
        table_data_not_labeled: table_data_not_labeled_json,
        table_data_labeled: table_data_labeled_json,
      });
    }
  });
  next();
};

// Replace labels in point_cloud_data_json and upload this json to labeled folder.
exports.upload_point_cloud = function (req, res, next) {
  console.log(req.params.point_cloud_path);

  var file_name = req.params.point_cloud_path.replace("to_label", "");
  console.log(file_name);
  file_name = file_name.replace("labeled", "");
  console.log(file_name);
  var prefix = "labeled/" + file_name;

  console.log("##--# Calling datalake.upload_point_cloud method. " + prefix);
  var labels = req.body;
  point_cloud_data_json["l"] = labels["l"];

  s3.putObject({Bucket: BUCKET, Key: prefix, Body:    JSON.stringify(point_cloud_data_json)}, function (err, etag) {
      return console.log(err, etag); // err should be null
  }
  );
  next();
};
