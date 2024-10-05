// For configuring the PM2 process manager
module.exports = {
    apps: [
        {
            name: "PetWatch",
            port: "10002",
            script: "npm",
            args: "run preview"
        }
    ]
}