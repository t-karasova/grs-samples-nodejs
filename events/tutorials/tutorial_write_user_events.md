<walkthrough-metadata>
  <meta name="title" content="Write user events tutorial" />
  <meta name="description" content="Use this method if you want to add one user event to the catalog." />
  <meta name="component_id" content="593554" />
</walkthrough-metadata>

# Write user events tutorial

## Introduction

The Retail API exposes methods for managing user events.
If you want to add one user event to the catalog, you can use the `WriteUserEvent` method.

<walkthrough-tutorial-duration duration="5"></walkthrough-tutorial-duration>

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

## Write user events

The `WriteUserEventRequest` request consists of two fields:
- `parent`—required field. The parent catalog name, such as `projects/<YOUR_PROJECT_NUMBER>/locations/global/catalogs/default_catalog`.
- `userEvent`—required field. The user event you are going to write.

Learn more about the user events in [the Retail documentation](https://cloud.google.com/retail/docs/reference/rpc/google.cloud.retail.v2#userevent)

1. Check the `WriteUserEventRequest` request example in the <walkthrough-editor-select-regex filePath="cloudshell_open/grs-samples-python/events/write_user_event.js" regex="id">`events/write_user_event.js`</walkthrough-editor-select-regex> file.

1. Run the code sample in the Terminal with the following command:
    ```bash
    node events/write_user_event.js
    ```

The Retail API returns the created user event. Check the output in the Terminal.


## Error handling

Next, check the error handling by sending a request with an invalid parent.

1. Open the <walkthrough-editor-select-regex filePath="cloudshell_open/grs-samples-nodejs/events/write_user_event.js" regex="// TO CHECK ERROR HANDLING PASTE THE INVALID CATALOG NAME HERE">events/write_user_event.js</walkthrough-editor-select-regex> file, and change a local variable `parent` with any invalid catalog name.
    ```bash
    const parent = `projects/${projectNumber}/locations/global/catalogs/invalid_catalog`;
    ```

1. Run the code sample in the Terminal with the following command:
    ```bash
    node events/write_user_event.js
    ```

1. Check the error message:
    ```terminal
    NOT_FOUND: catalog_id 'invalid_catalog' not found for project. In most cases, this should be set to 'default_catalog'. If you just created this resource (for example, by activating your project), it may take up 5 minutes for the resource(s) to be activated.
    ```

## Congratulations

<walkthrough-conclusion-trophy></walkthrough-conclusion-trophy>

You have completed the tutorial! We encourage you to test writing user events by yourself.

<walkthrough-inline-feedback></walkthrough-inline-feedback>

### Do more with the Retail API

<walkthrough-tutorial-card id="retail_api_v2_purge_user_events_python" icon="LOGO_PYTHON" title="Purge user events tutorial" keepPrevious=true>Try to purge user events via the Retail API</walkthrough-tutorial-card>

<walkthrough-tutorial-card id="retail_api_v2_rejoin_user_events_python" icon="LOGO_PYTHON" title="Rejoin user events tutorial" keepPrevious=true>
Try to rejoin user events via the Retail API</walkthrough-tutorial-card>