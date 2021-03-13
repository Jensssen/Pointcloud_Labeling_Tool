# Pointcloud_Labeling_Tool
This tool allows you to label 3D point clouds within the Browser.

# Install
1. Install NodeJS
curl -fsSL https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt-get install -y nodejs

2. Install all dependencies via npm 
npm install

# Point Cloud Fromat
Each Point Cloud must be uploaded to an AWS S3 Bucket called "to_label".
You have to specify the name of the Bucket inside of "middleware/datalake.js".
Make sure to export your access key and secret access key before you run the server (https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html)

Each Point Cloud must be stored in a json file, using the following format. 

{
    "x": [1, 2, 3], 
    "y": [1, 2, 3], 
    "z": [1, 2, 3],
    "i": [1, 2, 3],
    "l": [0, 0, 0]
 }

You can find one example point cloud json file under "public/data"


# Start the Tool 
Run "npm start dev" in order to start the Node Express Server 