# Pointcloud_Labeling_Tool
This tool allows you to label 3D point clouds within the Browser.

# Install
1. Install NodeJS
2. Install all dependencies via npm (npm install)

# Point Cloud Fromat
- Each Point Cloud must be uploaded to an AWS S3 Bucket called "to_label".
- You have to specify the name of the Bucket inside of "middleware/datalake.js".
- Make sure to export your access key and secret access key before you run the server https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html

Each Point Cloud must be stored in a json file, using the following format. 
```
{
    "x": [1, 2, 3], 
    "y": [1, 2, 3], 
    "z": [1, 2, 3],
    "i": [1, 2, 3],
    "l": [0, 0, 0]
}
```
You can find one example point cloud json file under "public/data"


# Start the Tool 
Run "npm start dev" in order to start the Node Express Server. 

Open you browser and enter ```localhost:3000```

# Troubleshooting
After you run the server, you should get a success message in your console.
```
Success [
  {
    Grantee: {
      ID: '12334567890',
      Type: 'CanonicalUser'
    },
    Permission: 'FULL_CONTROL'
  }
]
``` 
If you get a "CredentialsError" you have no Access right to you specified bucket. Do not forget to export your aws credentials. You can create new credentials in the AWS IAM Service. 

Also do not forget to set the correct bucket name inside of "middleware/datalake.js" (by default the bucket is called "pointcloudlabelingtool")