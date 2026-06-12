import { redirect } from 'next/navigation.js'

export default async function HomePage() {
  redirect('/admin')
}
