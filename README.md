# Azure Function local development sample

This is a sample Azure Function project that allows you to call Graph API and SharePoint API using M365 and Az CLI access tokens locally.

## Prerequisites

* NodeJS 18/20
* M365 CLI & Azure CLI installed

If this is your first time running M365 CLI, see:
https://pnp.github.io/cli-microsoft365/user-guide/connecting-microsoft-365#log-in-to-microsoft-365-1

## Getting this sample to work

1. Clone this repo
2. Install project dependencies
```bash
npm install
```
3. Change ***local.settings.json*** properties ***SHAREPOINTTENANTURL*** and ***SHAREPOINTSITEURL*** to your own tenant and site where you have access
```json
    "SHAREPOINTTENANTURL": "https://contoso.sharepoint.com",
    "SHAREPOINTSITEURL": "https://contoso.sharepoint.com/sites/myawesomesite"
```
4. Login with az and m365

```bash
az login
m365 login -t browser
```
5. Start the function
```bash
npm run start
```
6. Test that the sample API's work with your CLI credentials
* http://localhost:7071/api/graphTest
* http://localhost:7071/api/spTest

