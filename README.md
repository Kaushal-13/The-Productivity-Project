# Welcome to the Productivity Project.

### Overview.
This was built to give users a one-stop solution for different productivity systems such as Kanban, GTD etc.

For Example if you prefer a Kanban board for a college project + a basic To do List for a different project than you can achieve that in the same app.
Currently this is a very basic prototype that just implements a Kanban board but I wish to make changes along the way.

### Structure.
It is a very basic idea which uses React for Frontend + Flask for server + sqlite for database.
The database is organized in a very simple way.
Suppose we cover k different frameworks then we will have k + 1 Tables. Where k tables represent each Framework + A central table which has a record of all the Current Projects.
For Example
