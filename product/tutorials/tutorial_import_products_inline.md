<walkthrough-metadata>
  <meta name="title" content="Import up to 100 products at a time from the inline source tutorial"/>
  <meta name="description" content="Inline importing is a convenient way to make bulk changes in a catalog" />
  <meta name="component_id" content="593554" />
</walkthrough-metadata>

#  Import up to 100 products at a time from the inline source tutorial

## Introduction

Inline importing is a convenient way to make bulk changes in a catalog, such as:

- Import up to 100 products at a time.
- Update products.
- Make fast and frequent changes to the products' quantity, price, or any other field.

To import your products into a catalog inline, you should prepare the `product_inline_source` object, which is a set
of products.

Each product should be provided in JSON format as a standalone line (one product per line with line breaks as a
delimiter). To find an example of a product in JSON format, see
the [Retail API documentation](https://cloud.google.com/retail/docs/upload-catalog#json-format).

To find more information about different import types, their restrictions, and use cases, see the [Retail API documentation](https://cloud.google.com/retail/docs/upload-catalog#considerations).

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

## Import products from the inline source

The only reconciliation mode available for inline importing is `INCREMENTAL`. That is, importing automatically creates new products and updates current products. Products already present in a catalog and missing from the imported JSON source will not change.

1. To check the example of an import product request, open <walkthrough-editor-select-regex filePath="cloudshell_open/nodejs-retail/samples/interactive-tutorials/product/import-products-inline-source.js" regex="id">product/import-products-inline-source.js</walkthrough-editor-select-regex>.

    The `parent` field contains a catalog name along with a branch number where products will be imported.

    If you are using products prepared for these tutorials from <walkthrough-editor-select-regex filePath="cloudshell_open/nodejs-retail/samples/interactive-tutorials/resources/products.json" regex="id">resources/products.json</walkthrough-editor-select-regex> file, you can use the default branch to import products to. However, if you are using custom products, change the default_branch, which is **0**, to another branch ID, for example **1**. In the search tutorials you request `SearchService` to search for products in the default branch.

    The `inputConfig` field defines the `ProductInlineSource` as an import source.

1. To import the products, open the Terminal and run the following command:
    ```bash
    node product/import-products-inline-source.js
    ```

## Response analysis

When you call the import products method, the import operation starts.

Importing might take some time depending on the size of product set in your inline source.

The operation is completed when the **`done`** field in `Operation` object is set to true.

1. Check the result. One of the following fields should be present:
    
    - `error message`, if the operation failed.
    - `result array`, if the operation was successful. Array should contain `ImportProductsResponse, ImportMetadata, Operation` objects.

1. Check the `successCount` field in `ImportMetadata` to get the total number of successfully imported products. The number of failures during the product import is returned in `failureCount` field.

## Error handling

Try to import a few product objects, add an invalid one to them, and check the error message in the operation response.

**Note**: The operation in this example will generate an error message, but will complete successfully.

The title field is required, so if you remove it, you will get an invalid product object.

1. Go to the code sample and comment or remove the <walkthrough-editor-select-regex filePath="cloudshell_open/nodejs-retail/samples/interactive-tutorials/product/import-products-inline-source.js" regex="#IamRemarkable Pen">line `title: '#IamRemarkable Pen'`. </walkthrough-editor-select-regex>

1. Run the code sample and wait till the operation is completed:
    ```bash
    node product/import-products-inline-source.js
    ```

Next, check the operation printed out in the Terminal.

## Error handling output analysis

If the operation is completed successfully, the `result` array will be displayed. Otherwise, an `error` message is displayed instead.

1. Check the error message in the `errorSamples` list. It should state the invalid product object and its field that caused a problem:

    ```
   errorSamples: [
        Status {
            details: [],
            code: 3,
            message: 'Field "product.title" is a required field, but no value is found.'
        }
    ]
    ```

1. Send an invalid import request to make the operation fail. In the code sample, change a local variable, `parent`, with an invalid catalog name.

1. Run the code sample and wait till the operation is completed:
    ```bash
    node product/import-products-inline-source.js
    ```

1. Check the result:

    ```terminal
    INVALID_ARGUMENT: Request contains an invalid argument.
    ```

## Congratulations

<walkthrough-conclusion-trophy></walkthrough-conclusion-trophy>

You have completed the tutorial! We encourage you to test importing products from Cloud Storage by yourself and try different combinations of various filter expressions.

<walkthrough-inline-feedback></walkthrough-inline-feedback>