Processor Definitions
=============================
because the ADMB-UI expression editor uses the pipeline compiler, we need to store
the processor descriptions (which are used by the compiler) separate from the 
processor implementations to prevent the entire processor implementation (and all
of its dependencies) out of the webpack - this is especially important for the current
webpack version used by ADMB-UI since it no longer provides stubs/polyfills for NodeJS
core APIs.

Processor implementations are in the `rt/processors` package.

Eventually we'll look to drive the processor definition from TSDoc either on the 
procesor implementations or the libmetric operators.
