import fs from "fs"
import path from "path"

export const USER_DEFAULTS = {
  team: "main",
  channel: "datadog-alerts",
}

export const MM_URL = "http://localhost:8065"

export const POST_WAIT_SECONDS = 10

export async function matterGet(endpoint: string, token: string) {
  const api = `${MM_URL}/api/v4/`
  const data = await fetch(`${api}${endpoint}`, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  })

  if (data.status >= 200 && data.status < 300) {
    const text = await data.text()
    return text
  } else {
    const text = await data.text()
    console.log(text)
    return false
  }
}

export async function matterPut(
  endpoint: string,
  token: string,
  body?: object
) {
  const api = `${MM_URL}/api/v4/`
  const data = await fetch(`${api}${endpoint}`, {
    method: "PUT",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
    body: JSON.stringify(body),
  })

  if (data.status >= 200 && data.status < 300) {
    const text = await data.text()
    return text
  } else {
    const text = await data.text()
    console.log(text)
    return false
  }
}

export async function matterPost(
  endpoint: string,
  token: string,
  body?: object
) {
  const api = `${MM_URL}/api/v4/`
  const data = await fetch(`${api}${endpoint}`, {
    method: "POST",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
    body: JSON.stringify(body),
  })

  if (data.status >= 200 && data.status < 300) {
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

  try {
    contents = fs.readFileSync(filepath, {
      encoding: "utf8",
    })
  } catch {
    return false
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
