import fs from "fs"
import path from "path"

export const USER_DEFAULTS = {
  team: "main",
  channel: "example",
}

export const MM_URL = "http://localhost:8065"

export async function matterFetch(endpoint: string, token: string) {
  const api = `${MM_URL}/api/v4/`
  const data = await fetch(`${api}${endpoint}`, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  })

  if (data.status === 200) {
    const text = await data.text()
    return text
  } else {
    const text = await data.text()
    console.log(text)
    return false
  }
}

export function readUserFile(filepath: string, type: string = "") {
  let contents

  if (type !== "blob") {
    try {
      contents = fs.readFileSync(filepath, {
        encoding: "utf8",
      })
    } catch {
      return false
    }
  } else {
    try {
      contents = fs.readFileSync(filepath)
      contents = Buffer.from(contents)
      return contents
    } catch {
      return false
    }
  }

  switch (type) {
    case "json":
      return JSON.parse(contents)
    default:
      return contents
  }
}

export function getAllUsers(filepath: string, json = true) {
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

export const userArray = fs.readdirSync(
  path.join(__dirname, "../../data/users/")
)
