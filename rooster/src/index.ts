import * as fs from "fs"
import * as path from "path"

const USER_DEFAULTS = {
  team: "main",
  channel: "example",
}

const MM_URL = "http://localhost:8065"

console.log("Rooster server online!")

function read(filepath: string, json = true) {
  let contents

  try {
    contents = fs.readFileSync(filepath, {
      encoding: "utf8",
    })
  } catch {
    contents = false
  }

  if (typeof contents == "string" && json) {
    return JSON.parse(contents)
  } else {
    return contents
  }
}

function matterFetch(endpoint: string, token: string) {
  const api = `${MM_URL}/api/v4/`
  const f = async () => {
    console.log(`${api}${endpoint}`, token)
    const data = await fetch(`${api}${endpoint}`, {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    })
    console.log(await data.text())
    if (data.status === 200) {
      const final = await data.text()
      console.log(final)
    } else {
      return false
    }
  }
  const ret = f()
  console.log(ret)
}

class Action {
  type: string
  channel: string
  text: string

  constructor(props: Action) {
    this.type = props.type
    this.channel = props.channel || USER_DEFAULTS.channel
    this.text = props.text || ""

    if (this.text) {
    }
  }
}

class User {
  name: string
  token: string | false
  defaults:
    | {
        team: string
        channel: string
      }
    | false
  actions: Action[] | false

  constructor({ name }: { name: string }) {
    this.name = name
    const config = read(
      path.join(__dirname, `../data/users/${name}/config.json`)
    )
    const token = read(
      path.join(__dirname, `../data/users/${name}/token.txt`),
      false
    )

    if (config) {
      this.defaults = config.defaults || false
      if (!this.defaults) {
        this.defaults = USER_DEFAULTS
      }

      const actionBuffer = config.actions || false
      this.actions = []
      if (actionBuffer) {
        for (const a of actionBuffer) {
          this.actions.push(new Action(a))
        }
      }
    } else {
      this.defaults = false
      this.actions = false
    }

    if (token) {
      this.token = token
      // set prof pick

      const dog = matterFetch("users/me", token)
    } else {
      this.token = false
    }
  }
}

const test = new User({
  name: "zeek",
})

/*

for user
  grab their config
  create a user in memory
  store their token
  if they have an avatar file, set as profile picture

User
  name
  token
  defaults
    team
    channel
  Action[]
    use user's default unless overridden
    for action's text, parse newlines and escape backticks, convert to string literal

*/
