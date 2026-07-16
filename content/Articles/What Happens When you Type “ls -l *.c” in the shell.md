# What Happens When you Type “ls -l *.c” in the shell.

![](https://miro.medium.com/max/1400/1*k6EHG4Fk3xGmC0LhCkFbqw.png)

Typing the command into my simple shell project directory.

## What’s the Shell Prompt

![](https://miro.medium.com/max/1400/1*y6TmSSWOEMP-aAiHMkXaXw.png)

My shell prompt

This is the shell prompt and it’s actually information stored in the environment variable $PS1 using a format to parse for example this is my $PS1:

![](https://miro.medium.com/max/1400/1*TrbnwqRjTESLkr7-9GGrVg.png)

## Getting The Line

![](https://miro.medium.com/max/1400/1*7XGWT5uRf3Z0NLP3WEJkow.png)

Passing commands to my simple shell through standard input

The first thing any shell will do is reading from standard input whether through a terminal or a pipe the shell should read a line or multiple ones from standard input each line ending with newline ‘\n’.

## The Jewel of the Shell: Parsing

![](https://miro.medium.com/max/1400/1*vNEV7sn9xgLW9c3nESQMTA.png)

Printing the parsing results

As per the screenshot we can see that the shell splits the line into multiple tokens the first one being the program/command to be executed the others are the argument to it which leads us to the next step.

# Actual Work: Testing and Execution

![](https://miro.medium.com/max/1400/1*3_mhI2lG3oADTwNsfm2uXw.png)

Code snippets of different checks inside my simple shell code

## Going right way

There are three types of commands: a builtin command like cd or exit, a full executable or a program located in one of directories in PATH.

**_If_** it is a builtin command it will pass the arguments to a system call whether that is chdir (change directory) or exit.

**_Else if_** it is an alias then we transform the alias and execute it with checks below.

**_if_** it is an absolute path to an executable the program will fork creating a child process then executing the program with the parent process environment variable.

**_Else if_** we test it and concatenate the program name with the directories inside the PATH environment variable and if the file is found the does the fork — execute procedure.

**_Else_** it is not any of these it will print that it’s not found.

# Execution

Let’s delve deeper into the execution of the program:

1.  We fork the main process creating a child process using the “fork()” syscall inheriting the parent environment variable.
2.  After forking we verify if we are in the child process and execute the command using the execve() syscall giving it the program to execute an argument array with the executable as first element and the environment like so execve(arg_array[0], arg_array, environ).
3.  While the child process is executing the program the parent process should wait for it using the wait() syscall which stores in it’s argument the status of the child process.

# Arguments are tricky

> ls -l *.c

In our example of a command there’s a part we didn’t mention which is the wildcard ‘*’ that special character is parsed by the shell and it’s going to match every file ending with .c apart from special characters every argument is passed to the executable as it is.

# Exiting thoughts

Modern Shells are complete languages by themselves and are infinitely useful in many areas from simple scripts to managing datacenters. This project has been incredibly enlightening from because i learned about every part of this incredible piece of software.