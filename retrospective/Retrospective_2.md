TEMPLATE FOR RETROSPECTIVE (Team 10)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done   5 vs 5
- Total points committed vs. done  19/19
- Nr of hours planned vs. spent (as a team): 112h vs 113h05m

### Additional Notes
The stories we have done are:
#1 - Update Proposal
#2 - Notify Application Decision
#3 - Delete Proposal
#4 - Copy Proposal
#5 - Archive Proposal

**Remember** a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!) 

### Detailed statistics

| Story  | # Tasks   | Points | Hours est. | Hours actual |
|--------|-----------|--------|------------|--------------|
| _#0_   |    16     |        |     75h    |   76h55m     |
| _#1_   |    4      |   3    |     7h     |    8h40m     |
| _#2_   |    4      |   8    |     11h    |     11h      |
| _#3_   |    4      |   2    |     7h     |    6h45m     |
| _#4_   |    2      |   3    |     5h     |    5h30m     |
| _#5_   |    4      |   3    |     7h     |    4h15m     |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual)
    - estimate: h/task 3h19m, stddev 2h45m
    - actual: h/task 3h17m, stddev 2h37m
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1
    - -0.0096 / 0.96%

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated 5h
  - Total hours spent 4h30m
  - Nr of automated unit test cases 58
  - Coverage 75%
- E2E testing:
  - Total hours estimated: 5h
  - Total hours spent: 5h
- Code review 
  - Total hours estimated: 5h
  - Total hours spent: 3h 15m
  


## ASSESSMENT

- What caused your errors in estimation (if any)? 
  - We took more time to implement the login through SAML than expected, on the other hand we spent less time for code reviewing.
  - We underestimate the time for testing and do not consider about the increase of project complexity.

- What lessons did you learn (both positive and negative) in this sprint? 
  - We learned that can be helpful to split a task of frontend and backend with at least one person in common in order to avoid misunderstandings and to make the work more efficient.
  - We learned that could be usefull to spent more time on test especially after each commit, in this way we will not encounter some untested  bugs on the last days 

- Which improvement goals set in the previous retrospective were you able to achieve? 

  - Set more intermediate goals through the entire sprint to make sure teammates aren't waiting on needed features for too long so they can start working on their tasks.
  
  
- Which ones you were not able to achieve? Why?
  We haven't achieved the second one(Avoid overworking on the last 2 days) partially because there were some unexpected bugs during the last days. 
  
- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
  We should spend more time in end to end testing.
  We should reserve time for fixing bugs not only developing.

- One thing you are proud of as a Team!!
  We are proud of the fact that we have wasted less time in this sprint thanks to the improvment made in communication and in the division of the tasks. 