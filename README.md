# Congress.gov SDK

[![Version badge](https://badgen.net/github/release/basonjar/congress-gov-sdk)](https://github.com/basonjar/congress-gov-sdk)
[![Package size badge](https://badgen.net/bundlephobia/minzip/congress-gov-sdk)](https://bundlephobia.com/package/congress-gov-sdk)

Axios Typescript SDK for the [api.congress.gov](https://www.api.congress.gov/) API.

## Getting started
Install:
```bash
yarn add congress-gov-sdk
# or
npm i congress-gov-sdk
```

Obtain an API key: [https://api.congress.gov/signup](https://api.congress.gov/signup/)

Add the API key to your env:
```CONGRESS_GOV_API_KEY=your-api-key```


Usage:

```ts
import { Configuration, CongressApi, CongressMemberOverview } from "congress-gov-sdk";

const congressApi = new CongressApi(new Configuration({
    apiKey: process.env.CONGRESS_GOV_API_KEY
}));

const response = await congressApi.getMembers({
    offset: 0,
    limit: 50,
    currentMember: true
});

if (response.status != 200) {
    throw new Error("Failed to fetch member list: " + response.statusText);
}
const members: CongressMemberOverview[] = response.data.members;
```

## Features
Currently only supports 5 of the 100 available APIs

Bill API: 0/16

Amendments API: 0/8

Summaries API: 0/3

Congress API: 0/3

Member API: 5/8

Committee API: 0/10

Committee Report API: 0/5

Committee Print API: 0/5

Committee Meeting API: 0/4

Hearing API: 0/4

Congressional Record API: 0/1

Daily Congressional Record API: 0/4

Bound Congressional Record API: 0/4

House Communication API: 0/4

House Requirement API: 0/3

Senate Communication API: 0/4

Nomination API: 0/7

Treaty API: 0/7
