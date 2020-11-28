# LWC Lodash

[lwc-lodash](https://github.com/exiahuang/lwc-lodash) is lodash for salesforce lwc developer.
<img src="https://lodash.com/assets/img/lodash.svg" alt="lodash" width="200" height="235" />

## deploy lwc-lodash

<a href="https://githubsfdeploy.herokuapp.com?owner=exiahuang&repo=lwc-lodash">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>

or 

```sh
git clone https://github.com/exiahuang/lwc-lodash.git
cd lwc-lodash
sfdx force:source:deploy --loglevel fatal -p force-app/main/default/lwc/lodash/lodash.js-meta.xml --targetusername=$username_or_alias_for_your_sfdc_org
```

## usage

create a lwc compnent
```sh
sfdx force:lightning:component:create --type lwc -n $lwc_name
```

import lwc-lodash to lwc code

```js

import * as _ from 'c/lodash';

console.log(_.difference([1, 2, 3, 4, 5], [5, 2, 10]));

console.log(_.chunk(['a', 'b', 'c', 'd'], 2));

console.log(
_.reduce(
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  function (sum, n) {
    console.log("sum="+sum );
    console.log("n="+n);
    return sum + n;
  },
  0
));

console.log(_.concat([1], 2, [3], [[4]]));

console.log(_.includes([1, 2, 3], 1));
```


## document

- https://lodash.com/docs/
