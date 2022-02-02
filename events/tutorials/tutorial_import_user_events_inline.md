<walkthrough-metadata>
  <meta name="title" content="Import user events from the Inline Source tutorial" />
  <meta name="description" content="Lets you import user events data inline by creating the array of user events and setting it as an inline source." />
  <meta name="component_id" content="593554" />
</walkthrough-metadata>

# Import user events from the Inline Source tutorial

## Introduction

The Retail API lets you import user events data inline by creating the array of user events and setting it as an inline source.

Use this method if you want to have the increased privacy of having all authentication occur on the backend and are capable of performing a backend import.

For more information about different import types, their restrictions, and use cases, see the [Retail API documentation](https://cloud.google.com/retail/docs/import-user-events).

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
## Import user events to the Retail catalog from the inline source

1. To check the example of an import user events request, open the <walkthrough-editor-select-regex filePath="cloudshell_open/grs-samples-nodejs/events/import_user_events_inline.js" regex="id">`events/import_user_events_inline.js`</walkthrough-editor-select-regex> file.

    The `generateEvent()` method creates the user events to be used in the `inputConfig` field.

    The `parent` field in the `ImportUserEventsRequest` method contains a catalog name along with a branch number you are going to import your user events to. You can import user events to the default branch. However, if you're using custom user events, change the default branch, which is `0`, to another branch ID, for example `1`.

    The `inputConfig` field defines the `UserEventInlineSource` method as an import source.

1. To perform the user events import, run the following command in the Terminal:
    ```bash
    node events/import_user_events_inline.js
    ```

## Response analysis

After you call the import user events method from the Retail API, the import operation starts.

Importing can take a lot of time depending on the size of the user events set in your Cloud Storage.

The operation is completed when the **`done`** field in `Operation` object is set to true.

1. Check the result. One of the following fields should be present:
    
    - `error message`, if the operation failed.
    - `result array`, if the operation was successful. Array should contain `ImportUserEventsResponse, ImportMetadata, Operation` objects.


    You have imported valid user event objects into the catalog.

1. Check the `successCount` field to get the total number of the successfully imported events.

    The number of failures during the import is returned to the `failureCount` field.

    The operation is successful, and the result array contains a `ImportUserEventsResponse` object.
1. Check it printed out in a Terminal:
    ```
    importSummary {
      joinedEventsCount: 3
    }
    ```

## Errors appeared during the importing

Try to import a few invalid user event objects and check the error message in the operation response.
Note that in this case the operation itself is considered successful.

The `type` and `visitorId` fields are required, so if you remove them, you get the invalid user event objects.

1. Set an invalid `eventType` parameter to the `generateEvent()` method and run the import one more time to get an error message.

1. Check the error message:
    ```terminal
    INVALID_ARGUMENT: Unsupported inputConfig.userEventInlineSource.userEvents.eventType invalid.
    ```

## Congratulations

<walkthrough-conclusion-trophy></walkthrough-conclusion-trophy>

You have completed the tutorial! We encourage you to test the importing user events inline.

<walkthrough-inline-feedback></walkthrough-inline-feedback>