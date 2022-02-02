<walkthrough-metadata>
  <meta name="title" content="Retail tutorial. Import user events from the BigQuery table tutorial. Python" />
  <meta name="description" content="Learn how to import user events from BigQuery table using Retail API Python client library" />
  <meta name="component_id" content="593554" />
  <meta name="keywords" content="retail, import user events, user events" />
</walkthrough-metadata>

# Import user events from the BigQuery table tutorial

## Introduction

The Retail API lets you to import user event data from previously loaded a
BigQuery table.

Using BigQuery table allows you to import a massive number of user events data
with no limits.

For more information about different import types, their restrictions, and use
cases, see the
[Retail API documentation](https://cloud.google.com/retail/docs/import-user-events#considerations).

<walkthrough-tutorial-duration duration="3.0"></walkthrough-tutorial-duration>

## Get started with Google Cloud Retail

This step is required if this is the first Retail API Tutorial you run.
Otherwise, you can skip it.

### Select your project and enable the Retail API

Google Cloud organizes resources into projects. This lets you
collect all the related resources for a single application in one place.

If you don't have a Google Cloud project yet or you're not the owner of an existing one, you can
[create a new project](https://console.cloud.google.com/projectcreate).

After the project is created, set your PROJECT_ID to a ```project``` variable.
1. Run the following command in Terminal:
    ```bash
    gcloud config set project <YOUR_PROJECT_ID>
    ```

1. Check that the Retail API is enabled for your project in the [Admin Console](https://console.cloud.google.com/ai/retail/).

### Create service account

To access the Retail API you must create a service account.

1. To create service account follow this [instruction](https://cloud.google.com/retail/docs/setting-up#service-account)

1. Find your service account on the [IAM page](https://console.cloud.google.com/iam-admin/iam),
   click `Edit` icon and add the roles 'Storage Admin' and 'BigQuery Admin. It may take a while for the changes to take effect.

1. Copy the service account email in the field Principal.

### Set up authentication

To run a code sample from the Cloud Shell, you need to be authenticated using the service account credentials.

1. Login with your user credentials.
    ```bash
    gcloud auth login
    ```

1. Type `Y` and press **Enter**. Click the link in Terminal. A browser window should appear asking you to log in using your Gmail account.

1. Provide the Google Auth Library with access to your credentials and paste the code from the browser to the Terminal.

1. Upload your service account key JSON file and use it to activate the service account:
    ```bash
    gcloud iam service-accounts keys create ~/key.json --iam-account <YOUR_SERVICE_ACCOUNT_EMAIL>
    ```
    ```bash
    gcloud auth activate-service-account --key-file  ~/key.json
    ```

1. Set key as the GOOGLE_APPLICATION_CREDENTIALS environment variable to be used for requesting the Retail API:
    ```bash
    export GOOGLE_APPLICATION_CREDENTIALS=~/key.json
    ```

**Note**: Click the copy button on the side of the code box to paste the command in the Cloud Shell terminal and run it.

### Set the PROJECT_NUMBER and PROJECT_ID environment variables

Because you are going to run the code samples in your own Google Cloud project, you should specify the **project_number** and **project_id** as environment variables. It will be used in every request to the Retail API.

1. Find the project number and project ID in the Project Info card displayed on **Home/Dashboard**.

1. Set **project_number** with the following command:
    ```bash
    export PROJECT_NUMBER=<YOUR_PROJECT_NUMBER>
    ```

1. Set **project_id** with the following command:
    ```bash
    export PROJECT_ID=<YOUR_PROJECT_ID>
    ```

## Clone the Retail code samples

This step is required if this is the first Retail API Tutorial you run.
Otherwise, you can skip it.

Clone the Git repository with all the code samples to learn the Retail features and check them in action.
<!-- TODO(ianan): change the repository link -->
1. Run the following command in the Terminal:
    ```bash
    git clone https://github.com/t-karasova/grs-samples-nodejs.git
    ```
    The code samples for each of the Retail services are stored in different directories.

1. Go to the ```grs-samples-nodejs``` directory. It's our starting point to run more commands.
    ```bash
    cd grs-samples-nodejs
    ```

1. Run the following commands in a Terminal to install necessary dependencies:
    ```bash
    npm install
    ```


## Prepare user events for importing

There is a
<walkthrough-editor-select-regex filePath="cloudshell_open/grs-samples-nodejs/resources/user_events.json" regex="id">resources/user_events.json</walkthrough-editor-select-regex>
file with valid user events prepared in the `resources` directory.

The other file,
<walkthrough-editor-select-regex filePath="cloudshell_open/grs-samples-nodejs/resources/user_events_some_invalid.json" regex="id">resources/user_events_some_invalid.json</walkthrough-editor-select-regex>,
contains both valid and invalid user events. You will use it to check the error
handling.

You can use this file in the tutorial, or, if you want to use your own data, you
should update the names of the bucket and JSON files in the code samples.

You can import events that aren't older than 90 days into the Retail catalog.
Otherwise, the import will fail.

To keep our historical user events more recent, update the timestamps in the
<walkthrough-editor-select-regex filePath="cloudshell_open/grs-samples-nodejs/resources/user_events.json" regex="id">user_events.json</walkthrough-editor-select-regex>
and
<walkthrough-editor-select-regex filePath="cloudshell_open/grs-samples-nodejs/resources/user_events_some_invalid.json" regex="id">user_events_some_invalid.json</walkthrough-editor-select-regex>
files.

1.  Run this script in the Terminal to get the user events with yesterday's
    date:
    ```bash
    node setup/update_user_events_json.js
    ```

Now, your data are updated and ready to be deployed to the Cloud Storage.

## Create the BigQuery table and upload user events

To upload the data to the BigQuery table you need to create a dataset first,
then create table with specific user events data schema.

Next, upload data to the table from prepared JSON file. The data in the file
should correspond the user events schema as well.

The <walkthrough-editor-select-regex filePath="cloudshell_open/grs-samples-nodejs/resources/user_events.json" regex="id">resources/user_events.json</walkthrough-editor-select-regex>
file should be uploaded to the `user_events` dataset, in the `events` table.

The <walkthrough-editor-select-regex filePath="cloudshell_open/grs-samples-nodejs/resources/user_events_some_invalid.json" regex="id">resources/user_events_some_invalid.json</walkthrough-editor-select-regex>
file, which contains some invalid user events along with valid ones, should be uploaded
to the `user_events` dataset, `events_some_invalid` table. This table will be
used to demonstrate the error handling.

1.  Run the following code in the Terminal to create tables and import data:
    
    ```bash
    node setup/events_create_bigquery_table.js
    ```

    The dataset
    `user_events` with both tables are created. View them in
    [Cloud Console](https://console.cloud.google.com/bigquery).

## Create the BigQuery table and upload products from UI admin console

If you don't have permissions to run the `bq` command and performing the
previous step gives you "Permission denied" error, you can use the UI admin console to
to create the table and upload your data.

### Upload catalog data to Cloud Storage

After you have updated the timestamps in
<walkthrough-editor-select-regex filePath="cloudshell_open/grs-samples-nodejs/resources/user_events.json" regex="id">resources/user_events.json</walkthrough-editor-select-regex>
and
<walkthrough-editor-select-regex filePath="cloudshell_open/grs-samples-nodejs/resources/user_events_some_invalid.json" regex="id">resources/user_events_some_invalid.json</walkthrough-editor-select-regex>,
you can proceed with uploading these data to Cloud Storage.

In your own project create a Cloud Storage bucket and put the JSON file there.
The bucket name must be unique. For convenience, it can be named
`<YOUR_PROJUCT_ID>_<TIMESTAMP>`.

1.  To create the bucket and upload the JSON file, run the following command in
    the Terminal:

    ```bash
    node setup/events_create_gcs_bucket.js
    ```

    The bucket is created in the
    [Cloud Storage](https://console.cloud.google.com/storage/browser), and the
    file is uploaded.

1.  Save the name of the created Cloud Storage bucket printed in the Terminal
    for the next steps.

### Create the BigQuery table and upload user events

1. Go to [BigQuery in Cloud Console](https://console.cloud.google.com/bigquery).

1. In the Explorer panel, find the list of your projects.

1. Click the View actions button next to the current project name and chose **Create Dataset** option.

1. Enter the Dataset ID and click **Create Dataset**.

1. Expand the node of your current project.

1. Click the **View actions** button next to your new dataset and choose **Create table**.

1. To set the source, in the field **Create table from**, choose **Google Cloud Storage** option.

1. Click **Browse** in the **Select file from GCS bucket** and choose the bucket you created on the previous step.

1. Choose **`user_events.json`** and click **Select**.

1. Set the **Destination** field **Table** with the value ```events```.

1. To provide a table schema, enable the toggle **Edit as text** and in the **Schema** field, enter the schema from **`resources/events_schema.json`**.

1. Click **Create table**.

The BigQuery table is created. You can proceed to importing products to the catalog.

## Import user events to the Retail catalog from the BigQuery table

You have already created a BigQuery table, so you can use it in your Retail API
import request.

1.  To check the example of an import user events request, open
    <walkthrough-editor-select-regex filePath="cloudshell_open/grs-samples-nodejs/events/import_user_events_big_query.js" regex="id">events/import_user_events_big_query.js</walkthrough-editor-select-regex>
    file.

    The `parent` field in the `ImportUserEventsRequest` contains a
    catalog name along with a branch number you are going to import your user
    events to. You can import user events to the default branch. However, if
    you're using custom user events, change the default branch, which is `0`, to
    another branch ID, for example `1`.

    The `inputConfig` field defines the `BigQuerySource` method as an import
    source.

1.  To perform the user events import, open Terminal and run the command: 
    ```bash
    node events/import_user_events_big_query.js
    ```

## Response analysis

Once you have called the import user events method from the Retail API, the
import operation starts.

Importing can take some time depending on the size of your BigQuery table.

The operation is completed when the **`done`** field in `Operation` object is set to true.

1.  Check the result. One of the following fields should be present:
    
    - `error message`, if the operation failed.
    - `result array`, if the operation was successful. Array should contain `ImportUserEventsResponse, ImportMetadata, Operation` objects.

    You have imported valid user event objects into the catalog.

1.  Check the `successCount` field in `ImportMetadata` to get the
    total number of successfully imported events.

    **Note** If you run the same code twice, the importing product catalog is exactly the same as the previous one.
    Retail calculates the diff and only performs create/update/delete on the difference. There won't be any update necessary and the `successCount` would be 0.

    The number of failures during the import is returned to the
    `failureCount` field.

1.  Check it printed out in the Terminal: `terminal errorsConfig { gcs_prefix:
    "gs://<PROJECT_ID>_us_import_user_event/errors<ERROR_ID>" }
    import_summary { joined_events_count: 4 }`

## Errors appeared during the importing

Try to import one invalid user event object and check the error message in the
operation response. Note that in this case the operation itself is considered
successful.

The `type` field is required and should have one of
[defined values](https://cloud.google.com/retail/docs/user-events#types). That
is, if you set some invalid value, you get the invalid user event object.

1.  Create one more `events_some_invalid` BigQuery table in the same dataset
    that contains such invalid user events.

    Follow the instructions described in the **Upload user events data to the Cloud
    Storage bucket** and **Create the BigQuery table with the user events data**
    steps and use the
    <walkthrough-editor-select-regex filePath="cloudshell_open/grs-samples-nodejs/resources/user_events_some_invalid.json" regex="id">resources/user_events_some_invalid.json</walkthrough-editor-select-regex>
    file as the source.

1.  Go to the
    <walkthrough-editor-select-regex filePath="cloudshell_open/grs-samples-nodejs/events/import_user_events_big_query.js" regex="// TO CHECK ERROR HANDLING USE THE TABLE OF INVALID USER EVENTS">events/import_user_events_big_query.js</walkthrough-editor-select-regex>
    file and assign a value of `tableId` to the table name: `const tableId = 'events_some_invalid'`

1.  Run the code sample and wait until the operation is completed: 
    ```bash
    node events/import_user_events_big_query.js
    ```

Next, check that the operation printed out to the Terminal.

## Errors appeared during importing: output analysis

If the operation is completed successfully, you can find a `result` array.
Otherwise, there is an `error` message instead.

In this case, the operation is considered successful, and the
`successCount` field contains the number of the
successfully imported events, which is `3`.

There is one invalid user event in the input table, and the number of the failures
during the importing in the `failureCount` field
is also `1`.

The `ImportUserEventsResponse` object points to the errors bucket where you can find a
JSON file with all the importing errors.

The response is the following: `terminal errors_config { gcs_prefix:
"gs://<PROJECT_ID>_us_import_user_event/errors<ERROR_ID>" }
import_summary { joined_events_count: 3 }`

## Errors appeared due to an invalid request

Next, send an invalid import request to check the error message.

1.  Open the
    <walkthrough-editor-select-regex filePath="cloudshell_open/grs-samples-nodejs/events/import_user_events_big_query.js" regex="// TO CHECK ERROR HANDLING PASTE THE INVALID CATALOG NAME HERE">events/import_user_events_big_query.js</walkthrough-editor-select-regex>
    file, and change a local variable `parent` with any invalid catalog name.

1.  Run the code again in the Terminal: 
    ```bash
    node events/import_user_events_big_query.js
    ```

1.  Check the error message: `INVALID_ARGUMENT: Request contains an invalid argument.`

## Congratulations

<walkthrough-conclusion-trophy></walkthrough-conclusion-trophy>

You have completed the tutorial! We encourage you to prepare data and to test
the importing user events from BigQuery table by yourself.

<walkthrough-inline-feedback></walkthrough-inline-feedback>