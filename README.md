# Petwatch

A web-application developed for SFU's CMPT372 Server-side development course. Created in partnership by [Bea M](https://github.com/Q-Bea), [Divya S](https://github.com/divyasoneji), [Monishak G](https://github.com/MonishkaG), and [Jodhan G](https://github.com/jodhangill)

# Purpose

Similar to how [Project529](https://project529.com) reduces stress for bike owners when their bike is stolen, this application aims to relieve stress for pet owners when their furry friend ventures out of the house. By registering their pet with PetWatch, they can download and print a unique QR code that identifies their pet in the system. Then, anyone who finds the pet can scan their QR code and instantly be connected with the pet's owner using the in-app chat or the map-pin feature. Authentication protects user information from the public web, requiring that user's make an account before being able to see any private info.

Compared to a conventional solution, PetWatch allows owners to change vital information on the fly even if their pet isn't around. Additional features such as map-pins and chats all work together to greatly increase the chance that the pet can be returned safe and sound.

# Development

The application was developed using Nuxt3+Vue3, with authentication services provided by Auth0, map services by Google, email services by SendGrid, image storage by GCP Bucket Storage, and database services by MongoDb Atlas. The project was initially hosted via GCP to satisfy course requirements, but has since been migrated to Azure.

At this time the project is finished and no more additions are being accepted. Although complete, this project should not be considered production-ready and is kept online for demonstration purposes only. The live demo can be found [here](https://petwatch.website).
