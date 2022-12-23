const Hapi = require("@hapi/hapi")

const init = async () => {
  const server = Hapi.server({
    port: 8005,
    host: "0.0.0.0",
  })

  server.route({
    method: "GET",
    path: "/",
    handler: () => {
      console.info("almost out of plants")
      return "Hello Worldlol!"
    },
  })

  await server.start()
  console.log("Server running on %s", server.info.uri)
}

process.on("unhandledRejection", (err) => {
  console.log(err)
  process.exit(1)
})

init()
