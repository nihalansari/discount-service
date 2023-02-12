
# High Level Solution

** TBD **

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


