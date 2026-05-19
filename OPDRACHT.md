# Node.js API Assignment

Build your own Node.js REST API, submit it on time, and explain it during a short oral exam. All three parts — the code, the submission, and the defense — are required to pass.


## How to Submit

    Push your project to GitHub Classroom at least one week before your oral exam. Both your application and its documentation must be fully in place by then.
    Fill in the submission form to make your submission official. The link will be shared via Toledo in the week before the deadline.
    Deploy your API online and add two links to your README.md:
    •       The live URL of your running API
    •       The link to your complete API documentation


## What Your Project Must Include
### API & Data

    •       An Express API with at least 17 endpoints
    •       At least 4 data collections that are linked to each other (no standalone collections)
    •       MongoDB for data storage, with Mongoose for modeling
    •       Use embedded documents by default — only use references if you have a strong reason, and explain why

### Security & Authentication

    •       JWT-based authentication and authorization (or a similar technology)
    •       No unlimited or non-expiring JWT tokens
    •       No hardcoded connection strings — use environment variables
    •       Users must not be able to elevate their own privileges
    For instance, a regular not logged in user, a logged in user and an admin.

### Code Quality

    •       Input validation on all incoming data
    •       ObjectId validation before any MongoDB read/write
    •       Error handling that prevents the API from crashing in any scenario
    •       Middleware where appropriate — don't add more than you need
    •       Unit and integration tests — no minimum coverage, but they must meaningfully cover your application

### Documentation & Testing Files

    pdf: If REST Client isn't an option, export and commit your full Postman collection instead. You don't need to include auth tokens.
    •       A step-by-step deployment guide explaining how to get your app running on a cloud server
    Projects where large amounts of code appear in a single first commit will be treated as plagiarism.


## Oral Defense

You'll have 15 minutes to present and explain your project. Your final grade is based on the quality of your API and how well you can explain and defend your choices.


## Deadline

Your project must be submitted at least one week before your oral defense date.

Note: Exam dates aren't fixed at the start of the year, so an exact deadline can't be given yet. The date shown in GitHub Classroom (June 1 at 14:00) is a placeholder and will be updated.

The version of your main/master branch one week before your exam is what gets evaluated.