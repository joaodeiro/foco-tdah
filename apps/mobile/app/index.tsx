import { useEffect, useState } from 'react'
import { Redirect } from 'expo-router'
import { View, Text } from 'react-native'
import { supabase } from '@/lib/supabase'

type State = 'checking' | 'authed' | 'guest'

export default function Index() {
  const [state, setState] = useState<State>('checking')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(session ? 'authed' : 'guest')
    })
  }, [])

  if (state === 'checking') {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="font-serif italic text-ink-muted text-lg">Kairos</Text>
      </View>
    )
  }

  return <Redirect href={state === 'authed' ? '/(app)/hoje' : '/(auth)/login'} />
}
