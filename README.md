# Google Retail Search 

## NodeJS Samples

The code here demonstrates how you can consume Google Retail Search from JavaScript.

### Before you can run

#### Authorization

In order to authenticate and authorize the NodeJS runtime environment with the Retail Search server,
place a JSON file with credentials and refer environment variable `GOOGLE_APPLICATION_CREDENTIALS` to it (see examples in code)

```
process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './sa.json';
```

#### Installation 

To install all the dependancies, run

```
cd cloudshell_open/retail-search-nodejs-samples
npm install
```

### Running the code samples

To execute an individual code sample, envoke `node` with a file as a parameter at the command line prompt, e.g.:

```
node catalog_service.js 
```
