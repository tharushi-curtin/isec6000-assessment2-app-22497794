# AWS Elastic Beanstalk Node.js Sample App

This repository contains a sample Node.js web application built using [Express](https://expressjs.com/), meant to be used as part of the AWS DevOps Learning Path.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.


## Assessment 2 CI pipeline

Jenkins job: `22497794_Assessment2_pipeline`

The pipeline checks the main branch for changes every five minutes.
It installs dependencies and runs tests in a Node 16 Docker agent,
then runs npm audit with a high-severity failure threshold.
After successful checks, it builds and publishes the application image.

Docker Hub image: `tharushi22497794/isec6000-assessment2`

Published tags include the Jenkins build number and Git commit,
plus `latest`. Test results, coverage, dependency audit results and
image metadata are archived with the Jenkins build.
