RETROSPECTIVE (Team 10)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done   5 vs 5
- Total points committed vs done    23 vs 23
- Nr of hours planned vs spent (as a team)   112h vs 111h50m

### Additional Notes
The stories we have done are:
#1 - Access applicant CV
#2 - Notifty Application
#3 - Insert Student Request
#4 - Proposal expiration
#5 - Secretary Approve Student requests

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks   |  Points | Hours est. | Hours actual |
|--------|-----------|---------|------------|--------------|
| _#0_   |     13    |         |    65h     |    66h30m    |
| _#1_   |     6     |    8    |    16h     |    14h50m    |
| _#2_   |     3     |    3    |    4h      |    3h45m     |
| _#3_   |     6     |    5    |    11h     |    11h30m    |
| _#4_   |     1     |    2    |    1h      |    1h        |
| _#5_   |     7     |    5    |    15h     |    14h15m    |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)
    - estimate: h/task 3h06m, stddev 3h33m
    - actual: h/task 3h06m, stddev 3h28m
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1
    - 0.0015 / 0.15%

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 4h
  - Total hours spent: 4h
  - Nr of automated unit test cases: 95
  - Coverage (if available): 87%
- E2E testing:
  - Total hours estimated 5h
  - Total hours spent 5h10m
- Code review 
  - Total hours estimated 6h
  - Total hours spent 4h
- Technical Debt management
  - Total hours estimated:  16h
  - Total hours spent: 20h30m
  - Hours estimated for remediation by SonarQube: 3h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 1h
  - Hours spent on remediation: 1h30m
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 1.3%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): (A,A,A)
  
    
  


## ASSESSMENT

- What caused your errors in estimation (if any)? 
  - We don't have an important error in the total estimation but we had a few errors in the estimation of single tasks, where more or less time was spent than expected. In particular, we underestimated the tasks relating to the frontend, like the redesign of the UI and the improvement of the UX, and the expected time to integrate the features. In contrast, we overestimated certain tasks relating to the backend, like adding new needed APIs.
  - Additionally, when configuring sonarcloud the first few runs had a lot of code duplication, code coverage and code smells, which were wrongly reported because SonarCloud was not configured correctly as it was not ignoring the mock database files which were multiple thousands of lines of code. This caused the debt ratio to be very high, but after the configuration was fixed the debt ratio was closer to the expected one.
  
- What lessons did you learn (both positive and negative) in this sprint?

  - We learned that we have to do more intermediate merges of the github branch to avoid conflicts at the end.
  - We learned that we should update the docker image in time to avoid end to end testing in a wrong way.

- Which improvement goals set in the previous retrospective were you able to achieve? 

  - We achieved both the goals of spending more time on end to end testing and reserved enought time for fixing bugs.
  
- Which ones you were not able to achieve? Why?

  - Luckily, we achieved both of them.


- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

  - We should spend more time for intermediate merge and feature integration.
  - Further improve the UI/UX 

- One thing you are proud of as a Team!!

  - The communication inside the group has become more easier and faster, at the same time the whole group has become more adept at using the tools we have available.