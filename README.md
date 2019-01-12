# version-control
Basic object differences storage library 

### Documentation
This library created to work with custom editors allowing to have back and forward functionality.

### Analysis
We deffinately don't want to store all versions in memory or in storage. We should have start point and inbetween differenses, when user pushes new object state to list. 

There are 2 optimal ways that i see this task being solved. 
First is to use deep compare algorithms to find object and arrays differenses and then use them via custom API. 
Or more efficient way, i think, is to use strings. So instead of working with objects directly we can build srting and then parse in with JSON. This approach will reduce amount of memory for diffs and easier to understand.

I found a good article about diff algorithm: 
[P. Heckel, A technique for isolating differences between files Comm. ACM, 21, (4), 264–268 (1978).](https://dl.acm.org/citation.cfm?id=359460.359467&dl=GUIDE&dl=ACM&idx=359460&part=periodical&WantType=periodical&title=Communications%20of%20the%20ACM)


### Roadmap
Library should have:

1. LIFO structure
2. Ability to work on client with big objects (100mb or more)
