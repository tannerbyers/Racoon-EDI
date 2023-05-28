If you don't need to perform searches based on the components of rules then you can store the rule in two fields in the database. The condition under which the statement gets executed in one and the statement that is executed in another.

id, name, description, condition, statement
Your rules can be stored using JSON or some similar format.

I'll need to define some terminology that I'll be using. There are atomic terms, system values compared to values inputted by the user that evaluate to true/false, and complex terms, terms combined using logical operators.

In an atomic term, var denotes a value that the system will provide (such as the number of visitors or number of unique visitors). Comparisons determine how the var is to be evaluated against the value. The value is a number or string that the user produces. When a var and value are both numbers, comparisons can be "<", "<=", "=", ">=", or ">". When a var and value are both strings, comparisons can be "equals", "begins with", "ends with", or "contains". Atomic terms can be stored as follows:

{ var: varName, comp: comparison, value: numberOrString }
You can store the complex terms consisting of conjunctions, disjunctions, and negations (and/or/not) using the following formats.

// Conjunction
{ op: "and", terms: [ term, ..., term ] }

// Disjunction
{ op: "or", terms: [ term, ..., term ] }

// Negation
{ op: "not", term: term }
You can then build statements that evaluate to true/false using these methods. An example is as follows:

{ op: "and", terms: [
{op "or", terms: [
{ field: "numVisitors", comp: ">", value: 1000 },
{ field: "numUniqueVisitors", comp: ">=" 100 }
]},
{ op: "not", term: {
{ field: "numVisitors", comp: "<", value: 500 }
}}
]}
The example above equates to true when the number of visitors is greater than 1000 or the number of unique visitors is greater than or equal to 100, and the number of visitors is not less than 500.

You can then execute what you refer to as a "statement" when the rule evaluates to true.
