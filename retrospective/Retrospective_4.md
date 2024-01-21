RETROSPECTIVE (Team 10)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done   11 vs 11
- Total points committed vs done        35 vs 35
- Nr of hours planned vs spent (as a team)  112h vs 117h10m

### Additional Notes
The stories we have done are:
#1 - Search Archive
#2 - Add Academic Co-Supervisor
#3 - Notify Expiration
#4 - Browse Co-Supervised Proposals
#5 - Notify Application Decision Supervisor
#6 - Notify Added Co-Supervisor
#7 - Professor Approve Student Requests
#8 - Notify Professor Thesis Request
#9 - Student Request from Application
#10 - Student change request
#11 - Notify Co-Supervisor thesis request

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks   |  Points | Hours est. | Hours actual |
|--------|-----------|---------|------------|--------------|
| _#0_   |     9     |         |     48h    |     55h10m   |
| _#1_   |     3     |    3    |     5h     |     5h05m    |
| _#2_   |     3     |    3    |     4h     |     3h45m    |
| _#3_   |     4     |    3    |    6h30m   |     5h50m    |
| _#4_   |     5     |    3    |     7h     |     6h10m    |
| _#5_   |     4     |    3    |    4h30m   |       4h     |
| _#6_   |     4     |    2    |    4h30m   |       4h     |
| _#7_   |     6     |    5    |   10h30m   |     12h05m   |
| _#8_   |     4     |    3    |    4h30m   |     3h15m    |
| _#9_   |     3     |    3    |     3h     |       3h     |
| _#10_  |     5     |    5    |     10h    |     10h20m   |
| _#11_  |     4     |    2    |    4h30m   |     4h30m    |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)
    - estimate: 2h05m/task , 2h55m stddev 
    - actual: 2h10m/task , 3h02m stddev 
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1
    - -0.044 (4.4%)

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated: 8h
  - Total hours spent: 8h15m
  - Nr of automated unit test cases: 124
  - Coverage (if available): 85%
- E2E testing:
  - Total hours estimated: 10h30m
  - Total hours spent: 12h30m
- Code review: 
  - Total hours estimated: 10h30m
  - Total hours spent: 12h30m
- Technical Debt management:
  - Total hours estimated:  5h30m
  - Total hours spent: 4h50m
  - Hours estimated for remediation by SonarQube: 35h
  - Hours estimated for remediation by SonarQube only for the selected and planned issues: 15h
  - Hours spent on remediation: 10h10m
  - debt ratio (as reported by SonarQube under "Measures-Maintainability"): 1.0%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ): (A,A,A)
  
    
## ASSESSMENT

- What caused your errors in estimation (if any)? 
  - The main reasons that gave us problems in the estimation were related to the underestimation of the time required to improve the user interface and the time required to to integrate the features.
  - The gap of information between memebers causes us wasting much time to do non-sense work especially on fixing bugs and integration testing
 
- What lessons did you learn (both positive and negative) in this sprint?
  - We learned that we have to update the information and guidelines in time when we take some unfamiliar technologies, for other group memeber to avoid end to end testing in a wrong way.
  - We learned to communicate in a clearer and coincise way during the pair programming.

- Which improvement goals set in the previous retrospective were you able to achieve? 
   - We were able to achieve both of the previously set goals, specifically, we managed better the intermediate merges, which were smooth and had less conflicts, and feature integrations, trying to do a merge after every feature was completed. We also improved even more the UI/UX, reaching our idea of a good, modern and responsive user interface.

- Which ones you were not able to achieve? Why?
  - We achieved both goals.
  
- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  - Dedicate more time to the integration of the features.
  - Should make a guide or explain if someone taking new tools or technologies which is unfamiliar for most of members to reduce gap of information.
  - We should find a more efficient way to test.
  
- One thing you are proud of as a Team!!
  - We reached our desidered goal to improve the UI reaching a modern and responsive interface.
  - We are proud of the fact that we managed to finish the project in time and with all the features that we planned to implement.
