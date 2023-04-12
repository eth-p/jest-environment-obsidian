# Contributor Documentation

This directory contains shims for the Obsidian API.

**ALL CODE IN HERE IS TO BE USED WITH THE `jest-enviroment-obsidian` ENVIRONMENT, AND LOADED INSIDE THE UNIT TEST CONTEXT. IT WILL NOT WORK WHEN LOADED UNDER THE DEFAULT CONTEXT.**

## Directories

### **`enhance`**

Contains global functions, variables, and prototype extensions.

-   `enhance/lib-dom`: Extensions relating to the W3C DOM API.
-   `enhance/lib-ecmascript`: Extensions relating to built-in ECMAScript types.

> **[!]** Each source file should be named after the type its extending.

> **[!]** Shared internal functions/classes should be located in a script named after the type, prefixed with an underscore.

### **`obsidian`**

Implementation of the `obsidian` module and global variables.

-   `enhance/classes`: Classes exported in the `obsidian` module.
-   `enhance/components`: UI component classes exported in the `obsidian` module.
-   `enhance/functions`: Standalone functions exported in the `obsidian` module.
-   `enhance/variables`: Variables exported in the `obsidian` module.

> **[!]** Each source file should be named after the type its extending.

> **[!]** Shared internal functions/classes should be located in a script named after the type, prefixed with an underscore.
