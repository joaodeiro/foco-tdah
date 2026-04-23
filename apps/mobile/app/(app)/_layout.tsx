import { useEffect, useState } from 'react'
import { Redirect, Stack } from 'expo-router'
import { View, Text } from 'react-native'
import { supabase } from '@/lib/supabase'

export default function AppLayout() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  if (authed === null) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="font-serif-italic text-ink-muted text-lg">Kairos</Text>
      </View>
    )
  }

  if (!authed) return <Redirect href="/(auth)/login" />

  return <Stack screenOptions={{ headerShown: false }} />
}
