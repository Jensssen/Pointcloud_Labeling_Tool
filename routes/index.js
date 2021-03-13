var express = require("express");
var router = express.Router();

let datalake = require("../middleware/datalake");

/* GET Landing page. */
router.get("/", function (req, res, next) {
  res.render("landing");
});

/* GET Datalake Table page with data. */
router.get(
  "/datalake_data",
  datalake.get_list_of_files_from_datalake,
  function (req, res, next) {
    console.log("### Table data downloaded and visualized in table.");
  }
);

/* GET Datalake actual data. assign get_data as handler to the rout
 * get_datalake_data */
router.get(
  "/labeling_tool/:point_cloud_path",
  datalake.download_point_cloud_and_show,
  function (req, res, next) {
    console.log(
      "### Download point cloud with id: " + req.params.point_cloud_path
    );
  }
);

router.post(
  "/upload_point_cloud/:point_cloud_path",
  datalake.download_point_cloud,
  datalake.upload_point_cloud,
  function (req, res, next) {
    console.log(
      "### Uploaded point cloud with id: " + req.params.point_cloud_path
    );
  }
);

module.exports = router;
