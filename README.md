
# High Level Solution

## Schema

**Customers Table**
|Customer Id |Customer Name |
|-----|------------|
|**1** |SecondBite
|**2** |Axil Coffee Roasters
|**3** |MYER
|**4** |default
|**..** |...

**Products Table**
|Product Code|Product Name|Product Description |Retail Price|
|-----|-----|------------|------------|
|classic|**Classic Ad** |Offers the most basic level of advertisement | $269.99
|standout|**Stand out Ad**|Allows advertisers to use a company logo and use a longer presentation text|$322.99
|premium|**Premium Ad**|Same benefits as Standout Ad, but also puts the advertisement atthe top of the results, allowing higher visibility|$394.99
|..|..|........|...


**Deals**


A) PriceDeals Table
|Customer Id |Product Code |Price|
|-----|------------|-----|
|**1** |standout|299.99|
|**2** |premium|389.99|
|.. |...|...|


B)xForyDeals Table
|Customer Id |Product Code |x units|y units|
|-----|------------|-----|-----|
|**1**|classic|3|2|
|**1**|classic|30|13|
|**3**|standout|5|4|

** The tables could be RDS or Nosql as well depending on the volume of queries/Opex. A separate UI for Operations team could be made available that directly updates information on these tables. This UI/interface would be the core application component with the help of which the pricing rules and offer rules could be maintained over a period of time. In a typical production setup, a timestamp field called "business_end_date" could be introduced to end-date a particular row so that there's room for multiple similar rows in the same table(Design pattern: Temporal data). 


# Workflow


# Assumptions 
1) The discount rules, i.e. respective prices as well as the number of offers for a particular customer is going to be changed in future(an ongoing activity throughout the life of the service). 
2) This is a standlone node service written in plain javascript. More time and resources will enable a typescript implementation which is desirable for Production.
3) This repo, as such, is not suitable to be run in Prod environment. 
4) Few of the tools and npm deps are legacy and old. Could be replaced with new. Example: Craco Vs. Babel.
5) The npm dependencies have not been scanned for recent security vulnarabilities.
6) Tests provided use a mock database. Actual implementation would involve a relational database(AWS RDS) or a nosql(AWS DDB).
7) The repo cannot be deployed on AWS. Terraform/cdk/cloudformation deployment artifacts would need to be introduced for this. 
8) The repo can only be tested locally as of now.
9) Test coverage: Approx 80%+
# Steps to run locally
Step1: npm deps
```
npm install
```
Step2: build
```
npm run build
```
Step3: Unit/regression test  
```
npm run test
```


