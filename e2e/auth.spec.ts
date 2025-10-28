import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'

const emails: Array<string> = []
const passwords: Array<string> = []

test('Sign up direclty through API', async ({ request }) => {
  const email = faker.internet.email()
  const password = faker.internet.password()
  const response = await request.post('/api/auth/create_user', {
    data: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: email,
      password: password,
    },
  })
  const res = await response.json()

  emails.push(email)
  passwords.push(password)

  expect(response.status()).toBe(200)
  expect(res.response).toBe('SUCCESS')
})

test('Delete users direclty through API', async ({ request }) => {
  const email = emails.pop()
  const password = passwords.pop()

  const response = await request.delete('/api/auth/delete_user', {
    data: {
      email: email,
      password: password,
    },
  })
  const res = await response.json()

  expect(response.status()).toBe(200)
  expect(res.response).toBe('SUCCESS')
})
