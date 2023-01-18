import { User } from "./models"
import { userArray } from "./utils"

console.log("Rooster server online!")

const users = new Set()

for (const user of userArray) {
  users.add(
    new User({
      name: user,
    })
  )
}

console.log(users)
