# C static libraries and how to use them.

![](https://miro.medium.com/max/1400/0*ytoiBg8j-JAryRjy)

# Why bother to create a library?

When developing programs is they tend to grow larger and larger and everything becomes a mess that is hard to manage polluting our directory.

There is also another reason for making libraries and it is that for example you made a set of functions and variables that can be used on multiple occasions: You create a library!

![Content of a c library listed with nm -s](https://miro.medium.com/max/1400/1*McZAwmXZz9Jzu7aKABF3iA.png)

Listing content of a c static library

# But what About C static libraries. How do they work?

Static libraries are essentially just collections of object files that are linked into the program during compilation (check my other article on c compilation!) and are not used during runtime this means only the program executable is needed when running the program all of the library content are already linked into it. This is pretty neat as it allows for a single executable to run everywhere reducing the famous phrase “but it worked in my machine!?”.

![Overview on how static libraries work](https://miro.medium.com/max/1400/0*8vZClW6ZYVoYw-2B.png)

How static libraries work.

# Alright then How to create them now

The basic tool used to create static libraries is a program called `'ar'`, for 'archiver'. This program can be used to create static libraries (which are actually archive files).

It’s to make a simple library (archive) of the object files you do this:

`ar rc <object files>`

After an archive is created, there is a need to index it. This index is later used by the compiler to speed up symbol(functions and variables) lookup inside the library, and to make sure that the order of the symbols in the library won’t matter during compilation.

The command used to create or update the index is called `'ranlib'`, and is invoked as follows:

`ranlib <name of library usually ending with .a>`

# The best part is using the library

![](https://miro.medium.com/max/1400/1*X5Vive5aJjaI9lOKrGrI5A.png)

Header file containing the functions prototype of the library

To use a static library we need to additional flags to the compiler.

Here we are compiling program.c with a library called libmy.a

`gcc program.c -L. -lmy -o program`

The two flags needed here are `-L` and `-l<library name without lib and .a>`

`-l` tells the compiler the static library to use

`-L` tells the compiler to look for the library in the current directory in addition to standard locations where the compiler looks for system libraries.