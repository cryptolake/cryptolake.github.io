# Static Libraries vs Dynamic Libraries in C

![](https://miro.medium.com/max/1288/0*-WmOstmnQTgEdTLq.jpeg)

difference between static libraries and shared(dynamic) libraries

Libraries are an integral part of every programming language, they are used to make code portable and shareable so you can use what’s included in them in multiple projects at the same time.

To use a Library in C you do `#include "headerfile.h"` where all functions of library are included in the header file.

# How do they work ?

Static libraries and Shared libraries work similarly apart from their biggest distinction is that shared libraries could be used by the multiple running programs at the same time so the library would be only loaded one time to memory Also when compiling the library won’t be included with the program so the host OS needs to have library included in it’s system libraries directory `/lib` and `/lib64` in linux, making the program way less portable than if it used static libraries.

In conclusion the advantages of shared libraries are:

-   small sized binary
-   library would have to be loaded one time when multiple programs using it

Disadvantages:

-   Makes program non portable as the host needs to have the right library version in it’s library directory.

the advantages of static libraries are:

-   programs with static libs are portable as all the code is contained into it.

Disadvantages:

-   Program with static libs are big in size as the the program contains the libs size + the program size.

# How to create a Dynamic Library

gcc -c -fPIC *.c

You can create a Dynamic Library in Linux with `gcc` using the `-c`option to generate the object files (.o) from the source files (.c) and the `-fPIC` to make the code position independent. Thus, the following command makes object files `.o` from source files in the current directory.

gcc -shared -o liball.so *.o

Next, we are going to package these objects files into a library. To do this as a Dynamic Library we also use `gcc` but with the `-shared` option. The `-o` is to specify the name of the output file.

# How to use your created Dynamic Library

You have to add the location of your library files into the environmental variable `LD_LIBRARY_PATH` .

export LD_LIBRARY_PATH=.:$LD_LIBRARY_PATH

When compiling c files we need to pass special options to gcc:

gcc -L . main.c -l all -o example

Note that the name we gave to the library in this example was ‘all’. Here we use the `-L` option to tell the program where to find the library, in this case `.` that refers to the current directory. The `-l` option is to tell the compiler to look for the library.