The purpose of this project is to be able to validate x12 data based on custom edits.

The parts that need to be made

- Parser
  - In format of (SegmentName:Elementpositions:SubElementpositions)
  - Element and sublement positions will have leading zeros if under 10
- Configuration for Edits
- Validation of edits

---

## Important Features I thought of while building

- Versioning
  Definitely need a way to version the edits so that changes can easily be reverted in UI and are linked to Users.

---

I've created the basic parser for getting segments and elements and composite elements that follow a format of `Doc['REF']['01']['01']`

Example Edits

```
If
REF01 = "F4" AND REF09 length > 10
throw error
"Value cannot be over 10 characters long"


if REF01 = "F4" OR REF01 = "F5"
    if REF09 > 10 OR REF09 < 5
        throw error "value must be between 5 and 10 characters"
```

Edits could be used in a few different ways
The difficulty is finding the easiest way to display the rule AND process an edi transaction with that rule while not making the rule syntax too cumbersome (no one wants another splunk-like query)

```
{
  "if": {
    "REF01": {
      "check": "equals",
      "value": "F4"
    },
    "OR": {
      "REF01": {
        "check": "equals",
        "value": "F5"
      }
    },
    "THEN": {
      "if": {
        "REF09": {
          "check": "less-than",
          "value": "5"
        },
        "OR": {
          "REF09": {
            "check": "greater-than",
            "value": "10"
          }
        }
      }
    }
  }
}
```

OR maybe the below formats

```
{
  "operation" : "and", terms: [
    {"operation": "or", terms: [
      {field: "REF01", "comparison": "=", "value": "F4"}
      {field: "REF01", "comparison": "=", "value": "F5"}
    ]}
     {"operation": "or", terms: [
      {field: "REF09", "comparison": ">", "value": "10"},
      {field: "REF09", "comparison": "<", "value": "5"}
    ]}
  ]
}

    {"operation": "single", terms: [
      {field: "REF01", "comparison": "=", "value": "F5"}
    ]}


{
    any: [{
      all: [{
        fact: 'gameDuration',
        operator: 'equal',
        value: 40
      }, {
        fact: 'personalFoulCount',
        operator: 'greaterThanInclusive',
        value: 5
      }]
    }, {
      all: [{
        fact: 'gameDuration',
        operator: 'equal',
        value: 48
      }, {
        fact: 'personalFoulCount',
        operator: 'greaterThanInclusive',
        value: 6
      }]
    }]
  }
```

we could just do JS code

```
x12Document;

// This should check to make sure the values are there.
if (x12Document[REF] & x12Document[REF][0] & x12Document[REF][09])

if (x12Document[REF][01] = "F4" | x12Document[REF][01] = "F5") {
   if (x12Document[REF][09] > 10 | x12Document[REF][09] < 5) {
        error.push("value must be between 5 and 10 characters")
   }
}
```

Lets write out the flow

User will make an edit
User will link that edit to trigger on certain conditions:
Transaction type = "837P"
Payer = "FLBLUE"
Submission Date > 01/01/2020

A user will submit an EDI file
It will be stored and then processed
The values in the EDI FILE will be checked for any triggers
If triggers are found for edits, it will run edits against them.
The file will be processed with edits and return an array of errors.
Those errors will be stored and then the user will need to be notified of errors

## Additional Features

1. See all transactions submitted and where it is in the process.

Submitted -> Stored -> Processing -> Rejected | Accepted
Maybe add time in each step to help with troubleshooting?
Along with values processed during each step.

2. Add test files to edits to make sure they pass as you create them.
   UI looks like

   | Edit logic | Fail Test | Pass Test |

## Notes

Should we store edits as raw data (and parse to js) or as js code?

If we store as grammar, we'll need to convert every time an edit is loaded up.
However this can be cached.

One big thing we need is if there is an update to the edits or codes or any configuration, the cache needs to be cleared.

If I decide to make my own language on top of JS, check out this [Article](https://eloquentjavascript.net/12_language.html)

When I pull all the edits for a tradingpartner, I should pull them into one big "file" and store it in a cache.
