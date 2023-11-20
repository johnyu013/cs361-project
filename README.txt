A. In the name field, type your desired Pokemon. An example would be Pikachu, 
note that case doesn't matter.

B. Near the bottom of the page it should load an image of the requested Pokemon.
Also, in the terminal running the microservice it will load both the name and link to that image.

C.
+----------------+           +---------------------+           +----------------------+
|      User      |           |       Frontend      |           |     Microservice     |
+----------------+           +---------------------+           +----------------------+
        |                               |                               |
        |   1. Enter Pokemon Name       |                               |
        | ----------------------------->|                               |
        |                               |                               |
        |                               |    2. Send API Request        |
        |                               | ----------------------------> |
        |                               |                               |
        |                               |                               |
        |                               |    3. Receive API Response    |
        |                               |<------------------------------|
        |                               |                               |
        |    4. Display Pokemon Data    |                               |
        |<------------------------------|                               |
