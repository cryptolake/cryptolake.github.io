# Hard links vs Symbolic links, What’s the difference?

When learning about Linux/UNIX you would certainly hear about or use symbolic or hard links but what’s the difference?

Before delving into what each of these type of links actually are, there’s an important concept about UNIX filesystems you need to know: inodes.

![List files on the current directory with the inode number on the left.](https://miro.medium.com/max/1400/1*gAF-wplFnhs3CDa5X2jcPQ.png)

Listing files in the current directory with the inode number on the far left.

# Inodes

> Everything in UNIX is a file.

Just like the saying everything is a file and every file is known to the system by a number called the **inode.** A file in the file system is basically a link to it. Now let’s see why we needed to understand this.

# Hard Links

![](https://miro.medium.com/max/1400/1*ORSS4H54Y2FEIqyJPvXX8w.png)

See how both the original and file and the hardlink have the same inode number.

Like in the screenshot the hardlink has the same inode number as the the original file. **A hard link, then, is just a link to the same underlying inode.**

Meaning deleting, renaming, or moving the original file will not affect the hard link as it links to the underlying inode. Any changes to the data on the inode is reflected in all files that refer to it.

# Symbolic Links

![](https://miro.medium.com/max/1400/1*3Ss6U8HQOLe8sf2tx34FjA.png)

The original file and the symbolic link have a different inode.

A symbolic link is a link to another name in the file system. If the symbolic file is deleted, the original still exists. However, if the original file is deleted, the symbolic file is not going to work correctly because it links to the nonexistent file.

# About links and File Systems

![](https://miro.medium.com/max/1028/1*Q77tFyicUYPNVBh-9aYfeg.jpeg)

A Picture explaining their relationship in the file system.

There are of course limitations and one of the important ones are that The soft link can cross to other file systems because of the difference of inodes but A hard link because it’s a reference to the inode and inodes are only property of their file system.