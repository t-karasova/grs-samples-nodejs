<walkthrough-metadata>
  <meta name="title" content="Faceting tutorial" />
  <meta name="description" content="In this tutorial you will learn some examples of product faceting." />
  <meta name="component_id" content="593554" />
</walkthrough-metadata>

# Search with faceting tutorial

## Get started

Facets are product attribute filters (for example, brand or color) that helps
your users further narrow down their search results. Facet values usually are
placed on the UI search page alongside search results, allowing a user to select
and filter search results by facet values.

Facets are based on attributes you have provided for a product, such as color,
size, brand, or custom attribute. The Retail can use each product attribute
as facet key only if this attribute is set to indexable.

In this tutorial you will learn some examples of getting facets.

<walkthrough-tutorial-duration duration="4"></walkthrough-tutorial-duration>

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
## Getting textual facets, facet_key = "colorFamilies"

To include facets to the search response, you provide a **```FacetSpec```** in
the search request body, explicitly passing product attributes as facets.

1. In the FacetSpec the only required field is the **```facetKey```**. It
   defines the product attribute to be used as facet. You can set here ether
   textual or numerical field name. The full list of the facet keys you can find
   in the [Retail documentation.](https://cloud.google.com/retail/docs/reference/rpc/google.cloud.retail.v2#facetkey)

1. Now open <walkthrough-editor-select-regex filePath="cloudshell_open/nodejs-retail/samples/interactive-tutorials/search/search-with-facet-spec.js" regex="id">search-with-facet-spec.js</walkthrough-editor-select-regex>.

   In the initial request, the textual facet "colorFamilies" is going to be returned.

   So the SearchRequest is looking like this:

   ```js
    placement: 'projects/<PROJECT_ID>/locations/global/catalogs/default_catalog/placements/default_search'
    query: 'Tee'
    visitorId: '123456'
    page_size: 10
    facetSpecs: [
      {
        facetKey: {
          key: 'colorFamilies'
        }
      }
    ]
    ```

## Getting textual facets: result analyze

1. Run the sample in a terminal with the following command:

    ```bash
    node search/search-with-facet-spec.js
    ```
1. Check the response contains the object **```facets```**:

    ```json
    "facets": [
      {
        "values": [
          {
            "count": "16",
            "value": "Black",
             "facetValue": "value"
          },
          {
            "count": "8",
            "value": "Blue",
            "facetValue": "value"
          },
          {
            "count": "3",
            "value": "Gray",
            "facetValue": "value"
          },
          {
            "count": "14",
            "value": "Green",
            "facetValue": "value"
          },
          {
            "count": "5",
            "value": "Navy",
            "facetValue": "value"
          },
          {
            "count": "4",
            "value": "Red",
            "facetValue": "value"
          },
          {
            "count": "4",
            "value": "White",
            "facetValue": "value"
          }
        ],
        "key": "colorFamilies",
        "dynamicFacet": false
      }
    ],
    ```

## Getting textual facets, facetKey = "brands"

1. Next, change the value of the field **facet_key** and run the code sample again:

    ```js
    facetKey: {
       key: 'brand'
    }
    ```
1. Now you can check the results. The **facets** object now contains brands:
    ```json
    "facets": [
      {
        "values": [
          {
            "count": "3",
            "value": "#IamRemarkable",
            "facetValue": "value"
          },
          {
            "count": "10",
            "value": "Android",
            "facetValue": "value"
          },
          {
            "count": "107",
            "value": "Google",
            "facetValue": "value"
          },
          {
            "count": "3",
            "value": "Google Cloud",
            "facetValue": "value"
          },
          {
            "count": "2",
            "value": "Stan and Friends",
            "facetValue": "value"
          },
          {
            "count": "7",
            "value": "YouTube",
            "facetValue": "value"
          }
        ],
        "key": "brands",
        "dynamicFacet": false
      }
    ],
    ```

## Getting numerical facets

To  get the facets for the numerical field, you should specify the intervals of
values for each faceting field.

1. Modify the ```SearchRequest``` to get price facet with two price intervals: $(0 - 20.0] and $(21.0 - 50].
   Add the **```intervals```** field to the ```facetKey``` object:
    
    ```js
        intervals: [
          {
            minimum: 0.0,
            maximum: 20.0
          },
          {
            minimum: 21.0,
            maximum: 50.0
          }
        ]
    ```

1. Change the ```facetKey``` value:

    ```js
     facetKey: {
       key: 'price'
     }
    ```

## Getting numerical facets. Result analyse

1. Run the sample in a terminal with the following command:

    ```bash
    node search/search-with-facet-spec.js
    ```
1. Check the response contains the object **```facets```**:

    ```json
    "facets": [
      {
        "key": "price",
        "values": {
          "interval": {
            "minimum": "0.0",
            "maximum": "25.0",
          },
          "count": "96",
        },
        "values": {
          "interval": {
            "minimum": "26.0",
            "maximum": "50.0"
          },
          "count": "35"
        }
      }
    ] 
    ```

## Congratulations

<walkthrough-conclusion-trophy></walkthrough-conclusion-trophy>

You have completed the tutorial! We encourage you to test the faceting feature by yourself and try different facet_keys.

<walkthrough-inline-feedback></walkthrough-inline-feedback>