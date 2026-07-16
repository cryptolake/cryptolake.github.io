# C compilation under the hood

![](https://miro.medium.com/max/1400/1*yDWcWBuiviq7GZhcoAwm_g.png)

Typical compilation screen of a medium sized program

Cis a compiled language meaning that for code to be executed it needs to be compiled but that transition from human readable code to machine code is not a single step but rater multiple ones each one handles an important role in the process.

# 1. Preprocessing

This is the first step the compiler does and it basically consists of steps to clean the code for the rests of the part to read by:

1.  Removing comments.
2.  Expanding macros.
3.  Expanding header files as in copying the header files content and copying it into the source file.

For example we have the file main.c:

![](https://miro.medium.com/max/1400/1*CCVbtQmbhdIXvlR09vR8Mw.png)

contents of main.c

We can preprocess the code with `gcc -E main.c` .

![](https://miro.medium.com/max/1400/1*AdVF6G0e8EOoHaBqT2Dcuw.png)

output of the preprocessor

# 2. Compiling

It consists of reading the preprocessed code and generating assembly code from it.

Again with main.c we can do `gcc -S` to get compile our code to assembly:

![](https://miro.medium.com/max/1400/1*J1Sc3TZ4EwUKaMySEKiCeQ.png)

The assembly code of main.c

# 3. Assembler

The assembler will convert assembly code into machine code to a file called an object file that usually end with the extension `.o` same as the others we can get reach this step with `gcc -c main.c` :

![](https://miro.medium.com/max/1400/1*fz3zrcpIhM2q8UYybYbrPA.png)

We can see that the generated file is binary

# 4. Linking

This is the last step in the compilation process, The linker merges all the object code from multiple modules into a single one. If we are using a function from libraries, linker will link our code with that library function code.

In static linking, the linker makes a copy of all used library functions to the executable file. In dynamic linking, the code is not copied, it is done by just placing the name of the library in the executable file.

![](https://miro.medium.com/max/1400/1*jUpfOZq_5ZCL533GGLrzLw.png)

main.c completely compiled and ready for execution

As you can see the compilation is not as it seems and it’s not just one simple step, Though this is just touching the surface, as under each of these steps lays other important that makes the compiler what it is.